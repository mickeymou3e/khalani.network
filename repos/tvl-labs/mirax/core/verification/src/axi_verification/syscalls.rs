use std::sync::Arc;

use axi_core_semantics::{
    context::ExternalEval,
    proposition::{Term, Type},
};
use mirax_types::{Bytes, CellMeta, H256};

use crate::resolver::ResolvedTransaction;

use super::ScriptGroup;
use crate::CellDataProvider;

// function load_script_args() -> Bytes;
pub struct LoadScriptArgs {
    pub args: Bytes,
}

impl ExternalEval for LoadScriptArgs {
    fn eval(&self, _: &[Term]) -> Result<Term, &'static str> {
        Ok(Term::BuiltinBytes(self.args.to_vec()))
    }
}

// function load_tx_hash() -> Bytes;
pub struct LoadTxHash(pub Arc<ResolvedTransaction>);

impl ExternalEval for LoadTxHash {
    fn eval(&self, _: &[Term]) -> Result<Term, &'static str> {
        Ok(Term::BuiltinBytes(self.0.hash.to_vec()))
    }
}

// function load_witness(idx: Nat) -> Bytes;
pub struct LoadWitness(pub Arc<ResolvedTransaction>);

impl ExternalEval for LoadWitness {
    fn eval(&self, params: &[Term]) -> Result<Term, &'static str> {
        match params[0] {
            Term::BuiltinNat(ref idx) => {
                let w = match usize::try_from(idx) {
                    Ok(idx) => self.0.witnesses.get(idx).cloned(),
                    _ => None,
                }
                .unwrap_or_default();
                Ok(Term::BuiltinBytes(w.into()))
            }
            _ => unreachable!(),
        }
    }
}

// function load_cell_lock_hash(idx: Nat, source: Source) -> OptionBytes;
pub struct LoadCellLockHash {
    pub transaction: Arc<ResolvedTransaction>,
    pub group: ScriptGroup,
}

impl LoadCellLockHash {
    fn load_cell_lock_hash(&self, idx: usize, source: Source) -> Option<H256> {
        let l = match source {
            Source::Input => {
                let input = self.transaction.resolved_inputs.get(idx)?;
                &input.lock
            }
            Source::Output => {
                let output = self.transaction.resolved_outputs.get(idx)?;
                &output.lock
            }
            Source::GroupInput => {
                let input_idx = self.group.input_indexes.get(idx)?;
                &self.transaction.resolved_inputs[*input_idx].lock
            }
            Source::GroupOutput => {
                let output_idx = self.group.output_indexes.get(idx)?;
                &self.transaction.resolved_outputs[*output_idx].lock
            }
        };
        Some(l.calc_hash())
    }
}

impl ExternalEval for LoadCellLockHash {
    fn eval(&self, params: &[Term]) -> Result<Term, &'static str> {
        match (&params[0], &params[1]) {
            (Term::BuiltinNat(idx), Term::Constant(source, _)) => {
                let source = map_source(source);
                let hash = self.load_cell_lock_hash(idx.try_into().unwrap(), source);
                Ok(match hash {
                    Some(hash) => some_bytes(hash.to_vec()),
                    None => none_bytes(),
                })
            }
            _ => unreachable!(),
        }
    }
}

// function load_cell_type_hash(idx: Nat, source: Source) -> OptionBytes;
pub struct LoadCellTypeHash {
    pub transaction: Arc<ResolvedTransaction>,
    pub group: ScriptGroup,
}

impl LoadCellTypeHash {
    fn load_cell_type_hash(&self, idx: usize, source: Source) -> Option<H256> {
        let t = match source {
            Source::Input => {
                let input = self.transaction.resolved_inputs.get(idx)?;
                input.type_.as_ref()?
            }
            Source::Output => {
                let output = self.transaction.resolved_outputs.get(idx)?;
                output.type_.as_ref()?
            }
            Source::GroupInput => {
                let input_idx = self.group.input_indexes.get(idx)?;
                self.transaction.resolved_inputs[*input_idx]
                    .type_
                    .as_ref()?
            }
            Source::GroupOutput => {
                let output_idx = self.group.output_indexes.get(idx)?;
                self.transaction.resolved_outputs[*output_idx]
                    .type_
                    .as_ref()?
            }
        };
        Some(t.calc_hash())
    }
}

impl ExternalEval for LoadCellTypeHash {
    fn eval(&self, params: &[Term]) -> Result<Term, &'static str> {
        match (&params[0], &params[1]) {
            (Term::BuiltinNat(idx), Term::Constant(source, _)) => {
                let source = map_source(source);
                let hash = self.load_cell_type_hash(idx.try_into().unwrap(), source);
                Ok(match hash {
                    Some(hash) => some_bytes(hash.to_vec()),
                    None => none_bytes(),
                })
            }
            _ => unreachable!(),
        }
    }
}

enum Source {
    Input,
    Output,
    GroupInput,
    GroupOutput,
}

