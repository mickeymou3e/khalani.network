use std::{collections::HashMap, sync::Arc};

use mirax_hasher::{Blake3Hasher, Digest};
use mirax_types::traits::{CellOutputTrait, OutPointTrait};
use mirax_types::{
    Byte36, Bytes, CellDep, CellInput, CellMeta, CellOutput, DepType, Header, OutPoint, Proof,
    Script, ScriptGroupType, ScriptHashType, Transaction, H256,
};

use crate::axi_verification::to_script;
use crate::{
    AxiVerifier, CellDataProvider, CellProvider, ExtensionProvider, HeaderProvider,
    TransactionVerification, VerificationContext,
};

#[derive(Default)]
pub struct Context {
    cells: HashMap<Byte36, (CellOutput, Bytes)>,
}

impl Context {
    pub fn deploy_cell(&mut self, data: impl Into<Bytes>) -> OutPoint {
        self.deploy_cell_with_lock(
            data,
            Script {
                args: Bytes::new(),
                code_hash: [0u8; 32].into(),
                hash_type: ScriptHashType::Data,
            },
        )
    }

    pub fn deploy_cell_with_lock(&mut self, data: impl Into<Bytes>, lock: Script) -> OutPoint {
        let data = data.into();
        let out_point = OutPoint::random();
        let output = CellOutput {
            capacity: (data.len() + 200) as u64,
            lock,
            type_: None,
        };
        self.cells.insert(out_point.cell_key(), (output, data));
        out_point
    }

    pub fn deploy_cell_with_type_and_lock(
        &mut self,
        data: impl Into<Bytes>,
        _type: Script,
        lock: Script,
    ) -> OutPoint {
        let data = data.into();
        let out_point = OutPoint::random();
        let output = CellOutput {
            capacity: (data.len() + 200) as u64,
            lock,
            type_: Some(_type),
        };
        self.cells.insert(out_point.cell_key(), (output, data));
        out_point
    }

    pub fn build_script(&self, out_point: &OutPoint, args: impl Into<Bytes>) -> Script {
        let code_hash = Blake3Hasher::digest(&self.cells[&out_point.cell_key()].1);
        Script {
            code_hash,
            hash_type: ScriptHashType::Data,
            args: args.into(),
        }
    }
}

impl CellProvider<CellMeta> for Context {
    fn get_cell(&self, out_point: &impl OutPointTrait) -> Option<CellMeta> {
        self.cells
            .get(&out_point.cell_key())
            .map(|(c, d)| CellMeta {
                capacity: c.capacity,
                lock: to_script(c.lock()),
                type_: c.type_.as_ref().map(to_script),
                out_point: OutPoint::new(out_point.tx_hash(), out_point.index()),
                data_bytes: d.len() as u64,
                mem_cell_data: Some(d.clone()),
                mem_cell_data_hash: Some(Blake3Hasher::digest(d)),
            })
    }
}

impl CellDataProvider<CellMeta> for Context {
    fn get_cell_data(&self, key: Byte36) -> Option<Bytes> {
        self.cells.get(&key).map(|(_, d)| d.clone())
    }

    fn get_cell_data_hash(&self, key: Byte36) -> Option<H256> {
        self.cells.get(&key).map(|(_, d)| Blake3Hasher::digest(d))
    }
}

impl HeaderProvider for Context {
    fn get_header(&self, _: &H256) -> Option<Header> {
        None
    }
}

impl ExtensionProvider for Context {
    fn get_block_extension(&self, _: &H256) -> Option<Bytes> {
        None
    }
}

impl VerificationContext<CellMeta> for Context {}

fn try_init_logger() {
    _ = env_logger::Builder::from_env(env_logger::Env::new().default_filter_or("info")).try_init();
}

#[test]
fn test_always_success_lock() {
    try_init_logger();

    let mut context = Context::default();
    let always_success_lock = context.deploy_cell("true");

    let always_success_lock_script = context.build_script(&always_success_lock, "");
    let always_success_lock_script_hash = always_success_lock_script.calc_hash();
    let locked_by_always_success = context.deploy_cell_with_lock("", always_success_lock_script);

    let spending_tx = TransactionBuilder::new()
        .input(locked_by_always_success)
        .cell_dep(always_success_lock)
        .prove_lock(always_success_lock_script_hash, "!true_intro()")
        .build();

    let v = AxiVerifier::new(Arc::new(context), &spending_tx).unwrap();
    v.verify_transaction(&spending_tx).unwrap();
}

