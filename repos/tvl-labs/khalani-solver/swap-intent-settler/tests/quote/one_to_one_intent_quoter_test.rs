use std::sync::Arc;

use anyhow::Result;
use ethers::types::U256;

use intentbook_matchmaker::types::swap_intent::SwapIntent;
use solver_common::config::chain::ChainId;
use solver_common::inventory::amount::Amount;
use solver_common::inventory::Inventory;
use solver_common::tests::connector::{create_connector, create_e2e_config};
use swap_intent_settler::quote::intent_quoter::IntentQuoter;
use swap_intent_settler::quote::one_to_one_intent_quoter::OneToOneIntentQuoter;

#[tokio::test]
async fn test_one_to_one_intent_quoter() -> Result<()> {
    let config = create_e2e_config().unwrap();
    let connector = create_connector().await?;
    let connector = Arc::new(connector);
    let inventory = Inventory::new(config.clone(), connector.clone()).await?;
    let inventory = Arc::new(inventory);
    let quoter = OneToOneIntentQuoter::new(inventory.clone());

    let usdc_sepolia = inventory.find_token_by_symbol("USDC".into(), ChainId::Sepolia)?;
    let usdt_fuji = inventory.find_token_by_symbol("USDT".into(), ChainId::Fuji)?;

    let source_amount =
        Amount::from_user_units_token(U256::from_dec_str("1000").unwrap(), usdc_sepolia);

    let intent_swap_usdc_to_usdt_sepolia = SwapIntent {
        source_chain_id: ChainId::Fuji,
        source_token: usdc_sepolia.address,
        source_amount: source_amount.base_units,

        destination_chain_id: ChainId::Sepolia,
        destination_token: usdt_fuji.address,

        intent_id: Default::default(),
        author: Default::default(),
        signature: Default::default(),
        source_permit_2: Default::default(),
        deadline: Default::default(),
        nonce: Default::default(),
    };

    let intent = quoter
        .quote_intent(intent_swap_usdc_to_usdt_sepolia)
        .await?;

    let destination_amount = intent.destination_amount;
    assert_eq!(source_amount, destination_amount);

    Ok(())
}
