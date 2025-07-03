pub mod builder;
mod syscalls;
#[cfg(test)]
mod tests;

use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use ariadne::Source;
use axi_core_semantics::interpreter::{InterResultInner, Interpreter};
use axi_parser::{lex::lexer, parser::stmts_all};

use mirax_crypto::Signature;
use mirax_hasher::{Blake3Hasher, Digest};
use mirax_types::traits::{
    CellDepTrait, CellInputTrait, CellMetaTrait, CellOutputTrait, OutPointTrait, ProofTrait,
    ScriptTrait, TransactionTrait,
};
use mirax_types::{
    BlockEnvelope, Bytes, CellMeta, MiraxResult, OutPoint, Proof, Script, ScriptGroupType,
    ScriptHashType, VerifyResult, H256,
};

use crate::resolver::ResolvedTransaction;
use crate::{error::*, traits::*};

type Result<T> = std::result::Result<T, VerificationError>;

#[derive(Clone)]
pub struct VerifyCtx<Cx: VerificationContext<CellMeta>> {
    inner: Arc<Cx>,
}

impl<Cx: VerificationContext<CellMeta>> VerifyCtx<Cx> {
    pub fn new(inner: Arc<Cx>) -> Self {
        Self { inner }
    }

    fn resolve_cell(&self, out_point: &impl OutPointTrait) -> MiraxResult<CellMeta> {
        let key = out_point.cell_key();
        let cell = self
            .inner
            .get_cell(out_point)
            .ok_or_else(|| VerificationError::UnknownCell(format!("{:?}", key)))?;
        let cell_data = self
            .inner
            .get_cell_data(key)
            .ok_or_else(|| VerificationError::UnknownCell(format!("{:?}", key)))?;
        let data_hash = Blake3Hasher::digest(&cell_data);

        Ok(CellMeta {
            capacity: cell.capacity(),
            lock: to_script(cell.lock()),
            type_: cell.type_().as_ref().map(to_script),
            out_point: OutPoint {
                tx_hash: out_point.tx_hash(),
                index: out_point.index(),
            },
            data_bytes: cell_data.len() as u64,
            mem_cell_data: Some(cell_data),
            mem_cell_data_hash: Some(data_hash),
        })
    }

    fn resolve_cell_deps(&self, tx: &impl TransactionTrait) -> MiraxResult<Vec<CellMeta>> {
        let mut resolved_cell_deps = Vec::with_capacity(tx.cell_deps().len());
        for c in tx.cell_deps() {
            resolved_cell_deps.push(self.resolve_cell(c.out_point())?);
        }

        Ok(resolved_cell_deps)
    }

    fn resolve_inputs(&self, tx: &impl TransactionTrait) -> MiraxResult<Vec<CellMeta>> {
        let mut resolved_inputs = Vec::with_capacity(tx.inputs().len());
        for i in tx.inputs() {
            resolved_inputs.push(self.resolve_cell(i.previous_output())?);
        }

        Ok(resolved_inputs)
    }

    fn resolve_outputs(&self, tx: &impl TransactionTrait) -> MiraxResult<Vec<CellMeta>> {
        let mut resolved_outputs = Vec::with_capacity(tx.outputs().len());

        for (i, (cell, data)) in tx.outputs_iter().zip(tx.outputs_data().iter()).enumerate() {
            resolved_outputs.push(CellMeta {
                capacity: cell.capacity(),
                lock: to_script(cell.lock()),
                type_: cell.type_().as_ref().map(to_script),
                out_point: OutPoint {
                    tx_hash: TransactionTrait::hash(tx),
                    index: i as u32,
                },
                data_bytes: data.len() as u64,
                mem_cell_data: Some(data.clone()),
                mem_cell_data_hash: Some(Blake3Hasher::digest(data)),
            });
        }

        Ok(resolved_outputs)
    }

    /// Todo: Implement dep groups.   
    fn resolve_dep_groups(&self, _tx: &impl TransactionTrait) -> MiraxResult<Vec<CellMeta>> {
        Ok(Vec::new())
    }
}

