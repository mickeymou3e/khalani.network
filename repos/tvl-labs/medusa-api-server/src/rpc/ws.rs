use alloy::primitives::{keccak256, Address, Parity, Signature, B256, U256};
use alloy::sol_types::SolValue;
use apm::{
    failed_intent_gauge, failed_solution_gauge, open_intent_gauge, solved_intent_gauge,
    valid_solution_gauge, ws_connection_gauge,
};
use futures::SinkExt;
use futures_util::stream::StreamExt;
use medusa_types::conversion::RpcToSol;
use medusa_types::{IntentId, IntentState, OutType};
use medusa_types::{SignedIntent, SignedSolution};
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::broadcast::{Receiver, Sender};
use tokio_tungstenite::tungstenite::Message;
use tracing::{debug, error, info, warn};

use crate::{chain::ChainServiceTrait, storage::StorageService};
use medusa_types::IntentErrorType;

use medusa_types::ws::*;

pub async fn ws_serve(
    addr: SocketAddr,
    chain: Arc<impl ChainServiceTrait>,
    store: Arc<StorageService>,
    event_pub: Arc<Sender<WsBroadcastMessage>>,
    expiration_tx: Sender<Vec<IntentId>>,
) {
    let socket = TcpListener::bind(addr)
        .await
        .expect("Error binding to address");

    info!("WebSocket Server Starting");

    while let Ok((stream, addr)) = socket.accept().await {
        let chain_clone = Arc::clone(&chain);
        let store_clone = Arc::clone(&store);
        let event_sub = event_pub.subscribe();
        let expiration_rx = expiration_tx.subscribe();

        tokio::spawn(async move {
            handle_ws(
                chain_clone,
                store_clone,
                event_sub,
                stream,
                addr,
                expiration_rx,
            )
            .await;
        });
    }
}

async fn handle_ws(
    chain: Arc<impl ChainServiceTrait>,
    store: Arc<StorageService>,
    mut event_sub: Receiver<WsBroadcastMessage>,
    stream: TcpStream,
    addr: SocketAddr,
    mut expiration_rx: Receiver<Vec<IntentId>>,
) {
    let ws_stream = tokio_tungstenite::accept_async(stream).await.map_err(|e| {
        error!("Error during WS handshake: {:?}", e);
    });

    if ws_stream.is_err() {
        return;
    }

    let (mut ws_sender, mut ws_receiver) = ws_stream.unwrap().split();

    info!("New WS connection {}", addr);
    ws_connection_gauge().add(1);
    let store_clone = Arc::clone(&store);
    let mut connection = WsConnection::new(store_clone);
    loop {
        tokio::select! {
            Ok(event) = event_sub.recv() => {
                ws_sender
                    .send(Message::Text(serde_json::to_string(&event).unwrap()))
                    .await
                    .expect("Send to WS");
            }

            Ok(expired_ids) = expiration_rx.recv() => {
                info!("WS server received expired intents.");
                for id in expired_ids {
                    info!(intent_id = ?id, "intent expired.");
                    ws_sender.send(
                        Message::Text(
                            serde_json::to_string(
                                &WsBroadcastMessage::IntentStatusUpdated(id, IntentState::Expired)
                            ).unwrap()
                        )
                    ).await.expect("error sending expired intent");
                    info!(intent_id = ?id, "intent expiration broadcasted to WS clients.");

                    let intent = store.get_intent(&id).await;
                    if intent.is_err() {
                        warn!(intent_id = %id, "intent does not exist but is marked expired.");
                        continue;
                    }
                    let intent = intent.unwrap();
                    if intent.is_none() {
                        warn!(intent_id = %id, "intent does not exist but is marked expired.");
                        continue;
                    }
                    let intent = intent.unwrap();
                    match chain.withdraw_intent(&id, intent.author, intent.src_m_token, intent.src_amount, Arc::clone(&store)).await {
                        Ok(tx_hash) => {
                            info!(intent_id = %id, "intent withdrawal succeeded after expiration.");
                            store.update_history_after_hub_withdrawal(&id, tx_hash).await.expect("error updating history after intent withdrawal");
                        }
                        Err(error) => {
                            let tx_hash = error.downcast::<B256>().unwrap_or_default();
                            failed_intent_gauge().add(1);
                            error!(tx_hash = %tx_hash, intent_id = %id, "intent withdrawal failed after expiration.");
                            store.record_existing_intent_failure(&id, IntentErrorType::Withdraw, tx_hash).await.expect("error recording existing intent failure");
                        }
                    };
                }
            }

            req = ws_receiver.next() => {
                match req {
                    Some(Ok(ws_req)) => {
                        if ws_req.is_close() {
                            ws_connection_gauge().sub(1);
                            return;
                        }

                        if !ws_req.is_text() {
                            continue;
                        }

                        if let Ok(payload) =
                            serde_json::from_str::<WsPayload>(ws_req.to_text().unwrap()) {
                            debug!("Received WebSocket message: {:#?}", payload);
                            if let Some(messages) =
                                connection.handle_ws_request(Arc::clone(&chain), Arc::clone(&store), payload).await {
                                    for resp in messages {
                                        ws_sender.send(resp).await.expect("Send to WS");
                                    }
                            } else {
                                ws_connection_gauge().sub(1);
                                return;
                            }
                        }
                    }

                    _ => {
                        ws_connection_gauge().sub(1);
                        return;
                    }
                }
            }
        }
    }
}

