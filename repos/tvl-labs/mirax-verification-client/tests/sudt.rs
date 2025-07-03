use anyhow::{Result, ensure};
use bytes::Bytes;
use mirax_verification_client::{
    AXI_PLAYGROUND_API_URL, CellOutput, Context, TransactionBuilder, verify_at,
};
use reqwest::Client;

const SUDT_TYPE_SCRIPT: &str = include_str!("sudt.axi");

#[tokio::test]
async fn test_sudt_mint() -> Result<()> {
    let mut context = Context::default();
    let always_success_lock = context.deploy_cell("true");

    let always_success_lock_script = context.build_script(&always_success_lock, "");
    let always_success_lock_script_hash = always_success_lock_script.calc_hash();
    let always_succss_input = context.deploy_cell_with_lock("", always_success_lock_script.clone());

    let sudt_program_cell = context.deploy_cell(SUDT_TYPE_SCRIPT);
    let sudt_script =
        context.build_script(&sudt_program_cell, always_success_lock_script_hash.to_vec());
    let sudt_script_hash = sudt_script.calc_hash();

    let mint_tx = TransactionBuilder::new()
        .cell_dep(always_success_lock)
        .cell_dep(sudt_program_cell)
        .input(always_succss_input)
        .output(
            CellOutput {
                capacity: 0,
                lock: always_success_lock_script.clone(),
                type_: Some(sudt_script.clone()),
            },
            amount_to_bytes(100),
        )
        .prove_lock(always_success_lock_script_hash, "!true_intro()")
        .prove_type(sudt_script_hash, r#"!by_owner_unlock(0)"#)
        .build();

    let client = Client::new();
    let url = std::env::var("AXI_PLAYGROUND_API_URL").unwrap_or(AXI_PLAYGROUND_API_URL.to_string());
    let res = verify_at(&client, &url, &context, &mint_tx).await?;
    println!("{}", res.stdout);
    eprintln!("{}", res.stderr);
    ensure!(res.ok);

    Ok(())
}

#[tokio::test]
async fn test_sudt_transfer() -> Result<()> {
    let mut context = Context::default();
    let owner_lock = context.deploy_cell("true");

    let owner_lock_script = context.build_script(&owner_lock, "");
    let owner_lock_script_hash = owner_lock_script.calc_hash();

    let sudt_program_cell = context.deploy_cell(SUDT_TYPE_SCRIPT);
    let sudt_script = context.build_script(&sudt_program_cell, owner_lock_script_hash.to_vec());
    let sudt_script_hash = sudt_script.calc_hash();

    let input = context.deploy_cell_with_type_and_lock(
        amount_to_bytes(200),
        sudt_script.clone(),
        owner_lock_script.clone(),
    );

    let mut transfer_tx = TransactionBuilder::new()
        .cell_dep(owner_lock)
        .cell_dep(sudt_program_cell)
        .input(input)
        .output(
            CellOutput {
                capacity: 0,
                lock: owner_lock_script.clone(),
                type_: Some(sudt_script.clone()),
            },
            amount_to_bytes(100),
        )
        .output(
            CellOutput {
                capacity: 0,
                lock: owner_lock_script,
                type_: Some(sudt_script),
            },
            amount_to_bytes(100),
        )
        .prove_lock(owner_lock_script_hash, "!true_intro()")
        .prove_type(sudt_script_hash, r#"!by_valid_transfer()"#)
        .build();

    let client = Client::new();
    let url = std::env::var("AXI_PLAYGROUND_API_URL").unwrap_or(AXI_PLAYGROUND_API_URL.to_string());
    let res = verify_at(&client, &url, &context, &transfer_tx).await?;
    println!("{}", res.stdout);
    eprintln!("{}", res.stderr);
    res.err_for_status()?;

    // Should fail if output amount exceeds input.
    transfer_tx.outputs_data[1] = amount_to_bytes(101);
    let res = verify_at(&client, &url, &context, &transfer_tx).await?;
    println!("{}", res.stdout);
    eprintln!("{}", res.stderr);
    ensure!(res.status == Some(1));

    Ok(())
}

fn amount_to_bytes(amount: u128) -> Bytes {
    amount.to_le_bytes().into_iter().collect()
}
