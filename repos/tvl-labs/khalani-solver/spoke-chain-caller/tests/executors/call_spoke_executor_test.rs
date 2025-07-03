use std::sync::Arc;

use anyhow::Result;
use artemis_core::types::Executor;
use ethers::contract::abigen;
use ethers::types::{Address, U256};
use futures::StreamExt;
use tracing::info;

use intentbook_matchmaker::types::spoke_chain_call::SpokeChainCall;
use solver_common::config::chain::ChainId;
use solver_common::diagnostics::logs::configure_logs;
use solver_common::inventory::amount::Amount;
use solver_common::inventory::token_allowance_query::TokenAllowanceQuery;
use solver_common::inventory::token_allowance_setter::{AllowanceRequest, TokenAllowanceSetter};
use solver_common::inventory::Inventory;
use solver_common::tests::connector::{create_connector, create_e2e_config};
use spoke_chain_caller::workflow::action::Action;
use spoke_chain_caller::workflow::executors::call_spoke_executor::CallSpokeExecutor;
use spoke_chain_caller::workflow::executors::ethereum::send_transaction_call_spoke_handler::SendTransactionCallSpokeHandler;

abigen!(
    MockContractToCall,
    r#"[
        function mockFunction(address _token, uint256 _amount) external
    ]"#,
    event_derives(serde::Deserialize, serde::Serialize)
);

#[ignore]
#[tokio::test]
async fn test_swap_and_bridge_executor() -> Result<()> {
    configure_logs();
    let config = create_e2e_config().unwrap();
    let connector = create_connector().await?;
    let connector = Arc::new(connector);
    let inventory = Inventory::new(config.clone(), connector.clone()).await?;
    let inventory = Arc::new(inventory);
    let handler = SendTransactionCallSpokeHandler::new(config.addresses.clone(), connector.clone());
    let (executor, collector) = CallSpokeExecutor::new(handler.clone());

    let chain_id = ChainId::Sepolia;
    let contract_to_call_address = "0xbfa2dd37EC75C27CDbaDdd0c19e0f69fD277c16b"
        .parse::<Address>()
        .unwrap();

    let rpc_client = connector.get_rpc_client(chain_id).unwrap();
    let usdc_token = inventory.find_token_by_symbol("USDC".into(), chain_id)?;

    let amount = Amount::from_user_units_token(U256::from_dec_str("100").unwrap(), usdc_token);

    let mock_contract_to_call = MockContractToCall::new(contract_to_call_address, rpc_client);
    let call_data = mock_contract_to_call
        .mock_function(usdc_token.address, amount.base_units)
        .calldata()
        .unwrap();

    let spoke_chain_call = SpokeChainCall {
        token: usdc_token.address,
        amount: amount.base_units,
        chain_id,
        intent_id: Default::default(),
        author: Default::default(),
        contract_to_call: contract_to_call_address,
        call_data,

        signature: Default::default(),
        reward_token: Default::default(),
        reward_amount: Default::default(),
    };

    let spoke_chain_executor_address: Address = handler
        .get_spoke_chain_executor_address(&spoke_chain_call)
        .unwrap();
    let current_allowance = inventory
        .get_allowance(
            usdc_token,
            connector.get_address(),
            spoke_chain_executor_address,
        )
        .await?;
    info!("Current allowance: {current_allowance}");

    if current_allowance.lt(&amount) {
        inventory
            .approve_tokens(AllowanceRequest {
                allowance_amount: amount,
                spender_address: spoke_chain_executor_address,
                token: usdc_token.clone(),
            })
            .await?;
    }

    executor
        .execute(Action::CallSpoke(spoke_chain_call))
        .await?;

    let event = collector.get_event_stream().await.unwrap().next().await;
    info!("{:?}", event);

    Ok(())
}