struct WsConnection {
    solver_addr: Address,
    cleanup_tx: Option<tokio::sync::oneshot::Sender<Address>>,
}

impl Drop for WsConnection {
    fn drop(&mut self) {
        if self.solver_addr != Address::default() {
            info!(
                "solver session closing, disconnecting solver: {}",
                self.solver_addr
            );
            if let Some(sender) = Option::take(&mut self.cleanup_tx) {
                sender.send(self.solver_addr).unwrap();
            }
        }
    }
}

impl WsConnection {
    fn new(store: Arc<StorageService>) -> Self {
        let (cleanup_tx, cleanup_rx) = tokio::sync::oneshot::channel();

        tokio::spawn(async move {
            if let Ok(addr) = cleanup_rx.await {
                if let Err(e) = store.disconnect_solver(addr).await {
                    error!("Error disconnecting solver {}: {}", addr, e);
                }
                info!("solver {} disconnected", addr);
            }
        });
        Self {
            solver_addr: Address::default(),
            cleanup_tx: Some(cleanup_tx),
        }
    }

    async fn handle_ws_request(
        &mut self,
        chain: Arc<impl ChainServiceTrait>,
        store: Arc<StorageService>,
        payload: WsPayload,
    ) -> Option<Vec<Message>> {
        if self.solver_addr == Address::default() {
            info!("receiving first ws message from new connection");
            if let WsPayload::AddSolver(addr) = payload {
                info!("first ws message is add solver: {}", addr);
                match store.connect_solver(addr).await {
                    Ok(_) => {
                        info!("solver address authorized. Adding to connection");
                        self.solver_addr = addr;
                        return Some(vec![]);
                    }
                    Err(error) => {
                        error!("error connecting solver: {}", error);
                        return None;
                    }
                }
            } else {
                error!("first ws message is not AddSolver. Disconnecting.");
                return None;
            }
        }
        let messages = match payload {
            WsPayload::RequestOpenIntents => {
                info!("received message: RequestOpenIntents");
                let intents = store.get_open_intents().await.unwrap();
                debug!("{} open intents in total: {:#?}", intents.len(), intents);
                info!("sending message: ExistingOpenIntents back to solver");
                vec![WsBroadcastMessage::ExistingOpenIntents(intents)]
            }
            WsPayload::ProposeSolution(solution) => {
                info!(
                    "received message: ProposeSolution, {:#?}",
                    solution.solution
                );
                if !self.verify_solution_signature(&solution).await {
                    warn!(solution_hash = ?solution.hash(), "Invalid solution signature");
                    failed_solution_gauge().add(1);
                    return Some(vec![]);
                }
                info!("solution signature verified");
                if let Ok((solve_tx_hash, blk_number)) = chain.post_solution(&solution).await {
                    info!(tx_hash = %solve_tx_hash, "`post_solution`: contract call succeeded.");
                    valid_solution_gauge().add(1);
                    store
                        .insert_solution(&solution, solve_tx_hash)
                        .await
                        .unwrap();
                    info!("solution inserted into storage");
                    let mut author_for_withdrawal: Option<Address> = None;
                    let mut token_for_withdrawal: Option<Vec<Address>> = None;
                    for intent_id in solution.solution.intent_ids.iter() {
                        if let Ok(Some(intent)) = store.get_intent(intent_id).await {
                            if intent.outcome.fill_structure
                                != medusa_types::FillStructure::PercentageFilled
                            {
                                author_for_withdrawal = Some(intent.author);
                                token_for_withdrawal = Some(intent.outcome.m_tokens);
                            }
                        }
                    }
                    let author_for_withdrawal = author_for_withdrawal.unwrap_or_default();
                    let token_for_withdrawal = token_for_withdrawal.unwrap_or_default();

                    for (receipt_idx, receipt) in
                        solution.solution.receipt_outputs.iter().enumerate()
                    {
                        info!(
                            "processing receipt at index {}: {:#?}",
                            receipt_idx, receipt
                        );
                        let mut intent_id: Option<IntentId> = None;
                        for spend_record in solution.solution.spend_graph.iter() {
                            if spend_record.output_idx.out_type == OutType::Receipt
                                && spend_record.output_idx.out_idx as usize == receipt_idx
                            {
                                intent_id = solution
                                    .solution
                                    .intent_ids
                                    .get(spend_record.src_idx as usize)
                                    .copied();
                                // assert_eq!(spend_record.qty, receipt.m_token_amount);
                            }
                        }

                        let args = [
                            receipt.owner.abi_encode(),
                            receipt.m_token.abi_encode(),
                            receipt.m_token_amount.abi_encode(),
                            blk_number.abi_encode(),
                        ]
                        .concat();

                        let intent_id = intent_id.unwrap();
                        info!(
                            "receipt at index {} is fulfilled by intent with id: {}",
                            receipt_idx, intent_id
                        );
                        let receipt_id = keccak256(&args);
                        match chain.redeem_receipt(&receipt_id).await {
                            Ok(tx_hash) => {
                                info!(receipt_id = %receipt_id, tx_hash = %tx_hash, "`redeem`: contract call succeeded after solving.");
                                store
                                    .update_history_after_redeem(&intent_id, tx_hash)
                                    .await
                                    .unwrap();
                                info!(
                                    "receipt at index {} is redeemed, now withdrawing mtokens",
                                    receipt_idx
                                );

                                // if receipt.owner == author_for_withdrawal
                                //     && token_for_withdrawal.contains(&receipt.m_token)
                                // {
                                // info!(
                                //         "receipt mtoken is {} and receipt author is {}. Withdrawing mtokents from this receipt.",
                                //         receipt.m_token, receipt.owner
                                //     );
                                match chain
                                    .withdraw_mtokens_from_intent_receipt(
                                        intent_id,
                                        receipt.owner,
                                        receipt.m_token,
                                        receipt.m_token_amount,
                                        Arc::clone(&store),
                                    )
                                    .await
                                {
                                    Ok(tx_hash) => {
                                        info!(receipt_id = %receipt_id, tx_hash = %tx_hash, "`withdraw_mtokens_from_intent_receipt`: contract call succeeded after solving.");
                                        store
                                            .update_history_after_hub_withdrawal(
                                                &intent_id, tx_hash,
                                            )
                                            .await
                                            .unwrap();
                                    }
                                    Err(error) => {
                                        let tx_hash = error.downcast::<B256>().unwrap_or_default();
                                        error!(receipt_id = %receipt_id, tx_hash = %tx_hash, "`withdraw_mtokens_from_intent_receipt`: contract call failed after solving.");
                                        store
                                            .record_existing_intent_failure(
                                                &intent_id,
                                                IntentErrorType::Withdraw,
                                                tx_hash,
                                            )
                                            .await
                                            .unwrap();
                                    }
                                }
                                // }
                            }
                            Err(error) => {
                                let tx_hash = error.downcast::<B256>().unwrap_or_default();
                                error!(receipt_id = %receipt_id, tx_hash = %tx_hash, "`redeem`: contract call failed after solving.");
                                store
                                    .record_existing_intent_failure(
                                        &intent_id,
                                        IntentErrorType::Redeem,
                                        tx_hash,
                                    )
                                    .await
                                    .unwrap();
                            }
                        };
                    }
                    // info!("processing output intents from solution");
                    // for new_intent in solution.solution.intent_outputs.iter() {
                    //     let signed_intent = SignedIntent {
                    //         intent: new_intent.clone(),
                    //         signature: Signature::new(
                    //             U256::from(0),
                    //             U256::from(0),
                    //             Parity::Parity(false),
                    //         ),
                    //     };
                    //     store
                    //         .record_published_intent(&signed_intent, solve_tx_hash)
                    //         .await
                    //         .unwrap();
                    // }
                    open_intent_gauge().sub(solution.solution.intent_ids.len() as i64);
                    solved_intent_gauge().add(solution.solution.intent_ids.len() as i64);
                    open_intent_gauge().add(solution.solution.intent_outputs.len() as i64);
                    info!("new intents inserted into storage");
                    info!("new intents broadcasted to solvers");
                    vec![WsBroadcastMessage::IntentsSolved(
                        solution.solution.intent_ids,
                        self.solver_addr,
                    )]
                    .into_iter()
                    .chain(
                        solution
                            .solution
                            .intent_outputs
                            .into_iter()
                            .map(WsBroadcastMessage::NewIntent),
                    )
                    .collect()
                } else {
                    warn!("solution rejected");
                    failed_solution_gauge().add(1);
                    vec![WsBroadcastMessage::SolutionRejected(solution)]
                }
            }

            WsPayload::AddSolver(_addr) => {
                // let _ = store.insert_solver(addr).await;
                // self.solver_addr = addr;
                error!("Cannot add solver after connection is established. Disconnecting.");
                return None;
            }

            WsPayload::GetSolutionsForIntent(intent_id) => {
                if let Ok(Some(solutions)) = store.get_solution_by_intent_id(&intent_id).await {
                    vec![WsBroadcastMessage::Solutions(1, vec![solutions.solution])]
                } else {
                    vec![]
                }
            }

            WsPayload::GetSolutionsForSolver(addr) => {
                if let Ok(solutions) = store.get_solutions_by_solver(&addr).await {
                    let size = solutions.len() as u128;
                    let sol = solutions
                        .iter()
                        .map(|s| s.solution.clone())
                        .collect::<Vec<_>>();
                    vec![WsBroadcastMessage::Solutions(size, sol)]
                } else {
                    vec![]
                }
            }

            WsPayload::IntentRefinement(intent_id, refinement) => {
                info!("received message: IntentRefinement");
                store
                    .update_refinement(intent_id, refinement)
                    .await
                    .unwrap();
                info!("intent refinement updated");
                vec![]
            }
        };
        Some(
            messages
                .iter()
                .map(|x| Message::Text(serde_json::to_string(x).unwrap()))
                .collect(),
        )
    }

