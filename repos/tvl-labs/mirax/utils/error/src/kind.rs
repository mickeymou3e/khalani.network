use derive_more::Display;

/// Mirax top level error kinds.
#[allow(clippy::upper_case_acronyms, dead_code)]
#[derive(Copy, Clone, Debug, Display, PartialEq, Eq)]
pub enum ErrorKind {
    // Mirax core modules
    API,
    Chain,
    Cli,
    Consensus,
    DB,
    Mempool,
    Narwhal,
    Network,
    Storage,
    Verification,

    // Mirax utils modules
    Codec,
    Crypto,
    Hasher,
    Indexer,
    Logger,
    Metrics,
    Parser,
    Primitive,
    Signal,
    Time,
    Types,
}