#[test]
fn test_sighash_lock() {
    try_init_logger();

    let mut context = Context::default();
    let sig_verify_lock = context.deploy_cell(
        r#"function or_empty(opt: OptionBytes) -> Bytes {
    match opt {
        Some(bs) => bs,
        None => 0x00,
    }
}

let goal := exists i. bytes_slice(mirax_hash(or_empty(secp256k1_recover(load_witness(i), load_tx_hash()))), 0, 20) = load_script_args();

proc by_signature_in_witness(i) {
    !prove_by_eval(bytes_slice(mirax_hash(or_empty(secp256k1_recover(load_witness(i), load_tx_hash()))), 0, 20) = load_script_args());
    !egen(goal, i);
}

goal"#,
    );

    let (secret_key, public_key) = secp256k1::generate_keypair(&mut secp256k1::rand::rngs::OsRng);

    let sig_verify_lock_script = context.build_script(
        &sig_verify_lock,
        Blake3Hasher::digest(public_key.serialize())[..20].to_vec(),
    );
    let sig_verify_lock_script_hash = sig_verify_lock_script.calc_hash();
    let input = context.deploy_cell_with_lock("", sig_verify_lock_script);

    let mut spending_tx = TransactionBuilder::new()
        .input(input)
        .cell_dep(sig_verify_lock)
        .prove_lock(
            sig_verify_lock_script_hash,
            r#"!by_signature_in_witness(0)"#,
        )
        .build();

    let message = secp256k1::Message::from_digest(spending_tx.calc_hash().0);
    let signature = secp256k1::SECP256K1.sign_ecdsa_recoverable(&message, &secret_key);
    let (rec_id, sig) = signature.serialize_compact();
    let sig: Vec<u8> = [i32::from(rec_id) as u8].into_iter().chain(sig).collect();
    spending_tx.witnesses.push(sig.to_vec().into());

    AxiVerifier::new(Arc::new(context), &spending_tx)
        .unwrap()
        .verify_transaction(&spending_tx)
        .unwrap();
}

const SUDT_TYPE_SCRIPT: &str = r#"let owner_unlock := exists i. load_cell_lock_hash(i, SourceInput) = Some(load_script_args());

function cell_sum_go(sum: Nat, idx: Nat, source: Source) -> Nat {
    match load_cell_data(idx, source) {
        Some(amt_bytes) => cell_sum_go(sum add bytes_to_nat(bytes_slice(amt_bytes, 0, 16)), idx add 1, source),
        None => sum,
    }
}

function cell_sum(source: Source) -> Nat {
    cell_sum_go(0, 0, source)
}

let valid_transfer := cell_sum(SourceGroupOutput) le cell_sum(SourceGroupInput);

proc by_valid_transfer() {
    !prove_by_eval(valid_transfer);
    !right_either(owner_unlock, valid_transfer);
}

proc by_owner_unlock(i) {
    !prove_by_eval(load_cell_lock_hash(i, SourceInput) = Some(load_script_args()));
    !egen(owner_unlock, i);
    !left_either(owner_unlock, valid_transfer);
}

owner_unlock | valid_transfer
"#;