impl<Cx: VerificationContext<CellMeta>> TransactionResolver for VerifyCtx<Cx> {
    fn resolve_transaction(&self, tx: &impl TransactionTrait) -> MiraxResult<ResolvedTransaction> {
        let rtx = ResolvedTransaction {
            version: tx.version(),
            hash: TransactionTrait::hash(tx),
            header_deps: tx.header_deps().to_vec(),
            resolved_cell_deps: self.resolve_cell_deps(tx)?,
            resolved_inputs: self.resolve_inputs(tx)?,
            resolved_dep_groups: self.resolve_dep_groups(tx)?,
            resolved_outputs: self.resolve_outputs(tx)?,
            witnesses: tx.witnesses().to_vec(),
            proofs: tx
                .proofs_iter()
                .map(|p| Proof {
                    proof_program: p.proof_program(),
                    script_hash: p.script_hash(),
                    script_group_type: p.script_group_type().into(),
                })
                .collect(),
        };

        Ok(rtx)
    }
}

#[derive(Clone)]
pub struct AxiVerifier<Cx: VerificationContext<CellMeta>> {
    ctx: VerifyCtx<Cx>,
    rtx: Arc<ResolvedTransaction>,
}

impl<Cx: VerificationContext<CellMeta>> AxiVerifier<Cx> {
    pub fn new(ctx: Arc<Cx>, tx: &impl TransactionTrait) -> MiraxResult<Self> {
        let ctx = VerifyCtx::new(ctx);
        let rtx = Arc::new(ctx.resolve_transaction(tx)?);
        Ok(Self { ctx, rtx })
    }

    pub fn ctx(&self) -> Arc<Cx> {
        Arc::clone(&self.ctx.inner)
    }

    pub fn rtx(&self) -> Arc<ResolvedTransaction> {
        Arc::clone(&self.rtx)
    }
}

impl<Cx, Tx> TransactionVerification<Tx> for AxiVerifier<Cx>
where
    Cx: VerificationContext<CellMeta> + 'static,
    Tx: TransactionTrait,
{
    fn verify_transaction(&self, tx: &Tx) -> MiraxResult<VerifyResult> {
        let mut binaries_by_data_hash: HashMap<H256, LazyData> = HashMap::default();
        let mut binaries_by_type_hash: HashMap<H256, Binaries> = HashMap::default();

        for dep in self.rtx.resolved_cell_deps.iter() {
            let data_hash = self
                .ctx()
                .load_cell_data_hash(dep)
                .ok_or_else(|| VerificationError::UnknownCell(format!("{:?}", dep.out_point)))?;
            let lazy = LazyData::from_cell_meta(dep);
            binaries_by_data_hash.insert(data_hash.to_owned(), lazy.clone());
            if let Some(ref t) = dep.type_ {
                binaries_by_type_hash
                    .entry(t.calc_hash())
                    .and_modify(|bin| bin.merge(&data_hash))
                    .or_insert_with(|| Binaries::new(data_hash, lazy));
            }
        }

        let mut lock_groups = HashMap::new();
        let mut type_groups = HashMap::new();

        for (idx, input) in self.rtx.resolved_inputs.iter().enumerate() {
            lock_groups
                .entry(&input.lock)
                .or_insert_with(|| ScriptGroup::from_lock_script(input.lock.clone()))
                .input_indexes
                .push(idx);

            if let Some(ref t) = input.type_ {
                type_groups
                    .entry(t)
                    .or_insert_with(|| ScriptGroup::from_type_script(t.clone()))
                    .input_indexes
                    .push(idx);
            }
        }

        for (idx, output) in self.rtx.resolved_outputs.iter().enumerate() {
            if let Some(t) = &output.type_() {
                type_groups
                    .entry(t)
                    .or_insert_with(|| ScriptGroup::from_type_script(t.clone()))
                    .output_indexes
                    .push(idx);
            }
        }

        let get_program = |s: &Script| {
            let l = match s.hash_type {
                ScriptHashType::Data => match binaries_by_data_hash.get(&s.code_hash) {
                    None => return Err(VerificationError::ScriptNotFound(s.code_hash)),
                    Some(l) => l,
                },
                ScriptHashType::Type => match binaries_by_type_hash.get(&s.code_hash) {
                    None => return Err(VerificationError::ScriptNotFound(s.code_hash)),
                    Some(Binaries::Multiple) => return Err(VerificationError::MultipleMatches),
                    Some(Binaries::Unique(_, l)) | Some(Binaries::Duplicate(_, l)) => l,
                },
            };
            l.access(self.ctx())
        };

        for (s, g) in lock_groups {
            log::info!("verifying lock script for inputs: {:?}", g.input_indexes);
            let program = get_program(s)?;
            let mut it = verification_interpreter(self.ctx(), self.rtx(), g);

            let script_hash = s.calc_hash();
            let proof = tx
                .proofs_iter()
                .find(|p| {
                    p.script_hash() == script_hash
                        && p.script_group_type() == ScriptGroupType::Lock as u8
                })
                .ok_or(VerificationError::ValidationFailure)?;
            verify(&mut it, &program, &proof.proof_program())?;
        }

        for (s, g) in type_groups {
            log::info!(
                "verifying type script for inputs {:?} and outputs {:?}",
                g.input_indexes,
                g.output_indexes
            );

            let program = get_program(s)?;
            let mut it = verification_interpreter(self.ctx(), self.rtx(), g);

            let script_hash = s.calc_hash();
            let proof = tx
                .proofs_iter()
                .find(|p| {
                    p.script_hash() == script_hash
                        && p.script_group_type() == ScriptGroupType::Type as u8
                })
                .ok_or(VerificationError::ValidationFailure)?;
            verify(&mut it, &program, &proof.proof_program())?;
        }

        Ok(VerifyResult::Success(0))
    }

    fn verify_transactions(&mut self, txs: Vec<Tx>) -> MiraxResult<Vec<VerifyResult>> {
        let mut results = Vec::with_capacity(txs.len());
        for tx in txs.iter() {
            results.push(self.verify_transaction(tx)?);
            self.rtx = Arc::new(self.ctx.resolve_transaction(tx)?);
        }

        Ok(results)
    }
}

