use alloy::signers::local::PrivateKeySigner;
use medusa_types::{
    Address, B256, FillRecord, Intent, IntentErrorType, IntentId, IntentState, MoveRecord, OutType,
    OutputIdx, Receipt, RefinementStatus, Signature, SignedIntent, SignedSolution, Solution, U256,
};
use tracing_subscriber::{EnvFilter, fmt};

use crate::db::on_pool;
use crate::*;

fn current_timestamp() -> u64 {
    crate::db::current_timestamp() as u64
}

fn init_tracing() {
    // Only initialize once
    static INIT: std::sync::Once = std::sync::Once::new();
    INIT.call_once(|| {
        let _ = fmt()
            .with_env_filter(
                EnvFilter::from_default_env().add_directive("debug=info".parse().unwrap()),
            )
            .with_test_writer() // Use test writer to avoid conflicts in parallel tests
            .try_init();
    });
}

fn create_dummy_intent(ttl: u64) -> Intent {
    Intent::simple_swap(
        Address::from_slice(&[0u8; 20]),
        U256::from(ttl),
        None,
        Address::from_slice(&[1u8; 20]),
        U256::from(100),
        Address::from_slice(&[2u8; 20]),
        U256::from(100),
    )
}

fn create_dummy_signature() -> Signature {
    Signature::from_bytes_and_parity(&[0u8; 65], true)
}

fn create_dummy_signed_intent(ttl: u64) -> SignedIntent {
    SignedIntent {
        intent: create_dummy_intent(ttl),
        signature: create_dummy_signature(),
    }
}

async fn create_mock_solution_for_intent(intent_id: IntentId, owner: Address) -> SignedSolution {
    let signer = PrivateKeySigner::random();
    let solution = Solution {
        intent_ids: vec![intent_id],
        receipt_outputs: vec![Receipt {
            m_token: Address::random(),
            m_token_amount: U256::from(100),
            owner,
            intent_hash: intent_id,
        }],
        intent_outputs: vec![create_dummy_intent(1000)],
        spend_graph: vec![
            MoveRecord {
                src_idx: 0,
                output_idx: OutputIdx {
                    out_type: OutType::Intent,
                    out_idx: 0,
                },
                qty: U256::from(100),
            },
            MoveRecord {
                src_idx: 0,
                output_idx: OutputIdx {
                    out_type: OutType::Receipt,
                    out_idx: 0,
                },
                qty: U256::from(100),
            },
        ],
        fill_graph: vec![
            FillRecord {
                in_idx: 0,
                out_idx: 0,
                out_type: OutType::Intent,
            },
            FillRecord {
                in_idx: 0,
                out_idx: 0,
                out_type: OutType::Receipt,
            },
        ],
    };
    solution.sign(&signer).await
}

#[sqlx::test(migrations = false)]
async fn test_nonce_unique_check(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let result = store.check_and_update_nonce(U256::from(1)).await;
    assert!(result.is_ok());

    let result = store.check_and_update_nonce(U256::from(37)).await;
    assert!(result.is_ok());

    let result = store.check_and_update_nonce(U256::from(37)).await;
    assert!(result.is_err_and(|e| matches!(
        e.downcast_ref::<StorageError>(),
        Some(StorageError::NonceUniqueCheckFailed(..))
    )));
}

#[sqlx::test(migrations = false)]
async fn test_record_published_intent(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let time = current_timestamp();
    let expected_intent = create_dummy_intent(time + 1000);
    let signed_intent = create_dummy_signed_intent(time + 1000);
    let tx_hash = B256::random();

    store
        .record_published_intent(&signed_intent, tx_hash)
        .await
        .unwrap();

    let stored_intent = store
        .get_intent(&expected_intent.intent_id())
        .await
        .unwrap();
    assert!(stored_intent.is_some());
    assert_eq!(stored_intent.unwrap(), expected_intent);
    assert_eq!(
        store
            .get_intent_status(&expected_intent.intent_id())
            .await
            .unwrap()
            .unwrap(),
        IntentState::Open
    );
    let stored_history = store
        .get_history_for_intent(&expected_intent.intent_id())
        .await
        .unwrap();
    assert_eq!(stored_history.publish_tx_hash, Some(tx_hash));
    assert!(stored_history.publish_timestamp.unwrap() >= time);
    assert!(stored_history.solve_tx_hash.is_none());
    assert!(stored_history.solve_timestamp.is_none());
    assert!(stored_history.cancel_tx_hash.is_none());
    assert!(stored_history.cancel_timestamp.is_none());
    assert!(stored_history.error_tx_hash.is_none());
    assert!(stored_history.error_timestamp.is_none());
    assert!(stored_history.error_type.is_none());
    assert!(stored_history.remaining_intent_id.is_none());
    assert!(stored_history.redeem_tx_hash.is_none());
    assert!(stored_history.redeem_timestamp.is_none());
    assert!(stored_history.withdraw_tx_hash.is_none());
    assert!(stored_history.withdraw_timestamp.is_none());
    assert!(stored_history.withdraw_to_spoke_timestamp.is_none());
}

