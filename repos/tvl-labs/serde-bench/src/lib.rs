mod block;
mod cell;
mod transaction;
mod util;

pub use block::*;
pub use cell::*;
pub use transaction::*;
pub use util::*;

use alloy_primitives::{FixedBytes, Uint};
use bytes::Bytes;

type H256 = FixedBytes<32>;

fn borsh_serialize_bytes<W>(value: &Bytes, writer: &mut W) -> Result<(), borsh::io::Error>
where
    W: borsh::io::Write,
{
    borsh::BorshSerialize::serialize(&value.to_vec(), writer)?;
    Ok(())
}

fn borsh_deserialize_bytes<R>(reader: &mut R) -> Result<Bytes, borsh::io::Error>
where
    R: borsh::io::Read,
{
    let raw: Vec<u8> = borsh::BorshDeserialize::deserialize_reader(reader)?;
    Ok(raw.into())
}

fn borsh_serialize_bytes_vec<W>(value: &[Bytes], writer: &mut W) -> Result<(), borsh::io::Error>
where
    W: borsh::io::Write,
{
    borsh::BorshSerialize::serialize(
        &value.iter().map(|b| b.to_vec()).collect::<Vec<_>>(),
        writer,
    )?;
    Ok(())
}

fn borsh_deserialize_bytes_vec<R>(reader: &mut R) -> Result<Vec<Bytes>, borsh::io::Error>
where
    R: borsh::io::Read,
{
    let vec: Vec<Vec<u8>> = borsh::BorshDeserialize::deserialize_reader(reader)?;
    Ok(vec.into_iter().map(Bytes::from).collect())
}

fn borsh_serialize_h256<W>(value: &H256, writer: &mut W) -> Result<(), borsh::io::Error>
where
    W: borsh::io::Write,
{
    borsh::BorshSerialize::serialize(&value.0, writer)?;
    Ok(())
}

fn borsh_deserialize_h256<R>(reader: &mut R) -> Result<H256, borsh::io::Error>
where
    R: borsh::io::Read,
{
    Ok(H256::new(borsh::BorshDeserialize::deserialize_reader(
        reader,
    )?))
}

fn borsh_serialize_h256_vec<W>(value: &[H256], writer: &mut W) -> Result<(), borsh::io::Error>
where
    W: borsh::io::Write,
{
    borsh::BorshSerialize::serialize(&value.iter().map(|h| h.0).collect::<Vec<_>>(), writer)?;
    Ok(())
}

fn borsh_deserialize_h256_vec<R>(reader: &mut R) -> Result<Vec<H256>, borsh::io::Error>
where
    R: borsh::io::Read,
{
    let vec: Vec<[u8; 32]> = borsh::BorshDeserialize::deserialize_reader(reader)?;
    Ok(vec.into_iter().map(H256::new).collect())
}

fn borsh_serialize_uint<W, const B: usize, const L: usize>(
    num: &Uint<B, L>,
    writer: &mut W,
) -> Result<(), borsh::io::Error>
where
    W: borsh::io::Write,
{
    borsh::BorshSerialize::serialize(&num.to_le_bytes_vec(), writer)?;
    Ok(())
}

fn borsh_deserialize_uint<R, const B: usize, const L: usize>(
    reader: &mut R,
) -> Result<Uint<B, L>, borsh::io::Error>
where
    R: borsh::io::Read,
{
    let raw: Vec<u8> = borsh::BorshDeserialize::deserialize_reader(reader)?;
    Ok(Uint::from_le_slice(&raw))
}
