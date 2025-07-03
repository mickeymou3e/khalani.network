function or_empty(opt: OptionBytes) -> Bytes {
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

goal
