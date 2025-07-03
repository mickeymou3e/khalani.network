use std::str::FromStr;
use std::sync::Arc;

use alloy::primitives::keccak256;
use alloy::signers::local::PrivateKeySigner;
use alloy::sol_types::SolValue;
use anyhow::{Result, anyhow};
use base64::Engine as _;
use base64::engine::general_purpose::STANDARD;
use futures::stream::{SplitSink, SplitStream};
use futures::{SinkExt, StreamExt};
use medusa_types::conversion::RpcToSol;
use medusa_types::*;
use rand::RngCore;
use tokio::net::TcpStream;
use tokio::sync::{Mutex, mpsc};
use tokio_tungstenite::tungstenite::http::Request;
use tokio_tungstenite::tungstenite::protocol::Message;
use tokio_tungstenite::{MaybeTlsStream, WebSocketStream, connect_async};
use tracing::{debug, info, warn};
use url::Url;

use crate::matchmaker::Matchmaker;

pub struct Solver {
    send: Arc<Mutex<SplitSink<WebSocketStream<MaybeTlsStream<TcpStream>>, Message>>>,
    read: SplitStream<WebSocketStream<MaybeTlsStream<TcpStream>>>,
    matchmaker: Matchmaker,
    running: Arc<Mutex<bool>>,
    signer: PrivateKeySigner,
}

impl Solver {
    pub async fn new(medusa_url: String, key: String) -> Result<Self> {
        let signer = PrivateKeySigner::from_str(&key).unwrap();
        let solver_address = signer.address();
        let url = Url::parse(&medusa_url).unwrap();
        let host = url.host_str().unwrap();
        let port = url.port_or_known_default().unwrap();

        let mut random_bytes = [0u8; 16];
        rand::thread_rng().fill_bytes(&mut random_bytes);
        let key = STANDARD.encode(random_bytes);

        let request = Request::builder()
            .uri(url.as_str())
            .header("Host", format!("{}:{}", host, port))
            .header("Upgrade", "websocket")
            .header("Connection", "Upgrade")
            .header("Sec-WebSocket-Version", "13")
            .header("Sec-WebSocket-Key", key)
            .body(())
            .unwrap();

        let (ws_stream, _) = connect_async(request).await?;
        let (mut send, read) = ws_stream.split();

        send.send(Message::Text(
            serde_json::to_string(&WsPayload::AddSolver(solver_address))
                .unwrap()
                .into(),
        ))
        .await?;

        Ok(Solver {
            send: Arc::new(Mutex::new(send)),
            read,
            matchmaker: Matchmaker::new(),
            running: Arc::new(Mutex::new(true)),
            signer,
        })
    }

    pub fn get_running_state(&self) -> Arc<Mutex<bool>> {
        Arc::clone(&self.running)
    }

