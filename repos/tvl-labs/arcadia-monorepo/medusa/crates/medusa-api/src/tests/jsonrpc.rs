use std::str::FromStr;
use std::sync::Arc;

use alloy::signers::local::PrivateKeySigner;
use anyhow::anyhow;
use medusa_storage::{DbPool, StorageServiceTrait as _, on_pool};
use medusa_types::{Address, B256, IntentErrorType, IntentState, U256, WsBroadcastMessage};
use tokio::sync::broadcast::Sender;
use tracing_subscriber::{EnvFilter, fmt};

use crate::MedusaRpcServer;
use crate::jsonrpc::MedusaRpcImpl;
use crate::payload_types::{PayloadAddress, PayloadIntentId, WithdrawalPayload};
use crate::tests::test_utils::*;

const MEDUSA_ADDRESS: &str = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const MEDUSA_KEY: &str = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

fn init_tracing() {
    static INIT: std::sync::Once = std::sync::Once::new();
    INIT.call_once(|| {
        let _ = fmt()
            .with_env_filter(
                EnvFilter::from_default_env().add_directive("debug=info".parse().unwrap()),
            )
            .with_test_writer()
            .try_init();
    });
}

#[sqlx::test(migrations = false)]
async fn test_withdraw_mtokens_success(pool: DbPool) {
    init_tracing();
    let mut mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();

    let sender = Sender::new(100);
    let mut _receiver = sender.subscribe();

    let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
    let tx_hash = B256::random();

    mock_chain_service_inner
        .expect_withdraw_mtokens()
        .returning(move |_, _, _| Ok(tx_hash));
    mock_chain_service_inner
        .expect_get_chain_id()
        .returning(|| 37);

    let rpc = MedusaRpcImpl::new(
        Address::from_str(MEDUSA_ADDRESS).unwrap(),
        Arc::clone(&mock_chain_service),
        storage_service.clone(),
        sender,
    )
    .await;

    let payload = WithdrawalPayload {
        address: Address::from_str(MEDUSA_ADDRESS).unwrap(),
        mtoken: Address::random(),
        amount: U256::from(1000),
        nonce: U256::from(1),
        chain_id: 37,
    };
    let signer = PrivateKeySigner::from_str(MEDUSA_KEY).unwrap();
    let signed_payload = sign_payload(payload, signer);
    let ret = rpc.withdraw_mtokens(signed_payload).await;
    assert_eq!(ret, Ok(tx_hash));
}

#[sqlx::test(migrations = false)]
async fn test_withdraw_mtokens_bad_signature(pool: DbPool) {
    init_tracing();
    let mut mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();

    let sender = Sender::new(100);
    let mut _receiver = sender.subscribe();

    let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
    let tx_hash = B256::random();

    mock_chain_service_inner
        .expect_withdraw_mtokens()
        .returning(move |_, _, _| Ok(tx_hash));
    mock_chain_service_inner
        .expect_get_chain_id()
        .returning(|| 37);

    let rpc = MedusaRpcImpl::new(
        Address::from_str(MEDUSA_ADDRESS).unwrap(),
        Arc::clone(&mock_chain_service),
        storage_service.clone(),
        sender,
    )
    .await;

    let payload = WithdrawalPayload {
        address: Address::from_str(MEDUSA_ADDRESS).unwrap(),
        mtoken: Address::random(),
        amount: U256::from(1000),
        nonce: U256::from(1),
        chain_id: 37,
    };
    let signer = PrivateKeySigner::from_str(
        "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
    )
    .unwrap();
    let signed_payload = sign_payload(payload, signer);
    let ret = rpc.withdraw_mtokens(signed_payload).await;
    assert!(ret.is_err());
    assert!(
        ret.err()
            .unwrap()
            .to_string()
            .contains("Signature check failed"),
    );
}

#[sqlx::test(migrations = false)]
async fn test_withdraw_mtokens_bad_chain_id(pool: DbPool) {
    init_tracing();
    let mut mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();

    let sender = Sender::new(100);
    let mut _receiver = sender.subscribe();

    let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
    let tx_hash = B256::random();

    mock_chain_service_inner
        .expect_withdraw_mtokens()
        .returning(move |_, _, _| Ok(tx_hash));
    mock_chain_service_inner
        .expect_get_chain_id()
        .returning(|| 37);

    let rpc = MedusaRpcImpl::new(
        Address::from_str(MEDUSA_ADDRESS).unwrap(),
        Arc::clone(&mock_chain_service),
        storage_service.clone(),
        sender,
    )
    .await;

    let payload = WithdrawalPayload {
        address: Address::from_str(MEDUSA_ADDRESS).unwrap(),
        mtoken: Address::random(),
        amount: U256::from(1000),
        nonce: U256::from(1),
        chain_id: 38,
    };
    let signer = PrivateKeySigner::from_str(MEDUSA_KEY).unwrap();
    let signed_payload = sign_payload(payload, signer);
    let ret = rpc.withdraw_mtokens(signed_payload).await;
    assert!(ret.is_err());
    assert!(ret.err().unwrap().to_string().contains("Chain id mismatch"),);
}

