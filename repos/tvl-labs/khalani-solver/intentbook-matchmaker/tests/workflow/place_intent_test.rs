use std::sync::Arc;

use anyhow::Result;
use ethers::types::{Address, Bytes, U256};
use intentbook_matchmaker::types::intent::Intent;
use intentbook_matchmaker::types::spoke_chain_call::{SpokeChainCall, SpokeChainCallStub};
use intentbook_matchmaker::workflow::executors::ethereum::send_transaction_place_intent_handler::SendTransactionPlaceIntentHandler;
use intentbook_matchmaker::workflow::executors::place_intent_executor::PlaceIntentHandler;
use solver_common::config::chain::ChainId;

use solver_common::inventory::Inventory;
use solver_common::tests::connector::{create_connector, create_e2e_config};

#[ignore]
#[tokio::test]
async fn test_place_intent() -> Result<()> {
    let config = create_e2e_config().unwrap();
    let connector = create_connector().await?;
    let connector = Arc::new(connector);
    let inventory = Inventory::new(config.clone(), connector.clone()).await?;
    let _inventory = Arc::new(inventory);
    let chain_id = ChainId::Sepolia;

    let handler = SendTransactionPlaceIntentHandler::new(
        config.addresses.intentbook_addresses,
        connector.clone(),
    );

    let spoke_chain_call = SpokeChainCall::create_signed(
        connector.clone(),
        SpokeChainCallStub {
            chain_id,
            contract_to_call: Address::zero(),
            call_data: Bytes::default(),
            token: Address::zero(),
            amount: U256::zero(),
            reward_token: Address::zero(),
            reward_amount: U256::zero(),
        },
    )
    .await
    .unwrap();

    let handler_result = handler
        .post_intent(Intent::SpokeChainCall(spoke_chain_call))
        .await?;
    println!("{:?}", handler_result.tx_hash);

    Ok(())
}