#[sqlx::test(migrations = false)]
async fn test_record_publishing_failure(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let time = current_timestamp();
    let signed_intent = create_dummy_signed_intent(time + 1000);
    let intent_id = signed_intent.intent.intent_id();
    let tx_hash = B256::random();

    let result = store
        .record_publishing_failure(&signed_intent, tx_hash)
        .await;
    assert!(result.is_ok());

    let status = store.get_intent_status(&intent_id).await.unwrap();
    assert_eq!(status, Some(IntentState::Error));

    let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
    assert_eq!(stored_history.error_tx_hash, Some(tx_hash));
    assert!(stored_history.error_timestamp.is_some());
    assert_eq!(stored_history.error_type, Some(IntentErrorType::Publish));
    assert!(stored_history.publish_tx_hash.is_none());
    assert!(stored_history.publish_timestamp.is_none());
    assert!(stored_history.solve_tx_hash.is_none());
    assert!(stored_history.solve_timestamp.is_none());
    assert!(stored_history.cancel_tx_hash.is_none());
    assert!(stored_history.cancel_timestamp.is_none());
    assert!(stored_history.remaining_intent_id.is_none());
    assert!(stored_history.redeem_tx_hash.is_none());
    assert!(stored_history.redeem_timestamp.is_none());
    assert!(stored_history.withdraw_tx_hash.is_none());
    assert!(stored_history.withdraw_timestamp.is_none());
    assert!(stored_history.withdraw_to_spoke_timestamp.is_none());

    let failed_intent_ids = store.get_failed_intent_ids().await.unwrap();
    assert_eq!(failed_intent_ids.len(), 1);
    assert_eq!(failed_intent_ids[0], intent_id);
}

#[sqlx::test(migrations = false)]
async fn test_record_existing_intent_failure_active(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let time = current_timestamp();
    let signed_intent = create_dummy_signed_intent(time + 1000);
    let intent_id = signed_intent.intent.intent_id();
    let publish_tx_hash = B256::random();

    store
        .record_published_intent(&signed_intent, publish_tx_hash)
        .await
        .unwrap();

    let result = store
        .record_existing_intent_failure(&intent_id, IntentErrorType::Cancel, publish_tx_hash)
        .await;
    assert!(result.is_ok());

    let status = store.get_intent_status(&intent_id).await.unwrap();
    assert_eq!(status, Some(IntentState::Error));

    let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
    assert_eq!(stored_history.error_tx_hash, Some(publish_tx_hash));
    assert!(stored_history.error_timestamp.is_some());
    assert_eq!(stored_history.error_type, Some(IntentErrorType::Cancel));
    assert_eq!(stored_history.publish_tx_hash, Some(publish_tx_hash));
    assert!(stored_history.publish_timestamp.is_some());
    assert!(stored_history.solve_tx_hash.is_none());
    assert!(stored_history.solve_timestamp.is_none());
    assert!(stored_history.cancel_tx_hash.is_none());
    assert!(stored_history.cancel_timestamp.is_none());
    assert!(stored_history.remaining_intent_id.is_none());
    assert!(stored_history.redeem_tx_hash.is_none());
    assert!(stored_history.redeem_timestamp.is_none());
    assert!(stored_history.withdraw_tx_hash.is_none());
    assert!(stored_history.withdraw_timestamp.is_none());
    assert!(stored_history.withdraw_to_spoke_timestamp.is_none());

    let failed_intent_ids = store.get_failed_intent_ids().await.unwrap();
    assert_eq!(failed_intent_ids.len(), 1);
    assert_eq!(failed_intent_ids[0], intent_id);
}