#[sqlx::test(migrations = false)]
async fn test_withdraw_mtokens_bad_nonce(pool: DbPool) {
    init_tracing();
    let mut mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();

    let sender = Sender::new(100);
    let mut _receiver = sender.subscribe();

    let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
    let tx_hash = B256::random();

    mock_chain_service_inner
        .expect_withdraw_mtokens()
        .returning(move |_, _, _| Ok(tx_hash));
    mock_chain_service_inner
        .expect_get_chain_id()
        .returning(|| 37);

    let rpc = MedusaRpcImpl::new(
        Address::from_str(MEDUSA_ADDRESS).unwrap(),
        Arc::clone(&mock_chain_service),
        storage_service.clone(),
        sender,
    )
    .await;

    let payload = WithdrawalPayload {
        address: Address::from_str(MEDUSA_ADDRESS).unwrap(),
        mtoken: Address::random(),
        amount: U256::from(1000),
        nonce: U256::from(1),
        chain_id: 37,
    };
    let signer = PrivateKeySigner::from_str(MEDUSA_KEY).unwrap();
    let signed_payload = sign_payload(payload, signer);
    let ret = rpc.withdraw_mtokens(signed_payload.clone()).await;
    assert!(ret.is_ok());

    let ret = rpc.withdraw_mtokens(signed_payload).await;
    assert!(ret.is_err());
    assert!(
        ret.err()
            .unwrap()
            .to_string()
            .contains("Nonce check failed")
    );
}

#[sqlx::test(migrations = false)]
async fn test_propose_intent_success(pool: DbPool) {
    init_tracing();
    let mut mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();

    let sender = Sender::new(100);
    let mut receiver = sender.subscribe();

    let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
    mock_chain_service_inner
        .expect_get_chain_id()
        .returning(|| 37);
    let tx_hash = B256::random();
    mock_chain_service_inner
        .expect_post_intent()
        .returning(move |_| Ok(tx_hash));

    let rpc = MedusaRpcImpl::new(
        Address::from_str(MEDUSA_ADDRESS).unwrap(),
        Arc::clone(&mock_chain_service),
        storage_service.clone(),
        sender,
    )
    .await;
    let intent = create_dummy_signed_intent(current_timestamp());
    let ret = rpc.propose_intent(intent.clone()).await;
    assert_eq!(ret, Ok((tx_hash, intent.intent.intent_id())));
    let msg = receiver.recv().await.unwrap();
    match msg {
        WsBroadcastMessage::NewIntent(intent) => {
            assert_eq!(intent.intent_id(), intent.intent_id());
        }
        _ => panic!("expected new intent"),
    }
    let stored_intent_status = storage_service
        .get_intent_status(&intent.intent.intent_id())
        .await
        .unwrap()
        .unwrap();
    assert_eq!(stored_intent_status, IntentState::Open);
}

#[sqlx::test(migrations = false)]
async fn test_propose_intent_failure(pool: DbPool) {
    init_tracing();
    let mut mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();

    let sender = Sender::new(100);
    let _receiver = sender.subscribe();

    let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
    mock_chain_service_inner
        .expect_get_chain_id()
        .returning(|| 37);
    mock_chain_service_inner
        .expect_post_intent()
        .returning(|_| Err(anyhow!(B256::random())));

    let rpc = MedusaRpcImpl::new(
        Address::from_str(MEDUSA_ADDRESS).unwrap(),
        Arc::clone(&mock_chain_service),
        storage_service.clone(),
        sender,
    )
    .await;

    let intent = create_dummy_signed_intent(current_timestamp());
    let ret = rpc.propose_intent(intent.clone()).await;
    assert!(ret.is_err());

    let stored_intent_status = storage_service
        .get_intent_status(&intent.intent.intent_id())
        .await
        .unwrap()
        .unwrap();
    assert_eq!(stored_intent_status, IntentState::Error);
}

#[sqlx::test(migrations = false)]
async fn test_cancel_intent_success(pool: DbPool) {
    init_tracing();
    let mut mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();

    let sender = Sender::new(100);
    let mut receiver = sender.subscribe();

    let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
    mock_chain_service_inner
        .expect_post_intent()
        .returning(|_| Ok(B256::random()));
    mock_chain_service_inner
        .expect_cancel_intent()
        .returning(|_| Ok(B256::random()));
    mock_chain_service_inner
        .expect_get_chain_id()
        .returning(|| 37);

    let rpc = MedusaRpcImpl::new(
        Address::from_str(MEDUSA_ADDRESS).unwrap(),
        Arc::clone(&mock_chain_service),
        storage_service.clone(),
        sender,
    )
    .await;
    let key = String::from("0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6");
    let intent = create_mock_signed_intent(current_timestamp() + 1000, key.clone());

    rpc.propose_intent(intent.clone()).await.unwrap();
    let msg = receiver.recv().await.unwrap();
    match msg {
        WsBroadcastMessage::NewIntent(_) => {}
        _ => panic!("expected new intent broadcast"),
    }
    let signer = PrivateKeySigner::from_str(&key).unwrap();

    let intent_id_payload = PayloadIntentId {
        intent_id: intent.intent.intent_id(),
        nonce: U256::random(),
        chain_id: 37,
    };
    let signed_payload = sign_payload(intent_id_payload, signer);

    let ret = rpc.cancel_intent(signed_payload).await;
    assert!(ret.is_ok());

    let stored_intent_status = storage_service
        .get_intent_status(&intent.intent.intent_id())
        .await
        .unwrap()
        .unwrap();
    assert_eq!(stored_intent_status, IntentState::Cancelled);
    let msg = receiver.recv().await.unwrap();
    match msg {
        WsBroadcastMessage::IntentStatusUpdated(intent_id, state) => {
            assert_eq!(intent_id, intent_id);
            assert_eq!(state, IntentState::Cancelled);
        }
        _ => panic!("expected intent status updated"),
    }
}

