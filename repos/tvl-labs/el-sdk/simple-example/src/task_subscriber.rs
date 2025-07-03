use std::sync::Arc;

use el_sdk::client::ElClient;
use el_sdk::contract::incredible_squaring_service_manager::IncredibleSquaringServiceManager;
use el_sdk::contract::incredible_squaring_task_manager::{
    IncredibleSquaringTaskManager, TaskRespondedFilter,
};
use el_sdk::contract::registry_coordinator::RegistryCoordinator;
use ethers::providers::StreamExt;
use ethers::types::Address;

pub struct TaskSubscriber {
    service_manager_address: Address,
    task_manager_address: Address,
    provider: ElClient,
}

impl TaskSubscriber {
    pub async fn new(provider: ElClient, registry_coordinator_address: Address) -> Self {
        let service_manager_address =
            RegistryCoordinator::new(registry_coordinator_address, Arc::new(provider.provider()))
                .service_manager()
                .call()
                .await
                .unwrap();
        let service_manager = IncredibleSquaringServiceManager::new(
            service_manager_address,
            Arc::new(provider.provider()),
        );
        let task_manager_address = service_manager
            .incredible_squaring_task_manager()
            .call()
            .await
            .unwrap();

        Self {
            provider,
            task_manager_address,
            service_manager_address,
        }
    }

    pub async fn run(self) {
        let event = IncredibleSquaringTaskManager::new(
            self.task_manager_address,
            Arc::new(self.provider.provider()),
        )
        .event_for_name::<TaskRespondedFilter>("TaskResponded")
        .unwrap();
        let mut event_stream = event.stream().await.unwrap();

        while let Some(Ok(evt)) = event_stream.next().await {
            let TaskRespondedFilter {
                task_response,
                task_response_metadata,
            } = evt;

            println!(
                "TaskResponded: task_response: {:?}, task_response_metadata: {:?}",
                task_response, task_response_metadata
            );
        }
    }
}
