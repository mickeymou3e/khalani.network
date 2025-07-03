use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;

use alloy::contract::{ContractInstance, Interface};
use alloy::json_abi::JsonAbi;
use alloy::primitives::Address;
use alloy::providers::Provider;
use alloy::transports::http::{Client, Http};
use anyhow::Result;
use apm::m_token_set_balance;

use crate::config::LightContract;

pub struct BalanceMonitor<P: Provider<Http<Client>>> {
    m_token_manager_addresses: HashMap<String, LightContract>,
    provider: Arc<P>,
}

impl<P: Provider<Http<Client>>> BalanceMonitor<P> {
    pub fn new(
        m_token_manager_addresses: HashMap<String, LightContract>,
        provider: Arc<P>,
    ) -> Self {
        Self {
            m_token_manager_addresses,
            provider,
        }
    }

    pub async fn run(&self) {
        let mut timer = tokio::time::interval(Duration::from_secs(10));

        loop {
            timer.tick().await;

            for (token_name, token_manager) in &self.m_token_manager_addresses {
                let balance = self
                    .make_m_token_query_call(
                        token_manager.address,
                        token_manager.abi.clone(),
                        "totalSupply",
                    )
                    .await;

                m_token_set_balance(token_name, balance.unwrap());
            }
        }
    }

    pub async fn make_m_token_query_call(
        &self,
        address: Address,
        abi: JsonAbi,
        function_name: &str,
    ) -> Result<i64> {
        let contract_instance =
            ContractInstance::new(address, Arc::clone(&self.provider), Interface::new(abi));
        let result = contract_instance
            .function(function_name, &[])?
            .call()
            .await?;

        Ok(result[0].as_uint().unwrap().0.to::<i64>())
    }
}
