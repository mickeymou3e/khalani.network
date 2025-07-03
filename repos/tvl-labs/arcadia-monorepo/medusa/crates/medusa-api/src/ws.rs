use std::net::SocketAddr;
use std::sync::Arc;

use alloy::primitives::{Address, U256, keccak256};
use alloy::sol_types::SolValue;
use futures::{SinkExt, StreamExt};
use medusa_apm::{failed_solution_counter, ws_connection_gauge};
use medusa_storage::{StorageService, StorageServiceTrait};
use medusa_tx_worker::{ChainServiceTrait, TransactionError};
use medusa_types::conversion::RpcToSol;
use medusa_types::ws::*;
use medusa_types::{
    FillStructure, IntentErrorType, IntentId, IntentState, OutType, OutcomeAssetStructure,
    SignedSolution,
};
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::broadcast::{Receiver, Sender};
use tokio_tungstenite::tungstenite::Message;
use tracing::{debug, error, info, warn};

pub async fn ws_serve(
    addr: SocketAddr,
    chain: Arc<impl ChainServiceTrait>,
    store: StorageService,
    event_pub: Sender<WsBroadcastMessage>,
) {
    let socket = TcpListener::bind(addr)
        .await
        .expect("Error binding to address");

    info!("WebSocket Server Starting");

    while let Ok((stream, addr)) = socket.accept().await {
        let chain_clone = Arc::clone(&chain);
        let store_clone = store.clone();
        let event_sub = event_pub.subscribe();

        tokio::spawn(async move {
            handle_ws(chain_clone, store_clone, event_sub, stream, addr).await;
        });
    }
}