#[sqlx::test(migrations = false)]
async fn test_record_existing_intent_failure_inactive(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let time = current_timestamp();
    let signed_intent = create_dummy_signed_intent(time + 1000);
    let intent_id = signed_intent.intent.intent_id();
    let author = signed_intent.intent.author;
    let publish_tx_hash = B256::random();

    store
        .record_published_intent(&signed_intent, publish_tx_hash)
        .await
        .unwrap();

    let solution = create_mock_solution_for_intent(intent_id, author).await;
    let solve_tx_hash = B256::random();

    store
        .insert_solution(&solution, solve_tx_hash)
        .await
        .unwrap();

    let result = store
        .record_existing_intent_failure(&intent_id, IntentErrorType::Solve, publish_tx_hash)
        .await;
    assert!(result.is_ok());

    let status = store.get_intent_status(&intent_id).await.unwrap();
    assert_eq!(status, Some(IntentState::Error));

    let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
    assert_eq!(stored_history.error_tx_hash, Some(publish_tx_hash));
    assert!(stored_history.error_timestamp.is_some());
    assert_eq!(stored_history.error_type, Some(IntentErrorType::Solve));
    assert_eq!(stored_history.publish_tx_hash, Some(publish_tx_hash));
    assert!(stored_history.publish_timestamp.is_some());
    assert_eq!(stored_history.solve_tx_hash, Some(solve_tx_hash));
    assert!(stored_history.solve_timestamp.is_some());
    assert!(stored_history.cancel_tx_hash.is_none());
    assert!(stored_history.cancel_timestamp.is_none());
    assert!(stored_history.remaining_intent_id.is_some());
    assert!(stored_history.redeem_tx_hash.is_none());
    assert!(stored_history.redeem_timestamp.is_none());
    assert!(stored_history.withdraw_tx_hash.is_none());
    assert!(stored_history.withdraw_timestamp.is_none());
    assert!(stored_history.withdraw_to_spoke_timestamp.is_none());
}

#[sqlx::test(migrations = false)]
async fn test_authorize_solver(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let solver = Address::random();
    store.authorize_new_solver(solver).await.unwrap();

    let solvers = store.get_authorized_solvers(1).await.unwrap();
    assert_eq!(solvers.len(), 1);
    assert_eq!(solvers[0], solver);

    let result = store.deauthorize_solver(solver).await;
    assert!(result.is_ok());

    let solvers = store.get_authorized_solvers(10).await.unwrap();
    assert_eq!(solvers.len(), 0);
}

#[sqlx::test(migrations = false)]
async fn test_connect_solver(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let solver = Address::random();
    let result = store.connect_solver(solver).await;
    assert!(result.is_err());

    let result = store.authorize_new_solver(solver).await;
    assert!(result.is_ok());

    let result = store.connect_solver(solver).await;
    assert!(result.is_ok());

    let solvers = store.get_connected_solvers(10).await.unwrap();
    assert_eq!(solvers.len(), 1);
    assert_eq!(solvers[0], solver);
}

