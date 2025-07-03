use mirax_primitive::{BlockNumber, U16};

/// The default block version.
pub const DEFAULT_BLOCK_VERSION: U16 = U16::from_limbs([0]);

/// The default transaction version.
pub const DEFAULT_TRANSACTION_VERSION: U16 = U16::from_limbs([0]);

/// The genesis block number.
pub const GENESIS_NUMBER: BlockNumber = 0;
