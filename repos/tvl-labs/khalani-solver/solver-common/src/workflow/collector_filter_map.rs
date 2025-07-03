use anyhow::Result;
use artemis_core::types::{Collector, CollectorStream};
use async_trait::async_trait;
use futures::StreamExt;

/// CollectorMap is a wrapper around a [Collector](Collector) that maps outgoing
/// events to a different type.
pub struct CollectorFilterMap<E, F> {
    collector: Box<dyn Collector<E>>,
    f: F,
}
impl<E, F> CollectorFilterMap<E, F> {
    pub fn new(collector: Box<dyn Collector<E>>, f: F) -> Self {
        Self { collector, f }
    }
}

#[async_trait]
impl<E1, E2, F> Collector<E2> for CollectorFilterMap<E1, F>
where
    E1: Send + Sync + 'static,
    E2: Send + Sync + 'static,
    F: Fn(E1) -> Option<E2> + Send + Sync + Clone + 'static,
{
    async fn get_event_stream(&self) -> Result<CollectorStream<'_, E2>> {
        let stream = self.collector.get_event_stream().await?;
        let stream = stream.filter_map(|e| async { self.f.clone()(e) }); // TODO: do not use clone.
        Ok(Box::pin(stream))
    }
}
