use crate::{error::CodecError, BinaryCodec};

use mirax_primitive::{Bytes, MiraxResult};

use std::marker::PhantomData;

use serde::{de::DeserializeOwned, ser::Serialize};

pub const MAX_BCS_RECURSION_DEPTH: usize = 1000;

/// The [bcs](https://github.com/diem/bcs) encoding and decoding handle.
pub struct Bcs<T>(PhantomData<T>);

impl<'a, T: Serialize + DeserializeOwned> BinaryCodec<'a, T> for Bcs<T> {
    fn encode(obj: &T) -> MiraxResult<Bytes> {
        Ok(bcs::to_bytes_with_limit(obj, MAX_BCS_RECURSION_DEPTH)
            .map(Into::into)
            .map_err(CodecError::Bcs)?)
    }

    fn decode(bytes: &'a [u8]) -> MiraxResult<T> {
        Ok(bcs::from_bytes_with_limit(bytes, MAX_BCS_RECURSION_DEPTH).map_err(CodecError::Bcs)?)
    }
}
