use std::sync::Arc;

use anyhow::{anyhow, Result};

use solver_common::inventory::token_balance_query::TokenBalanceQuery;
use solver_common::inventory::Inventory;
use solver_common::tests::connector::{create_connector, create_e2e_config};

#[tokio::test]
async fn test_inventory() -> Result<()> {
    let config = create_e2e_config().unwrap();
    let connector = create_connector().await?;
    let connector = Arc::new(connector);
    let inventory = Inventory::new(config, connector.clone()).await?;
    let usdc_token = inventory
        .tokens
        .first()
        .ok_or_else(|| anyhow!("No tokens available in inventory"))?;
    println!("{:?}", usdc_token);
    let address = connector.get_address();
    let balance = inventory.get_balance(usdc_token, address).await?;
    println!("Balance of {} is {}", address, balance);
    Ok(())
}