// function load_cell_data(idx: Nat, source: Source) -> OptionBytes;
pub struct LoadCellData<Loader> {
    pub transaction: Arc<ResolvedTransaction>,
    pub group: ScriptGroup,
    pub loader: Arc<Loader>,
}

impl<Loader> LoadCellData<Loader>
where
    Loader: CellDataProvider<CellMeta>,
{
    fn load_cell_data(&self, idx: usize, source: Source) -> Option<Bytes> {
        match source {
            Source::Input => {
                let input = self.transaction.resolved_inputs.get(idx)?;
                self.loader.load_cell_data(input)
            }
            Source::Output => self
                .transaction
                .resolved_outputs
                .get(idx)
                .map(|c| c.mem_cell_data.clone().unwrap()),
            Source::GroupInput => {
                let c = &self.transaction.resolved_inputs[*self.group.input_indexes.get(idx)?];
                self.loader.load_cell_data(c)
            }
            Source::GroupOutput => self.transaction.resolved_outputs
                [*self.group.output_indexes.get(idx)?]
            .mem_cell_data
            .clone(),
        }
    }
}

impl<Loader> ExternalEval for LoadCellData<Loader>
where
    Loader: CellDataProvider<CellMeta>,
{
    fn eval(&self, params: &[Term]) -> Result<Term, &'static str> {
        match (&params[0], &params[1]) {
            (Term::BuiltinNat(idx), Term::Constant(source, _)) => {
                let source = map_source(source);
                let data = self.load_cell_data(idx.try_into().unwrap(), source);
                Ok(match data {
                    Some(data) => some_bytes(data.to_vec()),
                    None => none_bytes(),
                })
            }
            _ => unreachable!(),
        }
    }
}

pub struct MiraxHash;

impl ExternalEval for MiraxHash {
    fn eval(&self, params: &[Term]) -> Result<Term, &'static str> {
        match &params[0] {
            Term::BuiltinBytes(bs) => {
                use mirax_hasher::{Blake3Hasher, Digest};
                Ok(Term::BuiltinBytes(Blake3Hasher::digest(bs).to_vec()))
            }
            _ => unreachable!(),
        }
    }
}

pub struct Secp256k1Recover;

impl ExternalEval for Secp256k1Recover {
    fn eval(&self, params: &[Term]) -> Result<Term, &'static str> {
        use secp256k1::{
            ecdsa::{RecoverableSignature, RecoveryId},
            Message, PublicKey, SECP256K1,
        };

        fn recover(sig: &[u8], msg: &[u8]) -> Option<PublicKey> {
            let msg = Message::from_digest(msg.try_into().ok()?);
            let rec_id = RecoveryId::try_from(sig[0] as i32).ok()?;
            let sig = RecoverableSignature::from_compact(&sig[1..], rec_id).ok()?;
            SECP256K1.recover_ecdsa(&msg, &sig).ok()
        }

        match (&params[0], &params[1]) {
            (Term::BuiltinBytes(sig), Term::BuiltinBytes(msg)) => {
                let pk = recover(sig, msg);
                Ok(match pk {
                    Some(pk) => some_bytes(pk.serialize().to_vec()),
                    None => none_bytes(),
                })
            }
            _ => unreachable!(),
        }
    }
}

pub struct BytesToNat;

impl ExternalEval for BytesToNat {
    fn eval(&self, params: &[Term]) -> Result<Term, &'static str> {
        match &params[0] {
            Term::BuiltinBytes(bs) => {
                // TODO: BigUint Bytes.
                Ok(Term::BuiltinNat(
                    u128::from_le_bytes(bs[..].try_into().unwrap()).into(),
                ))
            }
            _ => unreachable!(),
        }
    }
}

pub struct BytesSlice;

impl ExternalEval for BytesSlice {
    fn eval(&self, params: &[Term]) -> Result<Term, &'static str> {
        match (&params[0], &params[1], &params[2]) {
            (Term::BuiltinBytes(bs), Term::BuiltinNat(start), Term::BuiltinNat(end)) => {
                let start: usize = start.try_into().unwrap();
                let end: usize = end.try_into().unwrap();

                Ok(Term::BuiltinBytes(
                    bs.iter()
                        .skip(start)
                        .take(end.saturating_sub(start))
                        .copied()
                        .collect(),
                ))
            }
            _ => unreachable!(),
        }
    }
}

fn map_source(source: &str) -> Source {
    match source {
        "SourceInput" => Source::Input,
        "SourceOutput" => Source::Output,
        "SourceGroupInput" => Source::GroupInput,
        "SourceGroupOutput" => Source::GroupOutput,
        _ => unreachable!(),
    }
}

fn some_bytes(bs: Vec<u8>) -> Term {
    Term::FunctionApp(
        "Some".into(),
        vec![Term::BuiltinBytes(bs)],
        Type::new("OptionBytes"),
    )
}

fn none_bytes() -> Term {
    Term::Constant("None".into(), Type::new("OptionBytes"))
}
