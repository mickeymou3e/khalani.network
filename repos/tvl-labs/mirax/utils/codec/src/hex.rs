use crate::{error::CodecError, TextCodec};
use mirax_primitive::{MiraxResult, HEX_PREFIX};

/// The hexadecimal encoding and decoding handle.
pub struct Hex;

impl TextCodec for Hex {
    fn encode<T: AsRef<[u8]>>(src: T) -> String {
        HEX_PREFIX.to_string() + &faster_hex::hex_string(src.as_ref())
    }

    fn decode(src: &str) -> MiraxResult<Vec<u8>> {
        if src.is_empty() {
            return Ok(Vec::new());
        }

        let src = if src.starts_with("0x") {
            src.split_at(2).1
        } else {
            src
        };

        let src = src.as_bytes();
        let mut ret = vec![0u8; src.len() / 2];
        faster_hex::hex_decode(src, &mut ret).map_err(CodecError::HexDecode)?;

        Ok(ret)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_case(src: &[u8], hex: &str) {
        let encoded = Hex::encode(src);
        assert_eq!(encoded, hex);
        let decoded = Hex::decode(&encoded).unwrap();
        assert_eq!(decoded, src);
    }

    #[test]
    fn test_hex() {
        test_case(b"", "0x");
        test_case(b"hello", "0x68656c6c6f");
        test_case(b"world", "0x776f726c64");
        test_case(b"hello world", "0x68656c6c6f20776f726c64");
    }
}
