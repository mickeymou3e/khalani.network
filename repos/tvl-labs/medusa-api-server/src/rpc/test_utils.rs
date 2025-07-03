use super::*;
use crate::chain::ChainServiceTrait;
use alloy::primitives::Parity;
use alloy::signers::local::PrivateKeySigner;
use alloy::signers::Signature;
use alloy::signers::Signer;
use alloy::{network::EthereumWallet, providers::ProviderBuilder, signers::local::LocalSigner};
use medusa_types::{
    receipt::Receipt, FillRecord, Intent, IntentId, MoveRecord, OutType, OutputIdx, SignedIntent,
    SignedSolution, Solution,
};
use mockall::predicate::*;
use mockall::*;
use std::str::FromStr;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::sync::broadcast::Sender;

mock! {
    pub ChainService<P> {}

    #[async_trait::async_trait]
    impl<P: Provider<Http<Client>> + 'static + WalletProvider> ChainServiceTrait for ChainService<P> {
        async fn post_solution(&self, solution: &SignedSolution) -> anyhow::Result<(B256, u64)>;
        async fn redeem_receipt(&self, receipt_id: &B256) -> anyhow::Result<B256>;
        async fn withdraw_mtokens(&self, owner: Address, m_token: Address, amount: U256) -> anyhow::Result<B256>;
        async fn withdraw_mtokens_from_intent_receipt(&self, intent_id: IntentId, owner: Address, m_token: Address, amount: U256, store: Arc<StorageService>) -> anyhow::Result<B256>;
        async fn cancel_intent(&self, intent_id: &B256) -> anyhow::Result<B256>;
        async fn withdraw_intent(&self, intent_id: &B256, author: Address, mtoken: Address, amount: U256, store: Arc<StorageService>) -> anyhow::Result<B256>;
        async fn get_nonce(&self, user: Address) -> anyhow::Result<U256>;
        async fn post_intent(&self, intent: &SignedIntent) -> anyhow::Result<B256>;
    }
}

pub fn get_test_services<P>(_dummy: P) -> (Arc<MockChainService<P>>, Arc<StorageService>) {
    let mock_chain_service = MockChainService::new();
    let tmp_dir = tempfile::tempdir().unwrap();
    let tmp_expiration_tx = Sender::new(100);
    let test_storage_service =
        StorageService::new(tmp_dir.path(), false, tmp_expiration_tx.clone());
    (Arc::new(mock_chain_service), Arc::new(test_storage_service))
}

pub fn dummy_provider() -> impl Provider<Http<Client>> + WalletProvider {
    ProviderBuilder::new()
        .with_recommended_fillers()
        .wallet(EthereumWallet::new(LocalSigner::random()))
        .on_http("http://0.0.0.0".parse().unwrap())
}

// pub fn get_test_services() -> (Arc<impl ChainServiceTrait>, Arc<StorageService>) {
//     let dummy_provider = ProviderBuilder::new()
//         .with_recommended_fillers()
//         .wallet(EthereumWallet::new(LocalSigner::random()))
//         .on_http("http://0.0.0.0".parse().unwrap());
//     get_test_services_helper(dummy_provider)
// }

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
    Signature::from_bytes_and_parity(&[0u8; 65], Parity::Parity(true)).unwrap()
}

pub fn create_dummy_signed_intent(ttl: u64) -> SignedIntent {
    SignedIntent {
        intent: create_dummy_intent(ttl),
        signature: create_dummy_signature(),
    }
}

pub async fn create_mock_signed_intent(ttl: u64, key: String) -> SignedIntent {
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
    let sig = signer.sign_hash(&intent_id).await.unwrap();
    SignedIntent {
        intent,
        signature: sig,
    }
}

pub fn mock_solution_for_intent(intent_id: IntentId, owner: Address) -> Solution {
    Solution {
        intent_ids: vec![intent_id],
        receipt_outputs: vec![Receipt {
            m_token: Address::from_slice(&[2u8; 20]),
            m_token_amount: U256::from(100),
            owner,
            intent_hash: intent_id,
        }],
        intent_outputs: vec![create_dummy_intent(current_timestamp() + 1000)],
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
