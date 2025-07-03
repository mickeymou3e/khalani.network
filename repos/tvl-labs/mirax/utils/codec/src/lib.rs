mod bcs;
mod error;
mod hex;

pub use bcs::{Bcs, MAX_BCS_RECURSION_DEPTH};
pub use faster_hex::withpfx_lowercase;
pub use hex::Hex;

use mirax_primitive::{Bytes, MiraxResult};

/// The binary to text encoding and decoding trait.
pub trait TextCodec {
    /// Encode the binary data to a text string.
    fn encode<T: AsRef<[u8]>>(src: T) -> String;

    /// Decode the text string to binary data.
    fn decode(src: &str) -> MiraxResult<Vec<u8>>;
}

/// The object to binary encoding and decoding trait.
pub trait BinaryCodec<'a, T> {
    /// Encode the object to binary data.
    fn encode(obj: &T) -> MiraxResult<Bytes>;

    /// Decode the binary data to an object.
    fn decode(bytes: &'a [u8]) -> MiraxResult<T>;
}
