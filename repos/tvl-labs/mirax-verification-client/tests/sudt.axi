let owner_unlock := exists i. load_cell_lock_hash(i, SourceInput) = Some(load_script_args());

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
