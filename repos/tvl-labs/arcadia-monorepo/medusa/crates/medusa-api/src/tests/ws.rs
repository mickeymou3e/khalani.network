use std::sync::Arc;

use alloy::primitives::{Address, B256, U256};
use alloy::signers::local::PrivateKeySigner;
use medusa_storage::{DbPool, StorageServiceTrait as _, on_pool};
use medusa_tx_worker::TransactionError;
use medusa_types::{
    IntentErrorType, IntentState, RefinementStatus, SignedSolution, WsBroadcastMessage, WsPayload,
};
use mockall::predicate;
use tokio_tungstenite::tungstenite::Message;
use tracing_subscriber::{EnvFilter, fmt};

use crate::tests::test_utils::*;
use crate::ws::WsConnection;

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

#[sqlx::test(migrations = false)]
async fn test_add_solver(pool: DbPool) {
    init_tracing();
    let mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();
    let addr = Address::from(alloy::primitives::FixedBytes::<20>::random());
    storage_service.authorize_new_solver(addr).await.unwrap();
    {
        let mut ws_connection = WsConnection::new(storage_service.clone());
        ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                &storage_service,
                WsPayload::AddSolver(addr),
            )
            .await
            .unwrap();
        assert_eq!(ws_connection.solver_addr, addr);
        let mut other_ws_connection = WsConnection::new(storage_service.clone());
        let result = other_ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                &storage_service,
                WsPayload::AddSolver(addr),
            )
            .await;
        assert!(result.is_none());
    }
    tokio::time::sleep(std::time::Duration::from_secs(1)).await;
    let mut ws_connection = WsConnection::new(storage_service.clone());
    ws_connection
        .handle_ws_request(
            Arc::clone(&mock_chain_service),
            &storage_service,
            WsPayload::AddSolver(addr),
        )
        .await
        .unwrap();
    assert_eq!(ws_connection.solver_addr, addr);
}

#[sqlx::test(migrations = false)]
async fn test_solution_submission_success(pool: DbPool) {
    init_tracing();
    let mut mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();
    storage_service.update_chain_height(1);
    let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();

    let signed_intent = create_dummy_signed_intent(current_timestamp() + 1000);
    let intent_id = signed_intent.intent.intent_id();
    let solution = mock_solution_for_intent(
        intent_id,
        signed_intent.intent.author,
        current_timestamp() + 2000,
    );
    let solver_signer = PrivateKeySigner::random();
    let solver_address = solver_signer.address();
    let signed_solution = solution.sign(&solver_signer).await;
    let signed_solution_clone = signed_solution.clone();

    mock_chain_service_inner
        .expect_post_solution()
        .with(predicate::function(move |x: &SignedSolution| {
            x.signature == signed_solution_clone.signature
        }))
        .returning(|_| Ok((B256::random(), 37)));
    mock_chain_service_inner
        .expect_get_nonce()
        .returning(|_| Ok(U256::from(1))); // this is the nonce set in dummy intents

    mock_chain_service_inner
        .expect_withdraw_mtokens()
        .returning(|_, _, _| Ok(B256::random()));

    storage_service
        .record_published_intent(&signed_intent, B256::random())
        .await
        .unwrap();

    storage_service
        .authorize_new_solver(solver_address)
        .await
        .unwrap();

    let mut ws_connection = WsConnection::new(storage_service.clone());
    ws_connection
        .handle_ws_request(
            Arc::clone(&mock_chain_service),
            &storage_service,
            WsPayload::AddSolver(solver_address),
        )
        .await
        .unwrap();
    let messages = ws_connection
        .handle_ws_request(
            Arc::clone(&mock_chain_service),
            &storage_service,
            WsPayload::ProposeSolution(signed_solution.clone()),
        )
        .await
        .unwrap();
    assert_eq!(messages.len(), 2);
    assert_eq!(
        messages[0],
        Message::Text(
            serde_json::to_string(&WsBroadcastMessage::IntentsSolved(
                vec![intent_id],
                solver_address
            ))
            .unwrap()
            .into()
        )
    );
    assert_eq!(
        messages[1],
        Message::Text(
            serde_json::to_string(&WsBroadcastMessage::NewIntent(
                signed_solution.clone().solution.intent_outputs[0].clone()
            ))
            .unwrap()
            .into()
        )
    );
    let open_intents = storage_service.get_open_intents().await.unwrap();
    assert_eq!(open_intents.len(), 1);
    assert_eq!(
        open_intents[0].intent_id(),
        signed_solution.solution.intent_outputs[0].intent_id()
    );
    let history = storage_service
        .get_history_for_intent(&intent_id)
        .await
        .unwrap();
    assert!(history.solve_timestamp.is_some());
    let state = storage_service.get_intent_status(&intent_id).await.unwrap();
    assert!(state.is_some());
    assert_eq!(state.unwrap(), IntentState::Solved);
}