    pub async fn run(mut self) -> Result<()> {
        info!("Solver is running.");

        let (tx, mut rx) = mpsc::channel(64);
        // let read = Arc::clone(&self.read);
        let running = Arc::clone(&self.running);
        let receiving_handle = tokio::spawn(async move {
            while let Some(Ok(Message::Text(raw_message))) = self.read.next().await {
                // drop(read);
                if !*running.lock().await {
                    break;
                }
                debug!("listener gets {}", raw_message);
                let message = raw_message.replace("\\\"", "\"").replace("\\'", "'");
                let _ = tx.send(message).await;
            }
        });
        let send = Arc::clone(&self.send);
        send.lock()
            .await
            .send(Message::Text(
                serde_json::to_string(&WsPayload::RequestOpenIntents)
                    .unwrap()
                    .into(),
            ))
            .await?;
        info!("Requesting existing liquidities...");
        let running = Arc::clone(&self.running);
        let processing_handle = tokio::spawn(async move {
            while let Some(message) = rx.recv().await {
                if !*running.lock().await {
                    break;
                }
                debug!("processor gets {}", message);
                let broadcast_message: WsBroadcastMessage = serde_json::from_str(&message)
                    .expect("Intent received from server is corrupted");
                match broadcast_message {
                    WsBroadcastMessage::ExistingOpenIntents(intents) => {
                        info!("Got {} existing intents from Medusa.", intents.len());
                        self.matchmaker = Matchmaker::new();
                        for intent in intents.iter() {
                            if intent.outcome.fill_structure == FillStructure::PercentageFilled {
                                self.matchmaker.try_match(intent);
                            } else {
                                warn!(
                                    "Intent {} existed before solver started, but it is not a liquidity provision intent. This should never happen.",
                                    intent.intent_id()
                                );
                                warn!("Intent {} ignored.", intent.intent_id());
                            }
                        }
                    }
                    WsBroadcastMessage::NewIntent(intent) => {
                        info!("Received new intent {}.", intent.intent_id());
                        if self.matchmaker.contains_intent(&intent.intent_id()) {
                            info!("Intent {} already exists.", intent.intent_id());
                        } else if let Some(solution) = self.matchmaker.try_match(&intent) {
                            info!("Intent {} solved.", intent.intent_id());

                            for intent_id in solution.intent_ids.iter() {
                                info!(
                                    "Putting intent {} on hold to wait for confirmation.",
                                    intent_id
                                );
                                self.matchmaker.put_on_hold(intent_id);
                            }

                            let signed_solution = solution.sign(&self.signer).await;
                            let payload = WsPayload::ProposeSolution(signed_solution);
                            let mut send = send.lock().await;
                            let _ = send
                                .send(Message::Text(
                                    serde_json::to_string(&payload)
                                        .expect("Cannot convert signed solution to json rpc string")
                                        .into(),
                                ))
                                .await;
                            info!("Solution sent back to server.");
                            drop(send);
                        } else {
                            info!(
                                "Intent {} could not be solved with existing intents.",
                                intent.intent_id()
                            );
                        }
                    }

                    WsBroadcastMessage::IntentStatusUpdated(id, status) => match status {
                        IntentState::Open => {
                            if self.matchmaker.contains_intent(&id)
                                && self.matchmaker.check_on_hold(&id)
                            {
                                warn!(
                                    "Received message to reopen intent {}, which should never happen.",
                                    id
                                );
                                warn!("Reopen request ignored.");
                            }
                        }
                        // IntentState::Locked => {
                        //     if self.matchmaker.contains_intent(&id)
                        //         && !self.matchmaker.check_on_hold(&id)
                        //     {
                        //         eprintln!("Received message to lock intent {}.", id);
                        //         self.matchmaker.put_on_hold(&id);
                        //         eprintln!("Intent {} is locked.\n", id);
                        //     }
                        // }
                        IntentState::Expired => {
                            if self.matchmaker.contains_intent(&id) {
                                info!("Received message that intent {} expired.", id);
                                self.matchmaker.remove_intent(&id);
                                info!("Intent {} is removed from solver.", id);
                            }
                        }
                        _ => {
                            info!("Received message to close intent {}.", id);
                            self.matchmaker.remove_intent(&id);
                            info!("Intent {} is removed from solver.", id);
                        }
                    },
                    WsBroadcastMessage::IntentsSolved(intent_ids, _) => {
                        for id in intent_ids.iter() {
                            info!("Intent {} is confirmed to be solved.", id);
                            self.matchmaker.remove_intent(id);
                            info!("Intent {} is removed from solver.", id);
                        }
                    }
                    WsBroadcastMessage::RefinementNeededForIntent(intent) => {
                        let id = intent.intent_id();
                        let payload = self.matchmaker.refine_intent(&intent).map_or_else(
                            || {
                                WsPayload::IntentRefinement(
                                    id,
                                    RefinementStatus::RefinementNotFound,
                                )
                            },
                            |refined_intent| {
                                WsPayload::IntentRefinement(
                                    id,
                                    RefinementStatus::Refinement(refined_intent),
                                )
                            },
                        );

                        let mut send = send.lock().await;
                        let _ = send
                            .send(Message::Text(
                                serde_json::to_string(&payload).unwrap().into(),
                            ))
                            .await;
                        drop(send);
                    }
                    WsBroadcastMessage::SolutionRejected(solution) => {
                        let raw = solution.solution.convert_to_sol_type().abi_encode();
                        if let Ok(addr) = solution
                            .signature
                            .recover_address_from_prehash(&keccak256(raw))
                        {
                            if addr == self.signer.address() {
                                info!("The rejected solution is signed by this solver.");
                                for id in solution.solution.intent_ids {
                                    if self.matchmaker.check_on_hold(&id) {
                                        info!("Reopening intent {}.", id);
                                    } else {
                                        warn!(
                                            " Intent {} is not on hold but appeared in a solution.",
                                            id
                                        );
                                    }
                                    self.matchmaker.reopen_intent(&id);
                                }
                            }
                        }
                    }
                    _ => {}
                }
            }
        });
        let (r1, r2) = tokio::join!(receiving_handle, processing_handle);

        let send = Arc::clone(&self.send);
        info!("WS client shutting down");
        let mut send = send.lock().await;
        send.close().await?;
        info!("Connection closed.");
        match (r1, r2) {
            (Ok(()), Ok(())) => {}
            _ => return Err(anyhow!("Error running solver")),
        }
        Ok(())
    }
}