    async fn verify_solution_signature(&self, solution: &SignedSolution) -> bool {
        let raw = solution.solution.convert_to_sol_type().abi_encode();
        if let Ok(addr) = solution
            .signature
            .recover_address_from_prehash(&keccak256(raw))
        {
            return addr == self.solver_addr;
        }

        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::rpc::test_utils::*;
    use alloy::signers::local::PrivateKeySigner;
    use medusa_types::RefinementStatus;
    use mockall::predicate;
    use tracing_subscriber::{fmt, EnvFilter};

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
    #[tokio::test]
    async fn test_add_solver() {
        init_tracing();

        let (mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());
        let addr = Address::from(alloy::primitives::FixedBytes::<20>::random());
        mock_storage_service
            .authorize_new_solver(addr)
            .await
            .unwrap();
        {
            let mut ws_connection = WsConnection::new(Arc::clone(&mock_storage_service));
            ws_connection
                .handle_ws_request(
                    Arc::clone(&mock_chain_service),
                    Arc::clone(&mock_storage_service),
                    WsPayload::AddSolver(addr),
                )
                .await
                .unwrap();
            assert_eq!(ws_connection.solver_addr, addr);
            let mut other_ws_connection = WsConnection::new(Arc::clone(&mock_storage_service));
            let result = other_ws_connection
                .handle_ws_request(
                    Arc::clone(&mock_chain_service),
                    Arc::clone(&mock_storage_service),
                    WsPayload::AddSolver(addr),
                )
                .await;
            assert!(result.is_none());
        }
        tokio::time::sleep(std::time::Duration::from_secs(1)).await;
        let mut ws_connection = WsConnection::new(Arc::clone(&mock_storage_service));
        ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
                WsPayload::AddSolver(addr),
            )
            .await
            .unwrap();
        assert_eq!(ws_connection.solver_addr, addr);
    }
    #[tokio::test]
    async fn test_solution_submission_success() {
        init_tracing();
        let (mut mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());

        let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();

        let signed_intent = create_dummy_signed_intent(current_timestamp() + 1000);
        let intent_id = signed_intent.intent.intent_id();
        let solution = mock_solution_for_intent(intent_id, signed_intent.intent.author);
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
            .expect_redeem_receipt()
            .returning(|_| Ok(B256::random()));

        mock_chain_service_inner
            .expect_withdraw_mtokens_from_intent_receipt()
            .returning(|_, _, _, _, _| Ok(B256::random()));

        mock_storage_service
            .record_published_intent(&signed_intent, B256::random())
            .await
            .unwrap();
        mock_storage_service
            .authorize_new_solver(solver_address)
            .await
            .unwrap();
        let mut ws_connection = WsConnection::new(Arc::clone(&mock_storage_service));
        ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
                WsPayload::AddSolver(solver_address),
            )
            .await
            .unwrap();
        let messages = ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
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
            )
        );
        assert_eq!(
            messages[1],
            Message::Text(
                serde_json::to_string(&WsBroadcastMessage::NewIntent(
                    signed_solution.clone().solution.intent_outputs[0].clone()
                ))
                .unwrap()
            )
        );
        let open_intents = mock_storage_service.get_open_intents().await.unwrap();
        assert_eq!(open_intents.len(), 1);
        assert_eq!(
            open_intents[0].intent_id(),
            signed_solution.solution.intent_outputs[0].intent_id()
        );
    }

    #[tokio::test]
    async fn test_solution_submission_solve_failure() {
        init_tracing();
        let (mut mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());

        let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();

        let signed_intent = create_dummy_signed_intent(current_timestamp() + 1000);
        let intent_id = signed_intent.intent.intent_id();
        let solution = mock_solution_for_intent(intent_id, signed_intent.intent.author);
        let solver_signer = PrivateKeySigner::random();
        let solver_address = solver_signer.address();
        let signed_solution = solution.sign(&solver_signer).await;
        let signed_solution_clone = signed_solution.clone();

        mock_chain_service_inner
            .expect_post_solution()
            .with(predicate::function(move |x: &SignedSolution| {
                x.signature == signed_solution_clone.signature
            }))
            .returning(|_| Err(anyhow::anyhow!("test error")));
        mock_storage_service
            .record_published_intent(&signed_intent, B256::random())
            .await
            .unwrap();
        mock_storage_service
            .authorize_new_solver(solver_address)
            .await
            .unwrap();
        let mut ws_connection = WsConnection::new(Arc::clone(&mock_storage_service));
        ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
                WsPayload::AddSolver(solver_address),
            )
            .await
            .unwrap();

        let messages = ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
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
            )
        );
        let open_intents = mock_storage_service.get_open_intents().await.unwrap();
        assert_eq!(open_intents.len(), 1);
        assert_eq!(open_intents[0].intent_id(), intent_id);
        let status = mock_storage_service
            .get_intent_status(&intent_id)
            .await
            .unwrap();
        assert!(status.is_some());
        assert_eq!(status.unwrap(), IntentState::Open);
    }

    #[tokio::test]
    async fn test_solution_submission_redeem_failure() {
        init_tracing();
        let (mut mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());

        let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();

        let signed_intent = create_dummy_signed_intent(1000);
        let intent_id = signed_intent.intent.intent_id();
        let solution = mock_solution_for_intent(intent_id, signed_intent.intent.author);
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
            .expect_redeem_receipt()
            .returning(|_| Err(anyhow::anyhow!(B256::random())));
        mock_storage_service
            .record_published_intent(&signed_intent, B256::random())
            .await
            .unwrap();
        mock_storage_service
            .authorize_new_solver(solver_address)
            .await
            .unwrap();
        let mut ws_connection = WsConnection::new(Arc::clone(&mock_storage_service));
        ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
                WsPayload::AddSolver(solver_address),
            )
            .await
            .unwrap();

        let messages = ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
                WsPayload::ProposeSolution(signed_solution.clone()),
            )
            .await;
        assert!(messages.is_some());
        let messages = messages.unwrap();
        assert_eq!(messages.len(), 2);
        assert_eq!(
            messages[0],
            Message::Text(
                serde_json::to_string(&WsBroadcastMessage::IntentsSolved(
                    vec![intent_id],
                    solver_address
                ))
                .unwrap()
            )
        );
        assert_eq!(
            messages[1],
            Message::Text(
                serde_json::to_string(&WsBroadcastMessage::NewIntent(
                    signed_solution.clone().solution.intent_outputs[0].clone()
                ))
                .unwrap()
            )
        );

        let open_intents = mock_storage_service.get_open_intents().await.unwrap();
        assert_eq!(open_intents.len(), 1);
        assert_eq!(
            open_intents[0].intent_id(),
            signed_solution.solution.intent_outputs[0].intent_id()
        );
        let status = mock_storage_service
            .get_intent_status(&intent_id)
            .await
            .unwrap();
        assert!(status.is_some());
        assert_eq!(status.unwrap(), IntentState::Error);
    }

    #[tokio::test]
    async fn test_solution_submission_withdraw_failure() {
        init_tracing();
        let (mut mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());

        let mock_chain_service_inner = Arc::get_mut(&mut mock_chain_service).unwrap();

        let signed_intent = create_dummy_signed_intent(1000);
        let intent_id = signed_intent.intent.intent_id();
        let solution = mock_solution_for_intent(intent_id, signed_intent.intent.author);
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
            .expect_redeem_receipt()
            .returning(|_| Ok(B256::random()));

        mock_chain_service_inner
            .expect_withdraw_mtokens_from_intent_receipt()
            .returning(|_, _, _, _, _| Err(anyhow::anyhow!(B256::random())));

        mock_storage_service
            .record_published_intent(&signed_intent, B256::random())
            .await
            .unwrap();
        mock_storage_service
            .authorize_new_solver(solver_address)
            .await
            .unwrap();
        let mut ws_connection = WsConnection::new(Arc::clone(&mock_storage_service));
        ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
                WsPayload::AddSolver(solver_address),
            )
            .await
            .unwrap();

        let messages = ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
                WsPayload::ProposeSolution(signed_solution.clone()),
            )
            .await;
        assert!(messages.is_some());
        let messages = messages.unwrap();
        assert_eq!(messages.len(), 2);
        assert_eq!(
            messages[0],
            Message::Text(
                serde_json::to_string(&WsBroadcastMessage::IntentsSolved(
                    vec![intent_id],
                    solver_address
                ))
                .unwrap()
            )
        );
        assert_eq!(
            messages[1],
            Message::Text(
                serde_json::to_string(&WsBroadcastMessage::NewIntent(
                    signed_solution.clone().solution.intent_outputs[0].clone()
                ))
                .unwrap()
            )
        );

        let open_intents = mock_storage_service.get_open_intents().await.unwrap();
        assert_eq!(open_intents.len(), 1);
        assert_eq!(
            open_intents[0].intent_id(),
            signed_solution.solution.intent_outputs[0].intent_id()
        );
        let status = mock_storage_service
            .get_intent_status(&intent_id)
            .await
            .unwrap();
        assert!(status.is_some());
        assert_eq!(status.unwrap(), IntentState::Error);
    }

    #[tokio::test]
    async fn test_request_open_intents() {
        init_tracing();
        let (mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());
        let addr = Address::from(alloy::primitives::FixedBytes::<20>::random());
        mock_storage_service
            .authorize_new_solver(addr)
            .await
            .unwrap();
        let mut ws_connection = WsConnection::new(Arc::clone(&mock_storage_service));
        ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
                WsPayload::AddSolver(addr),
            )
            .await
            .unwrap();

        let signed_intent_0 = create_dummy_signed_intent(current_timestamp());
        let signed_intent_1 = create_dummy_signed_intent(current_timestamp() + 1003);
        let signed_intent_2 = create_dummy_signed_intent(current_timestamp() + 1005);
        let signed_intent_3 = create_dummy_signed_intent(current_timestamp() + 1007);
        mock_storage_service
            .record_published_intent(&signed_intent_0, B256::random())
            .await
            .unwrap();
        mock_storage_service
            .record_published_intent(&signed_intent_1, B256::random())
            .await
            .unwrap();
        mock_storage_service
            .record_published_intent(&signed_intent_2, B256::random())
            .await
            .unwrap();
        mock_storage_service
            .record_published_intent(&signed_intent_3, B256::random())
            .await
            .unwrap();

        tokio::time::sleep(std::time::Duration::from_secs(5)).await;

        let messages = ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
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

    #[tokio::test]
    async fn test_update_refinement() {
        init_tracing();
        let (mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());
        let addr = Address::from(alloy::primitives::FixedBytes::<20>::random());
        mock_storage_service
            .authorize_new_solver(addr)
            .await
            .unwrap();
        let mut ws_connection = WsConnection::new(Arc::clone(&mock_storage_service));
        ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
                WsPayload::AddSolver(addr),
            )
            .await
            .unwrap();
        let intent_id = create_dummy_signed_intent(current_timestamp())
            .intent
            .intent_id();
        mock_storage_service
            .insert_refinement(intent_id)
            .await
            .unwrap();
        let refined_intent = create_dummy_signed_intent(current_timestamp() + 1000).intent;
        let messages = ws_connection
            .handle_ws_request(
                Arc::clone(&mock_chain_service),
                Arc::clone(&mock_storage_service),
                WsPayload::IntentRefinement(
                    intent_id,
                    medusa_types::RefinementStatus::Refinement(refined_intent.clone()),
                ),
            )
            .await;
        assert!(messages.is_some());
        assert_eq!(messages.unwrap().len(), 0);
        let refinement = mock_storage_service
            .get_refinement(intent_id)
            .await
            .unwrap();
        assert!(refinement.is_some());
        assert_eq!(
            refinement.unwrap(),
            RefinementStatus::Refinement(refined_intent)
        );
    }

    #[tokio::test]
    async fn test_destructor() {
        init_tracing();
        let (mock_chain_service, mock_storage_service) = get_test_services(dummy_provider());
        let addr = Address::from(alloy::primitives::FixedBytes::<20>::random());
        mock_storage_service
            .authorize_new_solver(addr)
            .await
            .unwrap();
        let solver_addr = Address::from(alloy::primitives::FixedBytes::<20>::random());

        {
            let mut ws_connection = WsConnection::new(Arc::clone(&mock_storage_service));

            mock_storage_service
                .authorize_new_solver(solver_addr)
                .await
                .unwrap();

            ws_connection
                .handle_ws_request(
                    Arc::clone(&mock_chain_service),
                    Arc::clone(&mock_storage_service),
                    WsPayload::AddSolver(solver_addr),
                )
                .await
                .unwrap();

            assert_eq!(ws_connection.solver_addr, solver_addr);
        }
        tokio::time::sleep(std::time::Duration::from_secs(1)).await;
        let connected_solvers = mock_storage_service
            .get_connected_solvers(10)
            .await
            .unwrap();
        assert_eq!(connected_solvers.len(), 0);
    }
}
