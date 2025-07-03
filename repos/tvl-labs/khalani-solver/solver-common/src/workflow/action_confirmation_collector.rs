use anyhow::Result;
use artemis_core::types::{Collector, CollectorStream};
use async_trait::async_trait;
use futures::lock::Mutex;
use tokio::sync::mpsc::Receiver;

pub struct ActionConfirmationCollector<C> {
    // Todo: the Mutex seems to be unnecessary and may be replace by other
    // lock-free structure.
    confirmation_receiver: Mutex<Receiver<C>>,
}

impl<C> ActionConfirmationCollector<C> {
    pub fn new(confirmation_receiver: Receiver<C>) -> Self {
        Self {
            confirmation_receiver: Mutex::new(confirmation_receiver),
        }
    }
}

#[async_trait]
impl<C: Sync + Send> Collector<C> for ActionConfirmationCollector<C> {
    async fn get_event_stream(&self) -> Result<CollectorStream<'_, C>> {
        let stream = async_stream::stream! {
            let mut receiver = self.confirmation_receiver.lock().await;
            while let Some(confirmation) = receiver.recv().await {
                yield confirmation;
            }
        };

        Ok(Box::pin(stream))
    }
}