#[sqlx::test(migrations = false)]
async fn test_insert_solution(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let intent = create_dummy_signed_intent(current_timestamp() + 1000);
    let intent_id = intent.intent.intent_id();
    let author = intent.intent.author;
    let publish_tx_hash = B256::random();
    store
        .record_published_intent(&intent, publish_tx_hash)
        .await
        .unwrap();

    // Get solution should return None when the solution is not inserted.
    let opt_solution = store.get_solution_by_intent_id(&intent_id).await.unwrap();
    assert!(opt_solution.is_none());
    let solutions = store.get_solutions(10).await.unwrap();
    assert!(solutions.is_empty());

    // Get solution for non-existent intent should return an error.
    let random_intent_id = B256::random();
    let result = store.get_solution_by_intent_id(&random_intent_id).await;
    assert!(result.is_err_and(
        |e| matches!(e.downcast(), Ok(StorageError::CanNotFindIntent(id)) if id == random_intent_id)
    ));

    // Create a mock solution
    let solution = create_mock_solution_for_intent(intent_id, author).await;
    let remaining_intent_id = solution.solution.intent_outputs[0].intent_id();
    let solve_tx_hash = B256::random();

    let result = store.insert_solution(&solution, solve_tx_hash).await;
    assert!(result.is_ok());

    let stored_solution = store
        .get_solution_by_intent_id(&solution.solution.intent_ids[0])
        .await
        .unwrap();
    assert!(stored_solution.is_some());

    assert_eq!(store.get_solutions(10).await.unwrap().len(), 1);
    let solver = solution.recover_address();
    assert_eq!(
        store.get_solutions_by_solver(&solver).await.unwrap().len(),
        1
    );

    let status = store.get_intent_status(&intent_id).await.unwrap();
    assert_eq!(status, Some(IntentState::Solved));

    let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
    assert_eq!(stored_history.solve_tx_hash, Some(solve_tx_hash));
    assert!(stored_history.solve_timestamp.is_some());
    assert!(stored_history.publish_tx_hash.is_some());
    assert!(stored_history.publish_timestamp.is_some());
    assert!(stored_history.error_tx_hash.is_none());
    assert!(stored_history.error_timestamp.is_none());
    assert!(stored_history.error_type.is_none());
    assert_eq!(
        stored_history.remaining_intent_id,
        Some(remaining_intent_id)
    );
    assert!(stored_history.redeem_tx_hash.is_none());
    assert!(stored_history.redeem_timestamp.is_none());
    assert!(stored_history.withdraw_tx_hash.is_none());
    assert!(stored_history.withdraw_timestamp.is_none());
    assert!(stored_history.cancel_tx_hash.is_none());
    assert!(stored_history.cancel_timestamp.is_none());
    assert!(stored_history.withdraw_to_spoke_timestamp.is_none());
}

#[sqlx::test(migrations = false)]
async fn test_insert_refinement(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let intent_id = B256::random();
    let result = store.insert_refinement(intent_id).await;
    assert!(result.is_ok());

    let refinement = store.get_refinement(intent_id).await.unwrap();
    assert!(refinement.is_none());
}

#[sqlx::test(migrations = false)]
async fn test_update_refinement(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let intent_id = B256::random();
    let refinement = RefinementStatus::RefinementNotFound;

    store
        .update_refinement(intent_id, refinement.clone())
        .await
        .unwrap();

    let stored_refinement = store.get_refinement(intent_id).await.unwrap();
    assert!(stored_refinement.is_some());
    assert_eq!(stored_refinement.unwrap(), refinement);
}

#[sqlx::test(migrations = false)]
async fn test_cancel_intent(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let intent = create_dummy_signed_intent(current_timestamp() + 1000);
    let intent_id = intent.intent.intent_id();
    let publish_tx_hash = B256::random();
    store
        .record_published_intent(&intent, publish_tx_hash)
        .await
        .unwrap();

    let cancel_tx_hash = B256::random();
    let result = store.cancel_intent(&intent_id, cancel_tx_hash).await;
    assert!(result.is_ok());

    let status = store.get_intent_status(&intent.intent_id()).await.unwrap();
    assert_eq!(status, Some(IntentState::Cancelled));

    let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
    assert_eq!(stored_history.cancel_tx_hash, Some(cancel_tx_hash));
    assert!(stored_history.cancel_timestamp.is_some());
    assert_eq!(stored_history.publish_tx_hash, Some(publish_tx_hash));
    assert!(stored_history.publish_timestamp.unwrap() <= current_timestamp());
    assert!(stored_history.solve_tx_hash.is_none());
    assert!(stored_history.solve_timestamp.is_none());
    assert!(stored_history.error_tx_hash.is_none());
    assert!(stored_history.error_timestamp.is_none());
    assert!(stored_history.error_type.is_none());
    assert!(stored_history.remaining_intent_id.is_none());
    assert!(stored_history.redeem_tx_hash.is_none());
    assert!(stored_history.redeem_timestamp.is_none());
    assert!(stored_history.withdraw_tx_hash.is_none());
    assert!(stored_history.withdraw_timestamp.is_none());
    assert!(stored_history.withdraw_to_spoke_timestamp.is_none());
}

