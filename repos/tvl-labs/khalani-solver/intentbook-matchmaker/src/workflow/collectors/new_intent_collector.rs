use anyhow::Result;
use artemis_core::types::{Collector, CollectorStream};
use async_trait::async_trait;
use futures::stream::StreamExt;

use crate::types::intent::Intent;
use crate::workflow::event::Event;

#[async_trait]
pub trait NewIntentSource {
    async fn get_new_intent_source(&self) -> Result<CollectorStream<'_, Intent>>;
}

pub struct NewIntentCollector<S: NewIntentSource>(S);

impl<S: NewIntentSource> NewIntentCollector<S> {
    pub fn new(source: S) -> Self {
        NewIntentCollector(source)
    }
}

#[async_trait]
impl<S: NewIntentSource + Sync + Send> Collector<Event> for NewIntentCollector<S> {
    async fn get_event_stream(&self) -> Result<CollectorStream<'_, Event>> {
        let intents_stream = self.0.get_new_intent_source().await?;
        let intents_stream = intents_stream.map(Event::NewIntent);
        Ok(Box::pin(intents_stream))
    }
}
