use anyhow::Result;
use bytes::Bytes;
use mirax_verification_client::{AXI_PLAYGROUND_API_URL, Context, TransactionBuilder, verify_at};
use reqwest::Client;

#[tokio::test]
async fn always_success() -> Result<()> {
    let mut ctx = Context::new();

    let always_success_program = ctx.deploy_cell(Bytes::from_static(b"true"));
    let always_success_script = ctx.build_script(&always_success_program, Bytes::new());
    let always_success_script_hash = always_success_script.calc_hash();
    let always_success_input =
        ctx.deploy_cell_with_lock(Bytes::new(), always_success_script.clone());

    let tx = TransactionBuilder::new()
        .cell_dep(always_success_program)
        .input(always_success_input)
        .prove_lock(always_success_script_hash, "!true_intro()")
        .build();

    let client = Client::new();
    let url = std::env::var("AXI_PLAYGROUND_API_URL").unwrap_or(AXI_PLAYGROUND_API_URL.to_string());
    let res = verify_at(&client, &url, &ctx, &tx).await?;
    println!("{}", res.stdout);
    eprintln!("{}", res.stderr);
    res.err_for_status()?;
    Ok(())
}
