use std::str::FromStr;
use std::sync::Arc;
use std::time::{SystemTime, UNIX_EPOCH};

use alloy::network::EthereumWallet;
use alloy::providers::{Provider, ProviderBuilder, WalletProvider};
use alloy::signers::local::{LocalSigner, PrivateKeySigner};
use alloy::signers::{Signature, SignerSync};
use async_trait::async_trait;
use medusa_tx_worker::ChainServiceTrait;
use medusa_types::{
    Address, B256, FillRecord, Intent, IntentId, MoveRecord, OutType, OutputIdx, Receipt,
    SignedIntent, SignedSolution, Solution, U256,
};
use mockall::predicate::*;
use mockall::*;
use serde::Serialize;

use crate::payload_types::SignedPayload;

mock! {
    pub ChainService<P> {}

    #[async_trait]
    impl<P: Provider + 'static + WalletProvider> ChainServiceTrait for ChainService<P> {
        async fn get_chain_id(&self) -> u64;
        async fn post_solution(&self, solution: &SignedSolution) -> anyhow::Result<(B256, u64)>;
        async fn redeem_receipt(&self, receipt_id: &B256) -> anyhow::Result<B256>;
        async fn withdraw_mtokens(&self, owner: Address, m_token: Address, amount: U256) -> anyhow::Result<B256>;
        async fn cancel_intent(&self, intent_id: &B256) -> anyhow::Result<B256>;
        async fn get_nonce(&self, user: Address) -> anyhow::Result<U256>;
        async fn post_intent(&self, intent: &SignedIntent) -> anyhow::Result<B256>;
        async fn get_receipt_nonce(&self) -> anyhow::Result<U256>;
    }
}

pub fn mock_chain_service<P>(_dummy: P) -> Arc<MockChainService<P>> {
    let mock_chain_service = MockChainService::new();
    Arc::new(mock_chain_service)
}

pub fn dummy_provider() -> impl Provider + WalletProvider {
    ProviderBuilder::default()
        .with_recommended_fillers()
        .wallet(EthereumWallet::new(LocalSigner::random()))
        .connect_http("http://0.0.0.0".parse().unwrap())
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

pub fn create_dummy_signed_intent(ttl: u64) -> SignedIntent {
    SignedIntent {
        intent: create_dummy_intent(ttl),
        signature: create_dummy_signature(),
    }
}

pub fn create_mock_signed_intent(ttl: u64, key: String) -> SignedIntent {
    let signer = PrivateKeySigner::from_str(&key).unwrap();
    let address = signer.address();
    let intent = Intent::simple_swap(
        address,
        U256::from(ttl),
        None,
        Address::from_slice(&[1u8; 20]),
        U256::from(100),
        Address::from_slice(&[2u8; 20]),
        U256::from(100),
    );
    let intent_id = intent.intent_id();
    let sig = signer.sign_hash_sync(&intent_id).unwrap();
    SignedIntent {
        intent,
        signature: sig,
    }
}

pub fn mock_solution_for_intent(intent_id: IntentId, owner: Address, output_ttl: u64) -> Solution {
    Solution {
        intent_ids: vec![intent_id],
        receipt_outputs: vec![Receipt {
            m_token: Address::from_slice(&[2u8; 20]),
            m_token_amount: U256::from(100),
            owner,
            intent_hash: intent_id,
        }],
        intent_outputs: vec![create_dummy_intent(output_ttl)],
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
    }
}

pub fn current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}

pub fn sign_payload<T>(payload: T, signer: PrivateKeySigner) -> SignedPayload<T>
where
    T: Serialize,
{
    let signature = signer
        .sign_message_sync(bcs::to_bytes(&payload).unwrap().as_slice())
        .unwrap();
    SignedPayload { payload, signature }
}