// pub struct Solver<
//     S: Stream<Item = Result<Message>> + Unpin + 'static,
//     W: Sink<Message> + Unpin + 'static,
// > {
//     // send: Arc<Mutex<W>>,
//     // read: Arc<Mutex<S>>,
//     read: S,
//     send: W,
//     matchmaker: Matchmaker,
// }

// impl<
//         S: Stream<Item = Message> + Unpin + Send + 'static,
//         W: Sink<Message> + Unpin + Send + 'static,
//     > Solver<S, W>
// {
//     pub async fn new(read: S, send: W) -> Result<Self> {
//         // let (ws_stream, _) = connect_async(url).await?;
//         // let (send, read) = ws_stream.split();
//         Ok(Solver {
//             send,
//             read,
//             // send: Arc::new(Mutex::new(send)),
//             // read: Arc::new(Mutex::new(read)),
//             matchmaker: Matchmaker::new(),
//         })
//     }

//     pub async fn run(mut self) -> Result<()> {
//         let (tx, mut rx) = mpsc::channel(64);
//         // let read = Arc::clone(&self.read);
//         let receiving_handle = tokio::spawn(async move {
//             while let Some(Message::Text(raw_message)) = self.read.next().await {
//                 // drop(read);
//                 eprintln!("listener gets {}", raw_message);
//                 let message = raw_message.replace("\\\"", "\"").replace("\\'", "'");
//                 let _ = tx.send(message).await;
//                 eprintln!("Sent to Processor\n");
//             }
//         });
//         // let send = Arc::clone(&self.send);
//         let processing_handle = tokio::spawn(async move {
//             while let Some(message) = rx.recv().await {
//                 eprintln!("processor gets {}", message);
//                 let broadcast_message: BroadcastMessage = serde_json::from_str(&message)
//                     .expect("Intent received from server is corrupted");
//                 match broadcast_message {
//                     BroadcastMessage::NewIntent(intent) => {
//                         eprintln!("Received new intent {}.", intent.intent_id());
//                         if self.matchmaker.contains_intent(&intent.intent_id()) {
//                             eprintln!("Intent {} already exists.", intent.intent_id());
//                         } else if let Some(solution) = self.matchmaker.try_match(&intent) {
//                             eprintln!("Intent {} solved.\n", intent.intent_id());
//                             let solver_signer = PrivateKeySigner::random();
//                             let solution_abi_encode = solution.convert_to_sol_type().abi_encode();
//                             if let Ok(signature) =
//                                 solver_signer.sign_message(&solution_abi_encode).await
//                             {
//                                 let signed_solution = SignedSolution {
//                                     solution,
//                                     signature,
//                                 };
//                                 let payload =
//                                     WebSocketRPCPayload::ProposedSolution(signed_solution);
//                                 // let mut send = send.lock().await;
//                                 let _ = self
//                                     .send
//                                     .send(Message::Text(
//                                         serde_json::to_string(&payload)
//                                             .expect("Cannot convert signed solution to string"),
//                                     ))
//                                     .await;
//                                 // drop(send);
//                             }
//                         } else {
//                             eprintln!(
//                                 "Intent {} could not be solved with existing intents.\n",
//                                 intent.intent_id()
//                             );
//                         }
//                     }
//                     BroadcastMessage::IntentStatusUpdated(id, status) => match status {
//                         IntentState::Open => {
//                             if self.matchmaker.contains_intent(&id)
//                                 && self.matchmaker.check_on_hold(&id)
//                             {
//                                 eprintln!("Received message to reopen intent {}.", id);
//                                 self.matchmaker.reopen_intent(&id);
//                                 eprintln!("Intent {} is reopened.\n", id);
//                             }
//                         }
//                         IntentState::Locked => {
//                             if self.matchmaker.contains_intent(&id)
//                                 && !self.matchmaker.check_on_hold(&id)
//                             {
//                                 eprintln!("Received message to lock intent {}.", id);
//                                 self.matchmaker.put_on_hold(&id);
//                                 eprintln!("Intent {} is locked.\n", id);
//                             }
//                         }
//                         _ => {
//                             eprintln!("Received message to close intent {}.", id);
//                             self.matchmaker.remove_intent(&id);
//                             eprintln!("Intent {} is removed from solver.\n", id);
//                         }
//                     },
//                     BroadcastMessage::IntentsSolved(intent_ids, _) => {
//                         for id in intent_ids.iter() {
//                             eprintln!("Intent {} is confirmed to be solved.", id);
//                             self.matchmaker.remove_intent(id);
//                             eprintln!("Intent {} is removed from solver.\n", id);
//                         }
//                     }
//                     _ => {}
//                 }
//             }
//         });
//         let (r1, r2) = tokio::join!(receiving_handle, processing_handle);
//         match (r1, r2) {
//             (Ok(()), Ok(())) => {}
//             _ => return Err(anyhow!("Error running solver")),
//         }
//         Ok(())
//     }
// }

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use std::collections::VecDeque;
//     use std::pin::Pin;
//     use std::task::{Context, Poll};