impl<Cx: VerificationContext<CellMeta> + 'static, S: Signature> BlockVerification<BlockEnvelope<S>>
    for AxiVerifier<Cx>
{
    fn verify_block(&mut self, block: &BlockEnvelope<S>) -> MiraxResult<Vec<VerifyResult>> {
        let mut results = Vec::with_capacity(block.transaction_iter().count());
        for tx in block.transaction_iter() {
            results.push(self.verify_transaction(tx)?);
            self.rtx = Arc::new(self.ctx.resolve_transaction(tx)?);
        }

        Ok(results)
    }
}

#[derive(Debug, PartialEq, Eq, Clone)]
enum DataGuard {
    NotLoaded(OutPoint),
    Loaded(Bytes),
}

/// LazyData wrapper make sure not-loaded data will be loaded only after one access
#[derive(Debug, Clone)]
struct LazyData(Arc<Mutex<DataGuard>>);

impl LazyData {
    fn from_cell_meta(cell_meta: &CellMeta) -> LazyData {
        match &cell_meta.mem_cell_data {
            Some(data) => LazyData(Arc::new(Mutex::new(DataGuard::Loaded(data.clone())))),
            None => LazyData(Arc::new(Mutex::new(DataGuard::NotLoaded(
                cell_meta.out_point.clone(),
            )))),
        }
    }

    fn access<DL: CellDataProvider<CellMeta>>(&self, data_loader: Arc<DL>) -> Result<Bytes> {
        let mut guard = self.0.lock().unwrap();
        match &*guard {
            DataGuard::NotLoaded(out_point) => {
                let data = data_loader
                    .get_cell_data(out_point.cell_key())
                    .ok_or_else(|| VerificationError::UnknownCell(format!("{:?}", out_point)))?;
                *guard = DataGuard::Loaded(data.clone());
                Ok(data)
            }
            DataGuard::Loaded(bytes) => Ok(bytes.clone()),
        }
    }
}

#[derive(Debug, Clone)]
enum Binaries {
    Unique(H256, LazyData),
    Duplicate(H256, LazyData),
    Multiple,
}

impl Binaries {
    fn new(data_hash: H256, data: LazyData) -> Self {
        Self::Unique(data_hash, data)
    }

