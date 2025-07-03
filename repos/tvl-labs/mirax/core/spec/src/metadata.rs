use serde::{Deserialize, Serialize};

use mirax_codec::withpfx_lowercase;
use mirax_types::{MiraxResult, Validator};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SpecMetadata {
    validator_list: Vec<HexValidator>,
}

impl SpecMetadata {
    pub fn validator_list(&self) -> MiraxResult<Vec<Validator>> {
        self.validator_list
            .iter()
            .map(|v| Validator::new(&v.public_key))
            .collect()
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct HexValidator {
    #[serde(with = "withpfx_lowercase")]
    pub public_key: Vec<u8>,
    #[serde(skip, default = "default_stake_ratio")]
    pub stake_ratio: u8,
}

fn default_stake_ratio() -> u8 {
    1
}