//     #[derive(std::clone::Clone)]
//     struct MockWebSocketStream {
//         pub incoming_messages: VecDeque<String>,
//         pub outgoing_messages: Vec<Message>,
//     }

//     impl MockWebSocketStream {
//         fn new() -> Self {
//             Self {
//                 incoming_messages: VecDeque::new(),
//                 outgoing_messages: Vec::new(),
//             }
//         }

//         fn push_message(&mut self, message: String) {
//             self.incoming_messages.push_back(message);
//         }

//         fn get_sent_messages(&self) -> &[Message] {
//             &self.outgoing_messages
//         }
//     }

//     impl Stream for MockWebSocketStream {
//         type Item = Message;

//         fn poll_next(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
//             if let Some(content) = self.incoming_messages.pop_front() {
//                 Poll::Ready(Some(Message::Text(content)))
//             } else {
//                 Poll::Pending
//             }
//         }
//     }

//     impl Sink<Message> for MockWebSocketStream {
//         type Error = ();

//         fn poll_ready(
//             self: Pin<&mut Self>,
//             _cx: &mut Context<'_>,
//         ) -> Poll<Result<(), Self::Error>> {
//             Poll::Ready(Ok(()))
//         }

//         fn start_send(self: Pin<&mut Self>, item: Message) -> Result<(), Self::Error> {
//             self.get_mut().outgoing_messages.push(item);
//             Ok(())
//         }

//         fn poll_flush(
//             self: Pin<&mut Self>,
//             _cx: &mut Context<'_>,
//         ) -> Poll<Result<(), Self::Error>> {
//             Poll::Ready(Ok(()))
//         }

//         fn poll_close(
//             self: Pin<&mut Self>,
//             _cx: &mut Context<'_>,
//         ) -> Poll<Result<(), Self::Error>> {
//             Poll::Ready(Ok(()))
//         }
//     }
//     #[tokio::test]
//     async fn test_solver() {
//         let mut mock_stream = Box::pin(MockWebSocketStream::new());
//         // let msg = mock_stream.get_sent_messages();
//         mock_stream.push_message(String::from(r#"{"NewIntent": {"author": "0x0000000000000000000000000000000000000001", "ttl": "0x2", "nonce": "0x2", "srcMToken": "0x0000000000000000000000000000000000000001", "srcAmount": "0x10", "outcome": {"mTokens": ["0x0000000000000000000000000000000000000002"], "mAmounts": ["0x5"], "outcomeAssetStructure": "AnySingle", "fillStructure": "Exact"}}}"#));
//         mock_stream.push_message(String::from(r#"{"NewIntent": {"author": "0x0000000000000000000000000000000000000002", "ttl": "0x2", "nonce": "0x1", "srcMToken": "0x0000000000000000000000000000000000000002", "srcAmount": "0x10", "outcome": {"mTokens": ["0x0000000000000000000000000000000000000003"], "mAmounts": ["0x5"], "outcomeAssetStructure": "AnySingle", "fillStructure": "Minimum"}}}"#));
//         mock_stream.push_message(String::from(r#"{"NewIntent": {"author": "0x0000000000000000000000000000000000000003", "ttl": "0x2", "nonce": "0x1", "srcMToken": "0x0000000000000000000000000000000000000003", "srcAmount": "0x6", "outcome": {"mTokens": ["0x0000000000000000000000000000000000000001"], "mAmounts": ["0xaa"], "outcomeAssetStructure": "AnySingle", "fillStructure": "PercentageFilled"}}}"#));

//         let write_stream = mock_stream.clone();
//         unsafe {
//             let stream_ref = &static write_stream;
//             let solver = Solver::new(mock_stream, write_stream).await.unwrap();

//             let run_handle = tokio::spawn(async move { solver.run().await.unwrap() });
//             let check_handle = tokio::spawn(async move {
//                 println!("{:#?}", stream_ref.get_sent_messages());
//             });
//             let _ = tokio::join!(run_handle, check_handle);
//         }
//         // let read_stream = Arc::new(Mutex::new(mock_stream));
//         // let write_stream = Arc::new(Mutex::new(write_stream));
//         // let stream_clone_1 = Arc::clone(&read_stream);
//         // let stream_clone_2 = Arc::clone(&write_stream);
//     }
// }
