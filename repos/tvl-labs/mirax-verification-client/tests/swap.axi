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
