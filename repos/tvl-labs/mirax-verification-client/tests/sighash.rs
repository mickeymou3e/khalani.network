use anyhow::Result;
use mirax_verification_client::{
    AXI_PLAYGROUND_API_URL, Context, TransactionBuilder, hash::mirax_hash, verify_at,
};
use reqwest::Client;

#[tokio::test]
async fn test_sighash_lock() -> Result<()> {
    let mut context = Context::new();
    let sig_verify_lock = context.deploy_cell(include_str!("sighash.axi"));

    let (secret_key, public_key) = secp256k1::generate_keypair(&mut secp256k1::rand::rngs::OsRng);

    let sig_verify_lock_script = context.build_script(
        &sig_verify_lock,
        mirax_hash(&public_key.serialize())[..20].to_vec(),
    );
    let sig_verify_lock_script_hash = sig_verify_lock_script.calc_hash();
    let input = context.deploy_cell_with_lock("", sig_verify_lock_script);

    // Build the transaction. We'll sign it later.
    let mut spending_tx = TransactionBuilder::new()
        .input(input)
        .cell_dep(sig_verify_lock)
        .prove_lock(
            sig_verify_lock_script_hash,
            r#"!by_signature_in_witness(0)"#,
        )
        .build();

    // Sign the transaction (hash).
    let message = secp256k1::Message::from_digest(spending_tx.calc_hash().0);
    let signature = secp256k1::SECP256K1.sign_ecdsa_recoverable(&message, &secret_key);
    let (rec_id, sig) = signature.serialize_compact();
    let sig: Vec<u8> = [i32::from(rec_id) as u8].into_iter().chain(sig).collect();
    spending_tx.witnesses.push(sig.to_vec().into());

    let client = Client::new();
    let url = std::env::var("AXI_PLAYGROUND_API_URL").unwrap_or(AXI_PLAYGROUND_API_URL.to_string());
    let res = verify_at(&client, &url, &context, &spending_tx).await?;
    println!("{}", res.stdout);
    eprintln!("{}", res.stderr);
    res.err_for_status()?;

    Ok(())
}
