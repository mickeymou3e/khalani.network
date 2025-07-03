inductive Source {
    SourceInput,
    SourceOutput,
    SourceGroupInput,
    SourceGroupOutput,
}

inductive OptionBytes {
    None,
    Some(Bytes),
}

function load_script_args() -> Bytes;

function load_tx_hash() -> Bytes;

function load_witness(idx: Nat) -> Bytes;

function load_cell_lock_hash(idx: Nat, source: Source) -> OptionBytes;

function load_cell_type_hash(idx: Nat, source: Source) -> OptionBytes;

function load_cell_data(idx: Nat, source: Source) -> OptionBytes;

function mirax_hash(bs: Bytes) -> Bytes;

function secp256k1_recover(signature: Bytes, hash: Bytes) -> OptionBytes;

# TODO: these should be provided by Axi?
function bytes_to_nat(bs: Bytes) -> Nat;

function bytes_slice(bs: Bytes, start_idx: Nat, end_idx: Nat) -> Bytes;
