fn main() {
    #[cfg(feature = "test-parser")]
    lalrpop::process_root().unwrap();
}
