use anyhow::Result;
use bytes::Bytes;
use mirax_verification_client::{
    AXI_PLAYGROUND_API_URL, CellOutput, Context, TransactionBuilder, verify_at,
};
use reqwest::Client;

const SUDT_TYPE_SCRIPT: &str = include_str!("sudt.axi");
const SWAP_LOCK_PROGRAM: &str = include_str!("swap.axi");

#[tokio::test]
async fn test_swap() -> Result<()> {
    let mut context = Context::default();
    let always_success_lock_cell = context.deploy_cell("true");

    let token1_owner_lock_script = context.build_script(&always_success_lock_cell, "token1");
    let token1_owner_lock_script_hash = token1_owner_lock_script.calc_hash();
    let token2_owner_lock_script = context.build_script(&always_success_lock_cell, "token2");
    let token2_owner_lock_script_hash = token2_owner_lock_script.calc_hash();

    let sudt_program_cell = context.deploy_cell(SUDT_TYPE_SCRIPT);

    let token1_sudt_script =
        context.build_script(&sudt_program_cell, token1_owner_lock_script_hash.to_vec());
    let token1_sudt_script_hash = token1_sudt_script.calc_hash();

    let token2_sudt_script =
        context.build_script(&sudt_program_cell, token2_owner_lock_script_hash.to_vec());
    let token2_sudt_script_hash = token2_sudt_script.calc_hash();

    let swap_lock_program_cell = context.deploy_cell(SWAP_LOCK_PROGRAM);
    // Swap for 100 token2 with 90 token1.
    let swap_nonce: [u8; 24] = rand::random();
    let swap_lock_args: Bytes = amount_to_bytes(100)
        .into_iter()
        .chain(token2_sudt_script_hash)
        .chain(token1_owner_lock_script_hash)
        .chain(swap_nonce)
        .collect();
    assert_eq!(swap_lock_args.len(), 104);
    let swap_lock_script = context.build_script(&swap_lock_program_cell, swap_lock_args);
    let swap_lock_script_hash = swap_lock_script.calc_hash();

    let swap_input = context.deploy_cell_with_type_and_lock(
        amount_to_bytes(90),
        token1_sudt_script.clone(),
        swap_lock_script.clone(),
    );

    let token2_input = context.deploy_cell_with_type_and_lock(
        amount_to_bytes(100),
        token2_sudt_script.clone(),
        token2_owner_lock_script.clone(),
    );

    let swap_tx = TransactionBuilder::new()
        .cell_dep(always_success_lock_cell)
        .cell_dep(swap_lock_program_cell)
        .cell_dep(sudt_program_cell)
        .input(swap_input)
        .input(token2_input)
        // 100 token2 for owner1 and 90 token1 for owner2.
        .output(
            CellOutput {
                capacity: 0,
                type_: Some(token2_sudt_script),
                lock: token1_owner_lock_script,
            },
            amount_to_bytes(100)
                .into_iter()
                .chain(swap_nonce)
                .collect::<Bytes>(),
        )
        .output(
            CellOutput {
                capacity: 0,
                type_: Some(token1_sudt_script),
                lock: token2_owner_lock_script,
            },
            amount_to_bytes(90),
        )
        .prove_lock(token2_owner_lock_script_hash, "!true_intro()")
        .prove_type(token1_sudt_script_hash, r#"!by_valid_transfer()"#)
        .prove_type(token2_sudt_script_hash, r#"!by_valid_transfer()"#)
        .prove_lock(swap_lock_script_hash, r#"!by_swap_unlock(0)"#)
        .build();

    let client = Client::new();
    let url = std::env::var("AXI_PLAYGROUND_API_URL").unwrap_or(AXI_PLAYGROUND_API_URL.to_string());
    let res = verify_at(&client, &url, &context, &swap_tx).await?;
    println!("{}", res.stdout);
    eprintln!("{}", res.stderr);
    res.err_for_status()?;

    Ok(())
}

fn amount_to_bytes(amount: u128) -> Bytes {
    amount.to_le_bytes().into_iter().collect()
}
