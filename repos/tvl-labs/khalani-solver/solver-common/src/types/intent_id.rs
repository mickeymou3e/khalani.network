use ethers::types::H256;

pub type IntentId = H256;
pub type IntentBidId = H256;

pub type WithIntentId<T> = (IntentId, T);
pub type WithIntentIdAndBidId<T> = (IntentId, IntentBidId, T);
