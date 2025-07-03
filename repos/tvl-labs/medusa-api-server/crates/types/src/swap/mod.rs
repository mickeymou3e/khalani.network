pub mod single_exact;
use crate::intents::Intent as RpcIntent;

pub trait SwapTypeToIntent {
    fn to_intent(&self) -> RpcIntent;
}