#[sqlx::test(migrations = false)]
async fn test_solution_submission_solve_failure(pool: DbPool) {
    init_tracing();
    let mut mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();
    storage_service.update_chain_height(1);
    let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();

    let signed_intent = create_dummy_signed_intent(current_timestamp() + 1000);
    let intent_id = signed_intent.intent.intent_id();
    let solution = mock_solution_for_intent(
        intent_id,
        signed_intent.intent.author,
        current_timestamp() + 2000,
    );
    let solver_signer = PrivateKeySigner::random();
    let solver_address = solver_signer.address();
    let signed_solution = solution.sign(&solver_signer).await;
    let signed_solution_clone = signed_solution.clone();

    mock_chain_service_inner
        .expect_post_solution()
        .with(predicate::function(move |x: &SignedSolution| {
            x.signature == signed_solution_clone.signature
        }))
        .returning(|_| {
            Err(anyhow::anyhow!(TransactionError::new(
                B256::random(),
                "test error"
            )))
        });
    mock_chain_service_inner
        .expect_get_receipt_nonce()
        .returning(|| Ok(U256::from(37)));
    mock_chain_service_inner
        .expect_get_nonce()
        .returning(|_| Ok(U256::from(1))); // this is the nonce set in dummy intents
    storage_service
        .record_published_intent(&signed_intent, B256::random())
        .await
        .unwrap();
    storage_service
        .authorize_new_solver(solver_address)
        .await
        .unwrap();
    let mut ws_connection = WsConnection::new(storage_service.clone());
    ws_connection
        .handle_ws_request(
            Arc::clone(&mock_chain_service),
            &storage_service,
            WsPayload::AddSolver(solver_address),
        )
        .await
        .unwrap();

    let messages = ws_connection
        .handle_ws_request(
            Arc::clone(&mock_chain_service),
            &storage_service,
            WsPayload::ProposeSolution(signed_solution.clone()),
        )
        .await;
    assert!(messages.is_some());
    assert_eq!(messages.clone().unwrap().len(), 1);
    assert_eq!(
        messages.unwrap()[0],
        Message::Text(
            serde_json::to_string(&WsBroadcastMessage::SolutionRejected(signed_solution))
                .unwrap()
                .into()
        )
    );
    let open_intents = storage_service.get_open_intents().await.unwrap();
    assert_eq!(open_intents.len(), 1);
    assert_eq!(open_intents[0].intent_id(), intent_id);
    let status = storage_service.get_intent_status(&intent_id).await.unwrap();
    assert!(status.is_some());
    assert_eq!(status.unwrap(), IntentState::Error);
    let history = storage_service
        .get_history_for_intent(&intent_id)
        .await
        .unwrap();
    assert!(history.solve_timestamp.is_none());
    assert!(history.error_timestamp.is_some());
    assert_eq!(history.error_type, Some(IntentErrorType::Solve));
}

