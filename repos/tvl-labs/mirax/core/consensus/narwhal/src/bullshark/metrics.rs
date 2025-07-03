use mirax_consensus_traits::{
    ConsensusCrypto, ConsensusGossip, ConsensusStorage, ConsensusTransactionProcess,
    ConsensusValidatorManage,
};

use crate::BullsharkConsensus;
impl<C, G, S, T, V> BullsharkConsensus<C, G, S, T, V>
where
    C: ConsensusCrypto + Send + Sync + 'static,
    G: ConsensusGossip + Send + Sync + 'static,
    S: ConsensusStorage + Send + Sync + 'static,
    T: ConsensusTransactionProcess + Send + Sync + 'static,
    V: ConsensusValidatorManage + Send + Sync + 'static,
{
}
