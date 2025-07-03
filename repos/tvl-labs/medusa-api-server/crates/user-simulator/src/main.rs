mod user;

use alloy::{
    primitives::{Address, B256, U256},
    signers::{local::PrivateKeySigner, Signer},
};

use alloy::primitives::keccak256;
use alloy_sol_types::SolValue;

use dotenv::dotenv;
use medusa_service::config::MedusaConfig;
use medusa_types::*;
use std::time::{SystemTime, UNIX_EPOCH};
use std::{env, fs, path::Path};
use std::{str::FromStr, sync::OnceLock};
use tracing::{info, warn};
use user::{RpcIntentState, User};
// sol! {
//     interface IIntentBook {
//         function getNonce() external view returns (uint256);
//     }
// }

fn timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}

fn swap_intent(
    author: Address,
    src_mtoken: Address,
    src_amt: U256,
    ttl: U256,
    target_tokens: Vec<Address>,
    target_amts: Vec<U256>,
    nonce: U256,
) -> Intent {
    Intent {
        src_m_token: src_mtoken,
        src_amount: src_amt,
        author,
        ttl,
        nonce,
        outcome: Outcome {
            m_tokens: target_tokens,
            m_amounts: target_amts,
            outcome_asset_structure: OutcomeAssetStructure::AnySingle,
            fill_structure: FillStructure::Exact,
        },
    }
}

fn lp_intent(
    author: Address,
    src_mtoken: Address,
    src_amt: U256,
    ttl: U256,
    target_tokens: Vec<Address>,
    target_amts: Vec<U256>,
    nonce: U256,
) -> Intent {
    Intent {
        src_m_token: src_mtoken,
        src_amount: src_amt,
        author,
        ttl,
        nonce,
        outcome: Outcome {
            m_tokens: target_tokens,
            m_amounts: target_amts,
            outcome_asset_structure: OutcomeAssetStructure::AnySingle,
            fill_structure: FillStructure::PercentageFilled,
        },
    }
}

use std::sync::atomic::{AtomicUsize, Ordering};

static COUNTER: OnceLock<AtomicUsize> = OnceLock::new();

fn increment_counter() -> usize {
    COUNTER
        .get_or_init(|| AtomicUsize::new(0))
        .fetch_add(1, Ordering::SeqCst)
}

async fn test_intent_expiration(busy: bool) {
    let counter = increment_counter();
    // let span = tracing::span!(
    //     tracing::Level::INFO,
    //     "test intent expiration",
    //     counter = counter
    // );
    // let _guard = span.enter();
    info!("test intent expiration started (counter: {})", counter);
    let user1_key = "0xa55c2ba5cc92992e8182785736c248c4ede794c9da788877bdce5502582426f6";
    let user1_signer: PrivateKeySigner = user1_key.parse().unwrap();
    let user1_address = user1_signer.address();
    info!("user1 address: {}, counter: {}", user1_address, counter);

    let path_to_config = env::args()
        .nth(1)
        .expect("Please provide path to config file");
    let config_path = Path::new(&path_to_config);
    let config: MedusaConfig = toml::from_str(
        fs::read_to_string(config_path)
            .expect("Error reading config file")
            .as_str(),
    )
    .expect("Error parsing config file");
    let mtokens = config.m_tokens;
    let mtoken0 = mtokens.get("avax_USDC").cloned().unwrap();
    let mtoken1 = mtokens.get("holesky_USDC").cloned().unwrap();

    let address = config.medusa_rpc_url;
    let client = User::new(address).await;
    let intent_book = config.intent_book_address;

    let lp1 = lp_intent(
        user1_address,
        mtoken0,
        U256::from(1_000000000000000000_u128),
        U256::from(timestamp() + 5), // live 5 seconds
        vec![mtoken1],
        vec![U256::from(1_000000000000000000_u128)],
        client.get_new_nonce(user1_address).await.unwrap(),
    );

    let signed_intent = lp1.sign(user1_signer.clone(), intent_book).await;
    client
        .publish_intent(&signed_intent)
        .await
        .expect("publish liquidity intent failed");

    if !busy {
        tokio::time::sleep(tokio::time::Duration::from_secs(300)).await;
        let (history, intent) = client.get_intent_history(lp1.intent_id()).await.unwrap();
        info!("intent history: {:#?}, counter: {}", history, counter);
        info!("intent: {:#?}, counter: {}", intent, counter);
    } else {
        loop {
            let (history, intent) = client.get_intent_history(lp1.intent_id()).await.unwrap();
            if history.withdraw_timestamp.is_none() {
                tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
            } else {
                info!(
                    "Intent {} is withdrawn, counter: {}",
                    lp1.intent_id(),
                    counter
                );
                info!("intent history: {:#?}, counter: {}", history, counter);
                info!("intent: {:#?}, counter: {}", intent, counter);
                break;
            }
        }
    }
}

