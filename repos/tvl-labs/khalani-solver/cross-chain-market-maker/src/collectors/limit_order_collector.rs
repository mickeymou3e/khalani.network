use anyhow::Result;
use artemis_core::types::{Collector, CollectorStream};
use async_trait::async_trait;

use crate::event::Event;

#[async_trait]
pub trait LimitOrderSource {
    async fn get_new_limit_order_intents_stream(&self) -> Result<CollectorStream<'_, Event>>;
}

pub struct LimitOrderCollector<S: LimitOrderSource>(S);

impl<S: LimitOrderSource> LimitOrderCollector<S> {
    pub fn new(source: S) -> Self {
        LimitOrderCollector(source)
    }
}

#[async_trait]
impl<S: LimitOrderSource + Sync + Send> Collector<Event> for LimitOrderCollector<S> {
    async fn get_event_stream(&self) -> Result<CollectorStream<'_, Event>> {
        Ok(Box::pin(self.0.get_new_limit_order_intents_stream().await?))
    }
}
