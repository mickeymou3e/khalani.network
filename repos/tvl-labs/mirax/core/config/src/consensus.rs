use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ConsensusConfig {
    pub gc_depth: u64,
    pub min_propose_interval: u64,
    pub max_propose_interval: u64,
}