    fn merge(&mut self, data_hash: &H256) {
        match self {
            Self::Unique(ref hash, data) | Self::Duplicate(ref hash, data) => {
                if hash != data_hash {
                    *self = Self::Multiple;
                } else {
                    *self = Self::Duplicate(hash.to_owned(), data.to_owned());
                }
            }
            Self::Multiple => {}
        }
    }
}

#[derive(Clone)]
struct ScriptGroup {
    script: Script,
    _type: ScriptGroupType,
    input_indexes: Vec<usize>,
    output_indexes: Vec<usize>,
}

impl ScriptGroup {
    fn from_lock_script(script: Script) -> Self {
        Self {
            script,
            _type: ScriptGroupType::Lock,
            input_indexes: Vec::new(),
            output_indexes: Vec::new(),
        }
    }

    fn from_type_script(script: Script) -> Self {
        Self {
            script,
            _type: ScriptGroupType::Type,
            input_indexes: Vec::new(),
            output_indexes: Vec::new(),
        }
    }
}

fn verification_interpreter<Loader: CellDataProvider<CellMeta> + 'static>(
    loader: Arc<Loader>,
    tx: Arc<ResolvedTransaction>,
    group: ScriptGroup,
) -> Interpreter {
    use syscalls::*;

    let mut it = Interpreter::new_with_builtins();
    it.allow_assert = false;
    it.use_axiom_translator = false;
    eval_snippet(&mut it, include_str!("decls.axi")).unwrap();
    it.define_external_eval(
        "load_script_args",
        LoadScriptArgs {
            args: group.script.args.clone(),
        },
    );
    it.define_external_eval("load_witness", LoadWitness(tx.clone()));
    it.define_external_eval("load_tx_hash", LoadTxHash(tx.clone()));
    it.define_external_eval(
        "load_cell_lock_hash",
        LoadCellLockHash {
            transaction: tx.clone(),
            group: group.clone(),
        },
    );
    it.define_external_eval(
        "load_cell_type_hash",
        LoadCellTypeHash {
            transaction: tx.clone(),
            group: group.clone(),
        },
    );
    it.define_external_eval(
        "load_cell_data",
        LoadCellData {
            transaction: tx,
            group,
            loader,
        },
    );

    it.define_external_eval("mirax_hash", MiraxHash);
    it.define_external_eval("secp256k1_recover", Secp256k1Recover);

    it.define_external_eval("bytes_to_nat", BytesToNat);
    it.define_external_eval("bytes_slice", BytesSlice);

    it
}

fn verify(it: &mut Interpreter, condition: &Bytes, proof: &str) -> Result<()> {
    let vf = || VerificationError::ValidationFailure;
    log::info!("evaluating the condition");
    let condition_str = std::str::from_utf8(condition).map_err(|e| {
        log::warn!("condition is not valid utf-8: {e}");
        vf()
    })?;
    let condition = eval_snippet(it, condition_str)?;
    let condition = match condition {
        InterResultInner::Proposition(p) => p,
        _ => return Err(vf()),
    };
    log::info!("evaluating the proof");
    let proof = eval_snippet(it, proof)?;
    match proof {
        InterResultInner::Proved(p) if p == condition => Ok(()),
        _ => Err(vf()),
    }
}

fn eval_snippet(it: &mut Interpreter, snippet: &str) -> Result<InterResultInner> {
    let vf = || VerificationError::ValidationFailure;
    let tokens = lexer(snippet);
    let stmts = stmts_all(tokens).map_err(|e| {
        log::warn!("failed to parse Axi snippet");
        if log::log_enabled!(log::Level::Warn) {
            _ = e
                .as_ariadne_report(snippet.len())
                .eprint(Source::from(snippet));
        }
        vf()
    })?;
    let mut last_result = None;
    for stmt in stmts {
        last_result = Some(it.interpret_top(stmt).map_err(|e| {
            log::warn!("eval error: {e}");
            if log::log_enabled!(log::Level::Warn) {
                _ = e.as_ariadne_report().eprint(Source::from(snippet));
            }
            vf()
        })?);
    }
    last_result.ok_or_else(vf)
}

pub(crate) fn to_script(s: &impl ScriptTrait) -> Script {
    Script {
        code_hash: s.code_hash(),
        args: s.args(),
        hash_type: s.hash_type().into(),
    }
}