async fn test_intent_cancellation() {
    let counter = increment_counter();
    // let span = tracing::span!(
    //     tracing::Level::INFO,
    //     "test intent cancellation",
    //     counter = counter
    // );
    // let _guard = span.enter();
    info!("test intent cancellation started (counter: {})", counter);
    let user1_key = "0xa55c2ba5cc92992e8182785736c248c4ede794c9da788877bdce5502582426f6";
    let user1_signer: PrivateKeySigner = user1_key.parse().unwrap();
    let user1_address = user1_signer.address();
    info!("user1 address: {}, counter: {}", user1_address, counter);

    // let user2_key = "0x5807eb9e7480428e7bac3eccfa463d5e9b59f6070b64d7d539494c8ef791e804";
    // let user2_signer: PrivateKeySigner = user2_key.parse().unwrap();
    // let user2_address = user2_signer.address();

    let path_to_config = env::args()
        .nth(1)
        .expect("Please provide path to config file");
    let config_path = Path::new(&path_to_config);
    let config: MedusaConfig = toml::from_str(
        fs::read_to_string(config_path)
            .expect("Error reading config file")
            .as_str(),
    )
    .expect("Error parsing config file");
    let mtokens = config.m_tokens;
    let mtoken0 = mtokens.get("avax_USDC").cloned().unwrap();
    let mtoken1 = mtokens.get("holesky_USDC").cloned().unwrap();

    let address = config.medusa_rpc_url;
    let client = User::new(address).await;
    let intent_book = config.intent_book_address;

    let lp2 = lp_intent(
        user1_address,
        mtoken0,
        U256::from(1_000000000000000000_u128),
        U256::from(timestamp() + 31536000), // live 1 year
        vec![mtoken1],
        vec![U256::from(1_000000000000000000_u128)],
        client.get_new_nonce(user1_address).await.unwrap(),
    );
    let signed_intent = lp2.sign(user1_signer.clone(), intent_book).await;
    client
        .publish_intent(&signed_intent)
        .await
        .expect("publish liquidity intent failed");

    let signed_intent_id = SignedIntentId {
        intent_id: lp2.intent_id(),
        signature: user1_signer
            .sign_message(lp2.intent_id().as_slice())
            .await
            .unwrap(),
    };
    client.cancel_intent(&signed_intent_id).await.unwrap();
    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;

    let lp3 = lp_intent(
        user1_address,
        mtoken0,
        U256::from(1_000000000000000000_u128),
        U256::from(timestamp() + 31536000), // live 1 year
        vec![mtoken1],
        vec![U256::from(1_000000000000000000_u128)],
        client.get_new_nonce(user1_address).await.unwrap(),
    );
    let signed_intent = lp3.sign(user1_signer.clone(), intent_book).await;
    client
        .publish_intent(&signed_intent)
        .await
        .expect("publish liquidity intent failed");

    let signed_intent_id = SignedIntentId {
        intent_id: lp3.intent_id(),
        signature: user1_signer
            .sign_message(lp3.intent_id().as_slice())
            .await
            .unwrap(),
    };
    client.cancel_intent(&signed_intent_id).await.unwrap();

    tokio::time::sleep(tokio::time::Duration::from_secs(500)).await;

    let (history, intent) = client.get_intent_history(lp2.intent_id()).await.unwrap();

    info!("lp2 history: {:#?}, counter: {}", history, counter);
    info!("lp2 intent: {:#?}, counter: {}", intent, counter);
    let (history, intent) = client.get_intent_history(lp3.intent_id()).await.unwrap();

    info!("lp3 history: {:#?}, counter: {}", history, counter);
    info!("lp3 intent: {:#?}, counter: {}", intent, counter);
}

