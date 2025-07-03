// use alloy_contract::JsonAbi;

fn main() {
    // let out_dir = std::env::var_os("OUT_DIR").unwrap();
    // let dest_path = Path::new(&out_dir).join("intent_book_bindings.rs");
    // let curr_cargo_root = std::env::var("CARGO_MANIFEST_DIR").unwrap();
    // let intent_book_path = Path::new(&curr_cargo_root).join("contracts/arcadia-core-contracts/out/IntentBook.sol/IntentBook.json");

    // // Read the ABI file
    // let abi_source = fs::read_to_string(intent_book_path)
    //     .expect("Failed to read ABI file");

    // // Parse the ABI
    // let abi: JsonAbi = serde_json::from_str(&abi_source)
    //     .expect("Failed to parse ABI JSON");

    // // Generate the bindings
    // let bindings = alloy_contract::generate_bindings(abi)
    //     .expect("Failed to generate bindings");

    // // Write the bindings to file
    // fs::write(dest_path, bindings)
    //     .expect("Failed to write bindings to file");

    // println!("cargo:rerun-if-changed=contracts/arcadia-core-contracts/out/IntentBook.sol/IntentBook.json");
}