async fn handle_ws(
    chain: Arc<impl ChainServiceTrait>,
    store: StorageService,
    mut event_sub: Receiver<WsBroadcastMessage>,
    stream: TcpStream,
    addr: SocketAddr,
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
    let mut connection = WsConnection::new(store.clone());
    let mut expiration_rx = store.subscribe_expired_intents();
    loop {
        tokio::select! {
            Ok(event) = event_sub.recv() => {
                ws_sender
                    .send(Message::Text(serde_json::to_string(&event).unwrap().into()))
                    .await
                    .expect("Send to WS");
            }

            Ok(expired_ids) = expiration_rx.recv() => {
                info!("WS server received expired intents.");
                for &id in expired_ids.iter() {
                    info!(intent_id = ?id, "intent expired.");
                    ws_sender.send(
                        Message::Text(
                            serde_json::to_string(
                                &WsBroadcastMessage::IntentStatusUpdated(id, IntentState::Expired)
                            ).unwrap().into()
                        )
                    ).await.expect("error sending expired intent");
                    info!(intent_id = ?id, "intent expiration broadcasted to WS clients.");
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
                                connection.handle_ws_request(Arc::clone(&chain), &store, payload).await {
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

pub struct WsConnection {
    pub(crate) solver_addr: Address,
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
    pub fn new(store: StorageService) -> Self {
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

    pub async fn handle_ws_request(
        &mut self,
        chain: Arc<impl ChainServiceTrait>,
        store: &StorageService,
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
            WsPayload::ProposeSolution(mut solution) => {
                info!(
                    "received message: ProposeSolution, {:#?}",
                    solution.solution
                );
                if !self.verify_solution_signature(&solution).await {
                    warn!(solution_hash = ?solution.hash(), "Invalid solution signature");
                    return Some(vec![]);
                }
                info!("solution signature verified");

                let authors = solution
                    .solution
                    .intent_outputs
                    .iter()
                    .map(|i| i.author)
                    .collect::<Vec<_>>();

                let mut nonces = std::collections::HashMap::new();

                for author in authors {
                    let new_nonce = chain.get_nonce(author).await.unwrap();
                    nonces.insert(author, new_nonce);
                }

                for intent in solution.solution.intent_outputs.iter_mut() {
                    let author = intent.author;
                    let new_nonce = nonces.get_mut(&author).unwrap();
                    intent.nonce = new_nonce.clone();
                    *new_nonce += U256::from(1);
                }

                match chain.post_solution(&solution).await {
                    Ok((solve_tx_hash, _blk_number)) => {
                        info!(tx_hash = %solve_tx_hash, "`post_solution`: contract call succeeded.");
                        store
                            .insert_solution(&solution, solve_tx_hash)
                            .await
                            .unwrap();
                        info!("solution inserted into storage");
                        for (receipt_idx, receipt) in
                            solution.solution.receipt_outputs.iter().enumerate()
                        {
                            info!(
                                "processing receipt at index {}: {:#?}",
                                receipt_idx, receipt
                            );
                            let mut from_intent_id: Option<IntentId> = None;
                            for spend_record in solution.solution.spend_graph.iter() {
                                if spend_record.output_idx.out_type == OutType::Receipt
                                    && spend_record.output_idx.out_idx as usize == receipt_idx
                                {
                                    from_intent_id = solution
                                        .solution
                                        .intent_ids
                                        .get(spend_record.src_idx as usize)
                                        .copied();
                                }
                            }
                            if from_intent_id.is_none() {
                                error!(
                                    "receipt at index {} is not funded by any intent. This should never happen.",
                                    receipt_idx
                                );
                                continue;
                            }
                            let from_intent_id = from_intent_id.unwrap();
                            let mut to_intent_id: Option<IntentId> = None;
                            for fill_record in solution.solution.fill_graph.iter() {
                                if fill_record.out_type == OutType::Receipt
                                    && fill_record.out_idx as usize == receipt_idx
                                {
                                    to_intent_id = solution
                                        .solution
                                        .intent_ids
                                        .get(fill_record.in_idx as usize)
                                        .copied();
                                }
                            }
                            if to_intent_id.is_none() {
                                error!(
                                    "receipt at index {} is not used to fulfill any intent. This should never happen.",
                                    receipt_idx
                                );
                                continue;
                            }
                            let to_intent_id = to_intent_id.unwrap();
                            info!(
                                "receipt at index {} is funded by intent with id: {}, and is used to fulfill intent with id: {}",
                                receipt_idx, from_intent_id, to_intent_id
                            );
                            let intent_fulfilled =
                                store.get_intent(&to_intent_id).await.unwrap().unwrap();
                            if intent_fulfilled.outcome.fill_structure == FillStructure::Exact
                                && intent_fulfilled.outcome.outcome_asset_structure
                                    == OutcomeAssetStructure::AnySingle
                            {
                                info!(
                                    "intent with id: {} is a bridge intent. Withdrawing mtokens.",
                                    to_intent_id
                                );
                                match chain
                                    .withdraw_mtokens(
                                        intent_fulfilled.author,
                                        receipt.m_token,
                                        receipt.m_token_amount,
                                    )
                                    .await
                                {
                                    Ok(tx_hash) => {
                                        store
                                            .update_history_after_hub_withdrawal(
                                                &to_intent_id,
                                                tx_hash,
                                            )
                                            .await
                                            .unwrap();
                                    }
                                    Err(error) => {
                                        let tx_error = error
                                            .downcast::<TransactionError>()
                                            .unwrap_or_default();
                                        store
                                            .record_existing_intent_failure(
                                                &to_intent_id,
                                                IntentErrorType::Withdraw,
                                                tx_error.tx_hash,
                                            )
                                            .await
                                            .unwrap();
                                    }
                                }
                            } else {
                                info!(
                                    "intent with id: {} is not a bridge intent. Not withdrawing mtokens.",
                                    to_intent_id
                                );
                            }
                        }

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
                    }
                    Err(error) => {
                        warn!("solution rejected");
                        failed_solution_counter().inc();
                        // as of may 2025, the first intent is always a bridge intent
                        let bridge_intent_id = solution.solution.intent_ids.get(0).unwrap();
                        let tx_hash = error.downcast::<TransactionError>().unwrap().tx_hash;
                        store
                            .record_existing_intent_failure(
                                bridge_intent_id,
                                IntentErrorType::Solve,
                                tx_hash,
                            )
                            .await
                            .unwrap();

                        vec![WsBroadcastMessage::SolutionRejected(solution)]
                    }
                }
            }
            WsPayload::AddSolver(_addr) => {
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
                .map(|x| Message::Text(serde_json::to_string(x).unwrap().into()))
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