#[sqlx::test(migrations = false)]
async fn test_update_history_after_redeem(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let intent = create_dummy_signed_intent(current_timestamp() + 1000);
    let intent_id = intent.intent.intent_id();
    let publish_tx_hash = B256::random();
    store
        .record_published_intent(&intent, publish_tx_hash)
        .await
        .unwrap();
    let redeem_tx_hash = B256::random();
    let result = store
        .update_history_after_redeem(&intent_id, redeem_tx_hash)
        .await;
    assert!(result.is_ok());

    let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
    assert_eq!(stored_history.redeem_tx_hash, Some(redeem_tx_hash));
    assert!(stored_history.redeem_timestamp.is_some());
    assert_eq!(stored_history.publish_tx_hash, Some(publish_tx_hash));
    assert!(stored_history.publish_timestamp.unwrap() <= current_timestamp());
    assert!(stored_history.solve_tx_hash.is_none());
    assert!(stored_history.solve_timestamp.is_none());
    assert!(stored_history.cancel_tx_hash.is_none());
    assert!(stored_history.cancel_timestamp.is_none());
    assert!(stored_history.error_tx_hash.is_none());
    assert!(stored_history.error_timestamp.is_none());
    assert!(stored_history.error_type.is_none());
    assert!(stored_history.remaining_intent_id.is_none());
    assert!(stored_history.withdraw_tx_hash.is_none());
    assert!(stored_history.withdraw_timestamp.is_none());
    assert!(stored_history.withdraw_to_spoke_timestamp.is_none());
}

#[sqlx::test(migrations = false)]
async fn test_update_history_after_withdrawal(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let intent = create_dummy_signed_intent(current_timestamp() + 1000);
    let intent_id = intent.intent.intent_id();
    let publish_tx_hash = B256::random();
    store
        .record_published_intent(&intent, publish_tx_hash)
        .await
        .unwrap();
    let withdrawal_tx_hash = B256::random();
    let result = store
        .update_history_after_hub_withdrawal(&intent_id, withdrawal_tx_hash)
        .await;
    assert!(result.is_ok());

    let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
    assert_eq!(stored_history.withdraw_tx_hash, Some(withdrawal_tx_hash));
    assert!(stored_history.withdraw_timestamp.is_some());
    assert_eq!(stored_history.publish_tx_hash, Some(publish_tx_hash));
    assert!(stored_history.publish_timestamp.unwrap() <= current_timestamp());
    assert!(stored_history.solve_tx_hash.is_none());
    assert!(stored_history.solve_timestamp.is_none());
    assert!(stored_history.cancel_tx_hash.is_none());
    assert!(stored_history.cancel_timestamp.is_none());
    assert!(stored_history.error_tx_hash.is_none());
    assert!(stored_history.error_timestamp.is_none());
    assert!(stored_history.error_type.is_none());
    assert!(stored_history.remaining_intent_id.is_none());
    assert!(stored_history.redeem_tx_hash.is_none());
    assert!(stored_history.redeem_timestamp.is_none());
}

#[sqlx::test(migrations = false)]
async fn test_update_history_after_withdrawal_reach_spoke(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let intent = create_dummy_signed_intent(current_timestamp() + 1000);
    let intent_id = intent.intent.intent_id();
    let publish_tx_hash = B256::random();
    store
        .record_published_intent(&intent, publish_tx_hash)
        .await
        .unwrap();
    let withdrawal_tx_hash = B256::random();
    store
        .update_history_after_hub_withdrawal(&intent_id, withdrawal_tx_hash)
        .await
        .unwrap();
    let result = store
        .update_history_after_withdrawal_reach_spoke(&intent_id)
        .await;
    assert!(result.is_ok());

    let stored_history = store.get_history_for_intent(&intent_id).await.unwrap();
    assert_eq!(stored_history.withdraw_tx_hash, Some(withdrawal_tx_hash));
    assert!(stored_history.withdraw_timestamp.is_some());
    assert_eq!(stored_history.publish_tx_hash, Some(publish_tx_hash));
    assert!(stored_history.publish_timestamp.unwrap() <= current_timestamp());
    assert!(stored_history.solve_tx_hash.is_none());
    assert!(stored_history.solve_timestamp.is_none());
    assert!(stored_history.cancel_tx_hash.is_none());
    assert!(stored_history.cancel_timestamp.is_none());
    assert!(stored_history.error_tx_hash.is_none());
    assert!(stored_history.error_timestamp.is_none());
    assert!(stored_history.error_type.is_none());
    assert!(stored_history.remaining_intent_id.is_none());
    assert!(stored_history.redeem_tx_hash.is_none());
    assert!(stored_history.redeem_timestamp.is_none());
    assert!(stored_history.withdraw_to_spoke_timestamp.is_some());
}