#[sqlx::test(migrations = false)]
async fn test_request_open_intents(pool: DbPool) {
    init_tracing();
    let mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();
    let addr = Address::from(alloy::primitives::FixedBytes::<20>::random());
    storage_service.authorize_new_solver(addr).await.unwrap();
    storage_service.update_chain_height(100);
    let mut ws_connection = WsConnection::new(storage_service.clone());
    ws_connection
        .handle_ws_request(
            Arc::clone(&mock_chain_service),
            &storage_service,
            WsPayload::AddSolver(addr),
        )
        .await
        .unwrap();

    let signed_intent_0 = create_dummy_signed_intent(99);
    let signed_intent_1 = create_dummy_signed_intent(105);
    let signed_intent_2 = create_dummy_signed_intent(106);
    let signed_intent_3 = create_dummy_signed_intent(107);
    storage_service
        .record_published_intent(&signed_intent_0, B256::random())
        .await
        .unwrap();
    storage_service
        .record_published_intent(&signed_intent_1, B256::random())
        .await
        .unwrap();
    storage_service
        .record_published_intent(&signed_intent_2, B256::random())
        .await
        .unwrap();
    storage_service
        .record_published_intent(&signed_intent_3, B256::random())
        .await
        .unwrap();

    let messages = ws_connection
        .handle_ws_request(
            Arc::clone(&mock_chain_service),
            &storage_service,
            WsPayload::RequestOpenIntents,
        )
        .await
        .unwrap();
    assert_eq!(messages.len(), 1);
    match messages[0].clone() {
        Message::Text(text) => {
            let ws_msg: WsBroadcastMessage = serde_json::from_str(&text).unwrap();
            match ws_msg {
                WsBroadcastMessage::ExistingOpenIntents(intents) => {
                    assert_eq!(intents.len(), 3);
                }
                _ => panic!("Expected ExistingOpenIntents message"),
            }
        }
        _ => panic!("Expected a text message"),
    }
}

#[sqlx::test(migrations = false)]
async fn test_update_refinement(pool: DbPool) {
    init_tracing();
    let mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();
    let addr = Address::from(alloy::primitives::FixedBytes::<20>::random());
    storage_service.authorize_new_solver(addr).await.unwrap();
    let mut ws_connection = WsConnection::new(storage_service.clone());
    ws_connection
        .handle_ws_request(
            Arc::clone(&mock_chain_service),
            &storage_service,
            WsPayload::AddSolver(addr),
        )
        .await
        .unwrap();
    let intent_id = create_dummy_signed_intent(current_timestamp())
        .intent
        .intent_id();
    storage_service.insert_refinement(intent_id).await.unwrap();
    let refined_intent = create_dummy_signed_intent(current_timestamp() + 1000).intent;
    let messages = ws_connection
        .handle_ws_request(
            Arc::clone(&mock_chain_service),
            &storage_service,
            WsPayload::IntentRefinement(
                intent_id,
                medusa_types::RefinementStatus::Refinement(refined_intent.clone()),
            ),
        )
        .await;
    assert!(messages.is_some());
    assert_eq!(messages.unwrap().len(), 0);
    let refinement = storage_service.get_refinement(intent_id).await.unwrap();
    assert!(refinement.is_some());
    assert_eq!(
        refinement.unwrap(),
        RefinementStatus::Refinement(refined_intent)
    );
}

#[sqlx::test(migrations = false)]
async fn test_destructor(pool: DbPool) {
    init_tracing();
    let mock_chain_service = mock_chain_service(dummy_provider());
    let storage_service = on_pool(pool).build().await.unwrap();
    let addr = Address::from(alloy::primitives::FixedBytes::<20>::random());
    storage_service.authorize_new_solver(addr).await.unwrap();
    let solver_addr = Address::from(alloy::primitives::FixedBytes::<20>::random());

    {
        let mut ws_connection = WsConnection::new(storage_service.clone());

        storage_service
            .authorize_new_solver(solver_addr)
            .await
            .unwrap();

        ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                &storage_service,
                WsPayload::AddSolver(solver_addr),
            )
            .await
            .unwrap();

        assert_eq!(ws_connection.solver_addr, solver_addr);
    }
    tokio::time::sleep(std::time::Duration::from_secs(1)).await;
    let connected_solvers = storage_service.get_connected_solvers(10).await.unwrap();
    assert_eq!(connected_solvers.len(), 0);
}