#[sqlx::test(migrations = false)]
async fn test_cancel_intent_cancel_failure(pool: DbPool) {
    init_tracing();
    let mut mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();

    let sender = Sender::new(100);
    let mut receiver = sender.subscribe();

    let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
    mock_chain_service_inner
        .expect_post_intent()
        .returning(|_| Ok(B256::random()));
    mock_chain_service_inner
        .expect_cancel_intent()
        .returning(|_| Err(anyhow!(B256::random())));
    mock_chain_service_inner
        .expect_get_chain_id()
        .returning(|| 37);

    let rpc = MedusaRpcImpl::new(
        Address::from_str(MEDUSA_ADDRESS).unwrap(),
        Arc::clone(&mock_chain_service),
        storage_service.clone(),
        sender,
    )
    .await;
    let key = String::from("0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6");
    let intent = create_mock_signed_intent(current_timestamp() + 1000, key.clone());

    rpc.propose_intent(intent.clone()).await.unwrap();
    let msg = receiver.recv().await.unwrap();
    match msg {
        WsBroadcastMessage::NewIntent(_) => {}
        _ => panic!("expected new intent broadcast"),
    }
    let signer = PrivateKeySigner::from_str(&key).unwrap();

    let intent_id_payload = PayloadIntentId {
        intent_id: intent.intent.intent_id(),
        nonce: U256::random(),
        chain_id: 37,
    };
    let signed_payload = sign_payload(intent_id_payload, signer);

    let ret = rpc.cancel_intent(signed_payload).await;
    assert!(ret.is_err());
    let stored_intent_status = storage_service
        .get_intent_status(&intent.intent.intent_id())
        .await
        .unwrap()
        .unwrap();
    assert_eq!(stored_intent_status, IntentState::Error);
    let stored_history = storage_service
        .get_history_for_intent(&intent.intent.intent_id())
        .await
        .unwrap();
    assert!(stored_history.cancel_timestamp.is_none());
    assert_eq!(stored_history.error_type, Some(IntentErrorType::Cancel));
}

#[sqlx::test(migrations = false)]
async fn test_request_add_solver(pool: DbPool) {
    init_tracing();
    let mut mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();

    let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
    mock_chain_service_inner
        .expect_get_chain_id()
        .returning(|| 37);

    let rpc = MedusaRpcImpl::new(
        Address::from_str(MEDUSA_ADDRESS).unwrap(),
        Arc::clone(&mock_chain_service),
        storage_service.clone(),
        Sender::new(1),
    )
    .await;
    let signer = PrivateKeySigner::from_str(MEDUSA_KEY).unwrap();
    let addr = Address::from(alloy::primitives::FixedBytes::<20>::random());
    let addr_payload = PayloadAddress {
        address: addr,
        nonce: U256::random(),
        chain_id: 37,
    };
    let signed_payload = sign_payload(addr_payload, signer);

    let ret = rpc.request_add_solver(signed_payload).await;
    assert!(ret.is_ok());
}

#[sqlx::test(migrations = false)]
async fn test_create_refinement(pool: DbPool) {
    init_tracing();
    let mut mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();

    let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();
    mock_chain_service_inner
        .expect_get_chain_id()
        .returning(|| 37);

    let sender = Sender::new(100);
    let mut receiver = sender.subscribe();
    let rpc = MedusaRpcImpl::new(
        Address::from_str(MEDUSA_ADDRESS).unwrap(),
        Arc::clone(&mock_chain_service),
        storage_service.clone(),
        sender,
    )
    .await;
    let intent = create_dummy_signed_intent(current_timestamp()).intent;
    let intent_id = intent.intent_id();
    let ret = rpc.create_refinement(intent).await.unwrap();
    assert_eq!(ret, intent_id);
    let refinement = storage_service.get_refinement(intent_id).await.unwrap();
    assert!(refinement.is_none());
    let msg = receiver.recv().await.unwrap();
    match msg {
        WsBroadcastMessage::RefinementNeededForIntent(intent) => {
            assert_eq!(intent.intent_id(), intent_id);
        }
        _ => panic!("expected refinement needed for intent"),
    }
}
