use alloy_primitives::private::derive_more::Display;
use anyhow::anyhow;
use serde::{Deserialize, Serialize};
use strum::IntoEnumIterator;
use strum_macros::EnumIter;

#[derive(Display, Debug, Copy, Clone, PartialEq, Eq, Hash, EnumIter)]
pub enum ChainId {
    Sepolia = 11155111,
    Fuji = 43113,
    Khalani = 10012,
}

impl From<ChainId> for u32 {
    fn from(chain_id_enum: ChainId) -> Self {
        chain_id_enum as u32
    }
}

impl TryFrom<u32> for ChainId {
    type Error = anyhow::Error;

    fn try_from(value: u32) -> Result<Self, Self::Error> {
        for chain_id in ChainId::iter() {
            if u32::from(chain_id) == value {
                return Ok(chain_id);
            }
        }

        Err(anyhow!("Unknown chain ID {}", value))
    }
}

impl TryFrom<&str> for ChainId {
    type Error = anyhow::Error;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        match value {
            "Sepolia" => Ok(ChainId::Sepolia),
            "Fuji" => Ok(ChainId::Fuji),
            "Khalani" => Ok(ChainId::Khalani),
            _ => Err(anyhow!("Unknown chain name {value}")),
        }
    }
}

pub fn chain_name_to_id(chain_name: &str) -> Result<u64, anyhow::Error> {
    let chain_id = ChainId::try_from(chain_name)?;
    Ok(u64::from(chain_id as u32))
}

#[derive(Debug, Clone)]
pub struct ChainConfig {
    pub name: String,
    pub chain_id: ChainId,
    pub rpc_url: String,
    pub ws_url: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ChainConfigRaw {
    pub name: String,
    pub chain_id: u32,
    // TODO: parse from ENV or a secret file.
    pub rpc_url: String,
    pub ws_url: String,
}
