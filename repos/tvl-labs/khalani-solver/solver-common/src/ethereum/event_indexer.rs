use std::fmt::Debug;
use std::sync::Arc;
use std::time::Duration;

use crate::connectors::RpcClient;
use anyhow::Result;
use artemis_core::types::CollectorStream;
use async_trait::async_trait;
use ethers::contract::{EthLogDecode, Event as ContractEvent};
use ethers::middleware::Middleware;
use tracing::{debug, error, info};

/// The event source trait which use to parse the event filter and return the event result.
#[async_trait]
pub trait EventSource {
    /// The type of event filter.
    type EventFilter;

    /// The type of event result.
    type EventResult;

    /// Creates an event filter.
    fn create_event_filter(&self) -> ContractEvent<Arc<RpcClient>, RpcClient, Self::EventFilter>;

    /// Parse the given event and return the event result.
    fn parse_event(&self, event: Self::EventFilter) -> Option<Result<Self::EventResult>>;
}

/// Fetch events from an event source.
pub struct EventFetcher<T> {
    indexer_name: String,
    rpc_client: Arc<RpcClient>,
    event_source: T,
}

impl<'a, T> EventFetcher<T>
where
    T: 'a + EventSource + Sized + Sync + Send,
    T::EventFilter: EthLogDecode + Debug + Clone,
    T::EventResult: 'a + Debug + Send,
{
    /// Creates a new event fetcher. The `indexer_name` is only use to log.
    pub fn new(indexer_name: String, rpc_client: Arc<RpcClient>, event_source: T) -> Self {
        Self {
            indexer_name,
            rpc_client,
            event_source,
        }
    }

    /// Fetches events from the event source. This function returns a stream and it is always
    /// loop until process is killed.
    pub async fn fetch_events(self) -> Result<CollectorStream<'a, T::EventResult>> {
        let mut previous_block_number = match self.rpc_client.get_block_number().await {
            Ok(block_number) => block_number,
            Err(e) => {
                error!(?e, self.indexer_name, "Error fetching block");
                return Err(e.into());
            }
        };
        info!(
            ?previous_block_number,
            self.indexer_name, "Starting block number"
        );
        let mut logged_last_indexed_block_number = previous_block_number;
        let event_stream = async_stream::stream! {
            loop {
                let current_block_number = match self.rpc_client.get_block_number().await {
                    Ok(block_number) => block_number,
                    Err(e) => {
                        error!(?e, self.indexer_name, "Error fetching block");
                        tokio::time::sleep(Duration::from_secs(5)).await;
                        continue;
                    }
                };

                if previous_block_number >= current_block_number {
                    tokio::time::sleep(Duration::from_secs(5)).await;
                    continue
                }

                if logged_last_indexed_block_number + 50 < current_block_number {
                    debug!(?previous_block_number, ?current_block_number, self.indexer_name, "Indexing blocks");
                    logged_last_indexed_block_number = current_block_number;
                }

                let event = self
                    .event_source
                    .create_event_filter()
                    .from_block(previous_block_number)
                    .to_block(current_block_number);

                let events = match event.query().await {
                    Ok(events) => events,
                    Err(e) => {
                        error!(?e, self.indexer_name, "Error querying events");
                        tokio::time::sleep(Duration::from_secs(5)).await;
                        continue;
                    }
                };

                for event in events {
                    match self.event_source.parse_event(event.clone()) {
                        Some(Ok(event)) => {
                            info!(?event, self.indexer_name, "New event indexed");
                            yield event
                        }
                        Some(Err(e)) => {
                            error!(?e, self.indexer_name, "Error parsing event");
                            return;
                        }
                        None => {
                            info!(?event, self.indexer_name, "Skipping intent");
                            continue;
                        }
                    }

                }

                previous_block_number = current_block_number + 1;
            }
        };
        Ok(Box::pin(event_stream))
    }
}
