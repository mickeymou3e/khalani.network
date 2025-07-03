use anyhow::Result;
use artemis_core::types::{Collector, CollectorStream};
use async_trait::async_trait;
use futures::stream::StreamExt;

use crate::types::intent_bid::IntentBid;
use crate::workflow::event::Event;

#[async_trait]
pub trait MatchedIntentsSource {
    async fn get_matched_intents_source(&self) -> Result<CollectorStream<'_, IntentBid>>;
}

pub struct MatchedIntentCollector<S: MatchedIntentsSource>(S);

impl<S: MatchedIntentsSource> MatchedIntentCollector<S> {
    pub fn new(source: S) -> Self {
        MatchedIntentCollector(source)
    }
}

#[async_trait]
impl<S: MatchedIntentsSource + Sync + Send> Collector<Event> for MatchedIntentCollector<S> {
    async fn get_event_stream(&self) -> Result<CollectorStream<'_, Event>> {
        let intents_stream = self.0.get_matched_intents_source().await?;
        let intents_stream = intents_stream.map(Event::NewMatchedIntent);
        Ok(Box::pin(intents_stream))
    }
}