#[sqlx::test(migrations = false)]
async fn test_expired_intents(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    // Create an intent that will expire soon
    let height = 100;
    store.update_chain_height(height);
    let short_ttl = 1;
    let intent = create_dummy_signed_intent(height + short_ttl);
    let intent_id = intent.intent.intent_id();
    let publish_tx_hash = B256::random();

    // Record the intent
    store
        .record_published_intent(&intent, publish_tx_hash)
        .await
        .unwrap();

    let status = store.get_intent_status(&intent_id).await.unwrap();
    println!("status: {:?}", status);
    assert_eq!(status, Some(IntentState::Open));

    // Check that open intents are not empty
    assert!(!store.get_open_intents().await.unwrap().is_empty());

    // Wait for the intent to expire
    store.update_chain_height(height + short_ttl + 1);
    tokio::time::sleep(std::time::Duration::from_secs(10)).await; // wait for poll_process

    // Check that open intents are empty
    assert!(store.get_open_intents().await.unwrap().is_empty());

    let handle = tokio::spawn(
        store
            .clone()
            .poll_process_expired_intents(std::time::Duration::from_secs(2)),
    );
    let mut rx = store.subscribe_expired_intents();
    let expired_intents = rx.recv().await.unwrap();
    handle.abort();

    assert_eq!(expired_intents.len(), 1);
    assert_eq!(expired_intents[0], intent_id);

    // Verify the intent is now in Expired state
    let expired_status = store.get_intent_status(&intent_id).await.unwrap();
    assert_eq!(expired_status, Some(IntentState::Expired));
}

#[sqlx::test(migrations = false)]
async fn test_get_chain_height(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();
    store.update_chain_height(100);

    let height = store.get_chain_height();
    assert_eq!(height, 100);
}

#[sqlx::test(migrations = false)]
async fn test_metrics(pool: DbPool) {
    init_tracing();
    let store = on_pool(pool).build().await.unwrap();

    let intent = create_dummy_signed_intent(current_timestamp() + 1000);
    let intent_id = intent.intent.intent_id();
    let publish_tx_hash = B256::random();
    store
        .record_published_intent(&intent, publish_tx_hash)
        .await
        .unwrap();

    let count = store.get_intent_count().await.unwrap();
    assert_eq!(count, 1);
    let open_count = store
        .get_intent_status_count(IntentState::Open)
        .await
        .unwrap();
    assert_eq!(open_count, 1);

    let solution = create_mock_solution_for_intent(intent_id, intent.intent.author).await;
    let solver = solution.recover_address();
    let solution_tx_hash = B256::random();
    store
        .insert_solution(&solution, solution_tx_hash)
        .await
        .unwrap();

    let count = store.get_intent_count().await.unwrap();
    assert_eq!(count, 2);
    let solved_count = store
        .get_intent_status_count(IntentState::Solved)
        .await
        .unwrap();
    assert_eq!(solved_count, 1);
    let open_count = store
        .get_intent_status_count(IntentState::Open)
        .await
        .unwrap();
    assert_eq!(open_count, 1);

    let intents_by_author = store.get_intents_by_author_count(10).await.unwrap();
    assert_eq!(intents_by_author.len(), 1);
    assert_eq!(intents_by_author[0].0, intent.intent.author);
    assert_eq!(intents_by_author[0].1, 2);

    let valid_solution_count = store.get_valid_solution_count().await.unwrap();
    assert_eq!(valid_solution_count, 1);
    let failed_solution_count = store.get_failed_solution_count().await.unwrap();
    assert_eq!(failed_solution_count, 0);

    let solutions_by_solver = store.get_solutions_by_solver_count(10).await.unwrap();
    assert_eq!(solutions_by_solver.len(), 1);
    assert_eq!(solutions_by_solver[0].0, solver);
    assert_eq!(solutions_by_solver[0].1, 1);
}