#[test]
fn test_sudt_mint() {
    try_init_logger();

    let mut context = Context::default();
    let always_success_lock = context.deploy_cell("true");

    let always_success_lock_script = context.build_script(&always_success_lock, "");
    let always_success_lock_script_hash = always_success_lock_script.calc_hash();
    let always_succss_input = context.deploy_cell_with_lock("", always_success_lock_script.clone());

    let sudt_program_cell = context.deploy_cell(SUDT_TYPE_SCRIPT);
    let sudt_script =
        context.build_script(&sudt_program_cell, always_success_lock_script_hash.to_vec());
    let sudt_script_hash = sudt_script.calc_hash();

    let mint_tx = TransactionBuilder::new()
        .cell_dep(always_success_lock)
        .cell_dep(sudt_program_cell)
        .input(always_succss_input)
        .output(
            CellOutput {
                capacity: 0,
                lock: always_success_lock_script.clone(),
                type_: Some(sudt_script.clone()),
            },
            amount_to_bytes(100),
        )
        .prove_lock(always_success_lock_script_hash, "!true_intro()")
        .prove_type(sudt_script_hash, r#"!by_owner_unlock(0)"#)
        .build();

    AxiVerifier::new(Arc::new(context), &mint_tx)
        .unwrap()
        .verify_transaction(&mint_tx)
        .unwrap();
}

#[test]
fn test_sudt_transfer() {
    try_init_logger();

    let mut context = Context::default();
    let owner_lock = context.deploy_cell("true");

    let owner_lock_script = context.build_script(&owner_lock, "");
    let owner_lock_script_hash = owner_lock_script.calc_hash();

    let sudt_program_cell = context.deploy_cell(SUDT_TYPE_SCRIPT);
    let sudt_script = context.build_script(&sudt_program_cell, owner_lock_script_hash.to_vec());
    let sudt_script_hash = sudt_script.calc_hash();

    let input = context.deploy_cell_with_type_and_lock(
        amount_to_bytes(200),
        sudt_script.clone(),
        owner_lock_script.clone(),
    );

    let mut transfer_tx = TransactionBuilder::new()
        .cell_dep(owner_lock)
        .cell_dep(sudt_program_cell)
        .input(input)
        .output(
            CellOutput {
                capacity: 0,
                lock: owner_lock_script.clone(),
                type_: Some(sudt_script.clone()),
            },
            amount_to_bytes(100),
        )
        .output(
            CellOutput {
                capacity: 0,
                lock: owner_lock_script,
                type_: Some(sudt_script),
            },
            amount_to_bytes(100),
        )
        .prove_lock(owner_lock_script_hash, "!true_intro()")
        .prove_type(sudt_script_hash, r#"!by_valid_transfer()"#)
        .build();

    let ctx = Arc::new(context);
    AxiVerifier::new(ctx.clone(), &transfer_tx)
        .unwrap()
        .verify_transaction(&transfer_tx)
        .unwrap();

    // Should fail if output amount exceeds input.
    transfer_tx.outputs_data[1] = amount_to_bytes(101);
    AxiVerifier::new(ctx.clone(), &transfer_tx)
        .unwrap()
        .verify_transaction(&transfer_tx)
        .unwrap_err();
}

const SWAP_LOCK_PROGRAM: &str = r#"
let args := load_script_args();
let required_token_amount := bytes_slice(args, 0, 16);
let required_token_type_hash := bytes_slice(args, 16, 48);
let owner_lock_hash := bytes_slice(args, 48, 80);
let nonce := bytes_slice(args, 80, 104);

let only_one_input := load_cell_lock_hash(1, SourceGroupInput) = None;
function or_empty(opt: OptionBytes) -> Bytes {
    match opt {
        Some(bs) => bs,
        None => 0x00,
    }
}

function cell_matches(idx: Nat) -> Boolean {
    let data := or_empty(load_cell_data(idx, SourceOutput));

    load_cell_lock_hash(idx, SourceOutput) = Some(owner_lock_hash)
        & load_cell_type_hash(idx, SourceOutput) = Some(required_token_type_hash)
        & bytes_slice(data, 0, 16) = required_token_amount
        & bytes_slice(data, 16, 40) = nonce
}
let swap_unlock := exists i. cell_matches(i);

let owner_unlock := exists i. load_cell_lock_hash(i, SourceInput) = Some(owner_lock_hash);

proc by_swap_unlock(i) {
    !prove_by_eval(only_one_input);
    !prove_by_eval(cell_matches(i));
    !egen(swap_unlock, i);
    !both(only_one_input, swap_unlock);
    !left_either(only_one_input & swap_unlock, owner_unlock)
}

(only_one_input & swap_unlock) | owner_unlock
"#;

#[test]
fn test_swap() {
    try_init_logger();

    let mut context = Context::default();
    let always_success_lock_cell = context.deploy_cell("true");

    let token1_owner_lock_script = context.build_script(&always_success_lock_cell, "token1");
    let token1_owner_lock_script_hash = token1_owner_lock_script.calc_hash();
    let token2_owner_lock_script = context.build_script(&always_success_lock_cell, "token2");
    let token2_owner_lock_script_hash = token2_owner_lock_script.calc_hash();

    let sudt_program_cell = context.deploy_cell(SUDT_TYPE_SCRIPT);

    let token1_sudt_script =
        context.build_script(&sudt_program_cell, token1_owner_lock_script_hash.to_vec());
    let token1_sudt_script_hash = token1_sudt_script.calc_hash();

    let token2_sudt_script =
        context.build_script(&sudt_program_cell, token2_owner_lock_script_hash.to_vec());
    let token2_sudt_script_hash = token2_sudt_script.calc_hash();

    let swap_lock_program_cell = context.deploy_cell(SWAP_LOCK_PROGRAM);
    // Swap for 100 token2 with 90 token1.
    let swap_nonce: [u8; 24] = rand::Rng::gen(&mut rand::thread_rng());
    let swap_lock_args: Bytes = amount_to_bytes(100)
        .into_iter()
        .chain(token2_sudt_script_hash)
        .chain(token1_owner_lock_script_hash)
        .chain(swap_nonce)
        .collect();
    assert_eq!(swap_lock_args.len(), 104);
    let swap_lock_script = context.build_script(&swap_lock_program_cell, swap_lock_args);
    let swap_lock_script_hash = swap_lock_script.calc_hash();

    let swap_input = context.deploy_cell_with_type_and_lock(
        amount_to_bytes(90),
        token1_sudt_script.clone(),
        swap_lock_script.clone(),
    );

    let token2_input = context.deploy_cell_with_type_and_lock(
        amount_to_bytes(100),
        token2_sudt_script.clone(),
        token2_owner_lock_script.clone(),
    );

    let swap_tx = TransactionBuilder::new()
        .cell_dep(always_success_lock_cell)
        .cell_dep(swap_lock_program_cell)
        .cell_dep(sudt_program_cell)
        .input(swap_input)
        .input(token2_input)
        // 100 token2 for owner1 and 90 token1 for owner2.
        .output(
            CellOutput {
                capacity: 0,
                type_: Some(token2_sudt_script),
                lock: token1_owner_lock_script,
            },
            amount_to_bytes(100).into_iter().chain(swap_nonce).collect::<Bytes>(),
        )
        .output(
            CellOutput {
                capacity: 0,
                type_: Some(token1_sudt_script),
                lock: token2_owner_lock_script,
            },
            amount_to_bytes(90),
        )
        .prove_lock(
            token2_owner_lock_script_hash,
            "!true_intro()",
        )
        .prove_type(
            token1_sudt_script_hash,
            r#"!by_valid_transfer()"#,
        )
        .prove_type(
            token2_sudt_script_hash,
            r#"!by_valid_transfer()"#,
        )
        .prove_lock(
            swap_lock_script_hash,
            r#"!by_swap_unlock(0)"#,
        )
        .build();

    AxiVerifier::new(Arc::new(context), &swap_tx)
        .unwrap()
        .verify_transaction(&swap_tx)
        .unwrap();
}

fn amount_to_bytes(amount: u128) -> Bytes {
    amount.to_le_bytes().into_iter().collect()
}

struct TransactionBuilder {
    tx: Transaction,
}

impl TransactionBuilder {
    fn new() -> Self {
        Self {
            tx: Transaction::default(),
        }
    }

    fn cell_dep(mut self, out_point: OutPoint) -> Self {
        self.tx.cell_deps.push(CellDep {
            out_point,
            dep_type: DepType::Code,
        });
        self
    }

    fn input(mut self, previous_output: OutPoint) -> Self {
        self.tx.inputs.push(CellInput {
            previous_output,
            since: 0,
        });
        self
    }

    fn output(mut self, output: CellOutput, data: impl Into<Bytes>) -> Self {
        self.tx.outputs.push(output);
        self.tx.outputs_data.push(data.into());
        self
    }

    fn prove_lock(mut self, script_hash: H256, proof: impl Into<String>) -> Self {
        self.tx.proofs.push(Proof {
            script_group_type: ScriptGroupType::Lock,
            script_hash,
            proof_program: proof.into(),
        });
        self
    }

    fn prove_type(mut self, script_hash: H256, proof: impl Into<String>) -> Self {
        self.tx.proofs.push(Proof {
            script_group_type: ScriptGroupType::Type,
            script_hash,
            proof_program: proof.into(),
        });
        self
    }

    fn build(self) -> Transaction {
        self.tx
    }
}