async fn test_intent_solve() {
    let counter = increment_counter();
    // let span = tracing::span!(tracing::Level::INFO, "test intent solve", counter = counter);
    // let _guard = span.enter();
    info!("test intent solve started (counter: {})", counter);
    let user1_key = "0xa55c2ba5cc92992e8182785736c248c4ede794c9da788877bdce5502582426f6";
    let user1_signer: PrivateKeySigner = user1_key.parse().unwrap();
    let user1_address = user1_signer.address();
    info!("user1 address: {}, counter: {}", user1_address, counter);

    // let user2_key = "0x5807eb9e7480428e7bac3eccfa463d5e9b59f6070b64d7d539494c8ef791e804";
    // let user2_signer: PrivateKeySigner = user2_key.parse().unwrap();
    // let user2_address = user2_signer.address();

    let path_to_config = env::args()
        .nth(1)
        .expect("Please provide path to config file");
    let config_path = Path::new(&path_to_config);
    let config: MedusaConfig = toml::from_str(
        fs::read_to_string(config_path)
            .expect("Error reading config file")
            .as_str(),
    )
    .expect("Error parsing config file");
    let mtokens = config.m_tokens;
    let mtoken0 = mtokens.get("avax_USDC").cloned().unwrap();
    let mtoken1 = mtokens.get("holesky_USDC").cloned().unwrap();

    let address = config.medusa_rpc_url;
    let client = User::new(address).await;
    let intent_book = config.intent_book_address;

    let lp = lp_intent(
        user1_address,
        mtoken0,
        U256::from(1_000000000000000000_u128),
        U256::from(timestamp() + 31536000), // live 1 year
        vec![mtoken1],
        vec![U256::from(1_000000000000000000_u128)],
        client.get_new_nonce(user1_address).await.unwrap(),
    );

    let signed_intent = lp.sign(user1_signer.clone(), intent_book).await;
    client.publish_intent(&signed_intent).await.unwrap();

    let bridge_intent = swap_intent(
        user1_address,
        mtoken1,
        U256::from(1_000000000000000000_u128),
        U256::from(timestamp() + 31536000), // live 1 year
        vec![mtoken0],
        vec![U256::from(1_000000000000000000_u128)],
        client.get_new_nonce(user1_address).await.unwrap(),
    );

    let intent_id = bridge_intent.intent_id();
    client.request_refinement(&bridge_intent).await.unwrap();

    loop {
        let refinement = client.get_refinement_status(intent_id).await.unwrap();
        match refinement {
            Some(refinement) => match refinement {
                RefinementStatus::Refinement(intent) => {
                    info!("refinement: {:#?}, counter: {}", intent, counter);
                    let signed_intent = intent.sign(user1_signer.clone(), intent_book).await;
                    client.publish_intent(&signed_intent).await.unwrap();
                    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
                    let intent_id = intent.intent_id();
                    loop {
                        let solution = client.get_solution_for_intent(intent_id).await.unwrap();
                        if let Some(solution) = solution {
                            info!("solution: {:#?}, counter: {}", solution, counter);
                            break;
                        }
                    }
                    tokio::time::sleep(tokio::time::Duration::from_secs(200)).await;
                    let (history, intent) = client.get_intent_history(intent_id).await.unwrap();
                    info!(
                        "bridge intent history: {:#?}, counter: {}",
                        history, counter
                    );
                    info!("bridge intent: {:#?}, counter: {}", intent, counter);
                    break;
                }
                RefinementStatus::RefinementNotFound => {
                    info!("refinement not found, counter: {}", counter);
                    break;
                }
            },
            None => {
                info!("refinement in progress, counter: {}", counter);
            }
        }
        tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
    }
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    tracing_subscriber::fmt().init();

    let handle1 = tokio::spawn(async move {
        test_intent_solve().await;
    });

    let handle2 = tokio::spawn(async move {
        tokio::time::sleep(tokio::time::Duration::from_secs(15)).await;
        test_intent_expiration(false).await;
    });

    let handle3 = tokio::spawn(async move {
        tokio::time::sleep(tokio::time::Duration::from_secs(30)).await;
        test_intent_cancellation().await;
    });

    let (ret1, ret2, ret3) = tokio::join!(handle1, handle2, handle3);
    info!("ret1: {:?}", ret1);
    info!("ret2: {:?}", ret2);
    info!("ret3: {:?}", ret3);
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
// ================================================
// let lp2 = lp_intent(
//     user1_address,
//     mtoken0,
//     U256::from(10_000000000000000000_u128),
//     U256::from(timestamp() + 31536000), // live 1 year
//     vec![mtoken1],
//     vec![U256::from(10_000000000000000000_u128)],
//     client.get_new_nonce(user1_address).await.unwrap(),
// );

// let signed_intent = lp2.sign(user1_signer.clone(), intent_book).await;
// client
//     .publish_intent(&signed_intent)
//     .await
//     .expect("publish liquidity intent failed");
// tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
// let lp3 = lp_intent(
//     user1_address,
//     mtoken0,
//     U256::from(10_000000000000000000_u128),
//     U256::from(timestamp() + 31536000), // live 1 year
//     vec![mtoken1],
//     vec![U256::from(10_000000000000000000_u128)],
//     client.get_new_nonce(user1_address).await.unwrap(),
// );
// let signed_intent = lp3.sign(user1_signer.clone(), intent_book).await;
// client
//     .publish_intent(&signed_intent)
//     .await
//     .expect("publish liquidity intent failed");
// tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
// loop {
//     let state = client.check_intent_status(lp1.intent_id()).await.unwrap();
//     if state == RpcIntentState::Expired {
//         info!("Intent {} confirm expired.", lp1.intent_id());
//         break;
//     }
//     tokio::time::sleep(std::time::Duration::from_secs(3)).await;
// }

// test intent cancellation
// let lp1 = lp_intent(
//     user1_address,
//     mtoken0,
//     U256::from(20_000000000000000000_u128),
//     U256::from(timestamp() + 300), // live 5 minutes
//     vec![mtoken1],
//     vec![U256::from(10_000000000000000000_u128)],
//     client.get_new_nonce(user1_address).await.unwrap(),
// );

// let signed_intent = lp1.sign(user1_signer.clone(), intent_book).await;
// client
//     .publish_intent(&signed_intent)
//     .await
//     .expect("publish liquidity intent failed");

// let intent_id = lp1.intent_id();
// let signed_intent_id = SignedIntentId {
//     intent_id,
//     signature: user1_signer
//         .sign_message(intent_id.as_slice())
//         .await
//         .unwrap(),
// };
// client.cancel_intent(&signed_intent_id).await.unwrap();
// let intent_id = lp2.intent_id();
// let signed_intent_id = SignedIntentId {
//     intent_id,
//     signature: user1_signer
//         .sign_message(intent_id.as_slice())
//         .await
//         .unwrap(),
// };
// client.cancel_intent(&signed_intent_id).await.unwrap();
// let intent_id = lp3.intent_id();
// let signed_intent_id = SignedIntentId {
//     intent_id,
//     signature: user1_signer
//         .sign_message(intent_id.as_slice())
//         .await
//         .unwrap(),
// };
// client.cancel_intent(&signed_intent_id).await.unwrap();

// let (history, intent) = client.get_intent_history(lp2.intent_id()).await.unwrap();
// info!("lp2 history: {:#?}", history);
// info!("lp2 intent: {:#?}", intent);
// let (history, intent) = client.get_intent_history(lp3.intent_id()).await.unwrap();
// info!("lp3 history: {:#?}", history);
// info!("lp3 intent: {:#?}", intent);

// let signed_intent_id = SignedIntentId {
//     intent_id,
//     signature: user1_signer
//         .sign_message(intent_id.as_slice())
//         .await
//         .unwrap(),
// };
// client.cancel_intent(&signed_intent_id).await.unwrap();
// tokio::time::sleep(tokio::time::Duration::from_secs(500)).await;
// let state = client.check_intent_status(intent_id).await.unwrap();
// assert_eq!(state, RpcIntentState::Cancelled);

// let intent2 = simple_intent(
//     user_address,
//     mtoken1,
//     U256::from(10_000000000000000000_u128),
//     vec![mtoken0],
//     vec![U256::from(100_000000000000000000_u128)],
//     OutcomeAssetStructure::AnySingle,
//     FillStructure::Exact,
//     nonce,
// );

// user.request_refinement(&intent2)
//     .await
//     .expect("refinement request failed");
// loop {
//     let refinement = user
//         .get_refinement_status(intent2.intent_id())
//         .await
//         .unwrap();
//     match refinement {
//         None => {
//             info!("refinement in progress");
//             tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
//         }
//         Some(refinement) => {
//             match refinement {
//                 RefinementStatus::RefinementNotFound => {
//                     info!("Intent cannot be filled at this moment.")
//                 }
//                 RefinementStatus::Refinement(intent) => {
//                     info!("Should change intent into this: {:#?}", intent);
//                     let signed_intent = intent.sign(signer.clone(), intent_book).await;
//                     user.publish_intent(&signed_intent)
//                         .await
//                         .expect("publish intent failed");
//                     tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
//                     loop {
//                         if let Some(solution) = user
//                             .get_solution_for_intent(intent.intent_id())
//                             .await
//                             .expect("error getting solution")
//                         {
//                             info!("Solution found: {:#?}", solution.solution);
//                             break;
//                         }
//                     }
//                 }
//             };
//             break;
//         }
//     }
// }

// let intent3 = simple_intent(
//     user_address,
//     mtoken2,
//     U256::from(20_000000000000000000_u128),
//     vec![mtoken0],
//     vec![U256::from(100_000000000000000000_u128)],
//     OutcomeAssetStructure::AnySingle,
//     FillStructure::Exact,
//     U256::from(4),
// );
// user.request_refinement(&intent3)
//     .await
//     .expect("refinement request failed");

// loop {
//     let refinement = user
//         .get_refinement_status(intent3.intent_id())
//         .await
//         .unwrap();
//     match refinement {
//         None => {
//             info!("refinement in progress");
//             tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
//         }
//         Some(refinement) => {
//             match refinement {
//                 RefinementStatus::RefinementNotFound => {
//                     info!("Intent cannot be filled at this moment.")
//                 }
//                 RefinementStatus::Refinement(intent) => {
//                     info!("Should change intent into this: {:#?}", intent);
//                     let signed_intent = intent.sign(signer.clone(), intent_book).await;
//                     user.publish_intent(&signed_intent)
//                         .await
//                         .expect("publish intent failed");
//                     tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
//                     loop {
//                         if let Some(solution) = user
//                             .get_solution_for_intent(intent.intent_id())
//                             .await
//                             .expect("error getting solution")
//                         {
//                             info!("Solution found: {:#?}", solution.solution);
//                             break;
//                         }
//                     }
//                 }
//             };
//             break;
//         }
//     }
// }
