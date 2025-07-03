#[allow(dead_code, unused)]
mod intent_book;

use crate::chain::intent_book::{PublishIntentCall, SignedIntent as EthersSignedIntent, SolveCall};
use crate::config::LightContract;
use crate::config::{
    get_hub_publisher_address, get_spoke_asset_reserve_addresses, get_spoke_chains,
};
use crate::storage::StorageService;
use alloy::contract::{ContractInstance, Interface};
use alloy::dyn_abi::DynSolValue;
use alloy::dyn_abi::Word;
use alloy::eips::BlockNumberOrTag;
use alloy::json_abi::AbiItem;
use alloy::network::{NetworkWallet, TransactionBuilder};
use alloy::primitives::Address;
use alloy::primitives::{B256, U256};
use alloy::providers::{Provider, ProviderBuilder, WalletProvider};
use alloy::rpc::types::{Filter, TransactionReceipt};
use alloy::transports::http::{Client, Http};
use anyhow::{anyhow, Result};
use ethers::abi::AbiEncode;
use medusa_types::SignedSolution;
use medusa_types::{conversion::RpcToSol, sol_types, IntentErrorType, IntentId, SignedIntent};
use rustc_hash::FxHashMap as HashMap;
use std::sync::Arc;
use tracing::{debug, error, info, warn};

#[derive(Debug)]
pub struct TransactionError {
    pub tx_hash: B256,
    pub message: String,
}

impl TransactionError {
    pub fn new(tx_hash: B256, message: impl Into<String>) -> Self {
        Self {
            tx_hash,
            message: message.into(),
        }
    }
}

impl std::error::Error for TransactionError {}

impl std::default::Default for TransactionError {
    fn default() -> Self {
        Self {
            tx_hash: B256::ZERO,
            message: "unspecified error".to_string(),
        }
    }
}

impl std::fmt::Display for TransactionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "Transaction {} failed with error: {}",
            self.tx_hash, self.message
        )
    }
}

const PUBLISH_INTENT: &str = "publishIntent";
const CANCEL_INTENT: &str = "cancelIntent";
const GET_NONCE: &str = "getNonce";
const SOLVE: &str = "solve";
const REDEEM: &str = "redeem";
const WITHDRAWAL: &str = "withdrawMToken";
const WITHDRAW_INTENT: &str = "withdrawIntentBalance";

async fn check_spoke_status(
    provider: &dyn Provider<Http<Client>>,
    event_hash: B256,
    reserve_address: Address,
    from_block: u64,
    to_block: u64,
) -> Result<bool> {
    info!(
        "checking spoke chain logs from block {} to block {} for event hash {:?}",
        from_block, to_block, event_hash
    );

    let filter = Filter::new()
        .from_block(BlockNumberOrTag::Number(from_block))
        .to_block(BlockNumberOrTag::Latest)
        .address(reserve_address)
        .topic1(event_hash);

    let logs = tokio::time::timeout(
        std::time::Duration::from_secs(3),
        provider.get_logs(&filter),
    )
    .await
    .ok();
    if let Some(Ok(logs)) = logs {
        info!("found {} logs", logs.len());
        Ok(logs.len() > 0)
    } else {
        warn!("Timeout reached while fetching filtered logs");
        Ok(false)
    }
}

async fn check_withdrawal_result(
    receipt: &TransactionReceipt,
    store_handle: Option<(Arc<StorageService>, IntentId)>,
) -> Result<bool> {
    info!("checking withdrawal result on spoke chain");
    for log in receipt.inner.logs().iter() {
        debug!("transactionreceipt log: {:?}", log);
        if log.address() == get_hub_publisher_address() {
            let signature = alloy::primitives::keccak256("EventPublished(bytes32,uint32)");
            let event_topic = B256::from_slice(signature.as_slice());
            info!(
                "listening to event topic: {:?} (EventPublished(bytes32,uint32))",
                event_topic
            );
            if log.topics()[0] == event_topic {
                info!("captured EventPublished event");
                info!("log data: {:#?}", log);
                let event_hash = log.topics()[1];
                let chain_id = U256::from_be_slice(&log.data().data.0);
                info!(
                    "Event published: hash={:?}, chain_id={}",
                    event_hash, chain_id
                );
                let spoke_chains = get_spoke_chains();
                let spoke_asset_reserve_addresses = get_spoke_asset_reserve_addresses();
                let url = spoke_chains[&chain_id].clone();
                info!("spoke chain url: {}", url);
                let reserve_address = spoke_asset_reserve_addresses[&chain_id].clone();
                info!("spoke chain reserve address: {}", reserve_address);
                let start = tokio::time::Instant::now();
                let timeout = tokio::time::Duration::from_secs(300);

                let provider = ProviderBuilder::new()
                    .with_recommended_fillers()
                    .on_http(url.parse()?);

                let current_block = provider.get_block_number().await?;
                let mut start_block = current_block - 1000;
                while start.elapsed() < timeout {
                    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
                    info!("Checking spoke chain event at url: {}", url);
                    let current_block = provider.get_block_number().await?;
                    let result = check_spoke_status(
                        &provider,
                        event_hash,
                        reserve_address,
                        start_block,
                        current_block,
                    )
                    .await?;
                    start_block = current_block - 10;
                    info!("check_spoke_status returned: {:?}", result);
                    if result {
                        info!("confirmed that withdrawal reached spoke chain");
                        if let Some((store, intent_id)) = store_handle {
                            store
                                .update_history_after_withdrawal_reach_spoke(&intent_id)
                                .await?;
                        }
                        return Ok(true);
                    }
                    tokio::task::yield_now().await;
                }
            }
        }
    }
    info!("spoke chain withdrawal event not confirmed before timeout");
    if let Some((store, intent_id)) = store_handle {
        store
            .record_existing_intent_failure(
                &intent_id,
                IntentErrorType::WithdrawToSpoke,
                B256::ZERO,
            )
            .await?;
    }
    Ok(false)
}

#[async_trait::async_trait]
pub trait ChainServiceTrait: Send + Sync + 'static {
    async fn post_intent(&self, intent: &SignedIntent) -> Result<B256>;
    async fn cancel_intent(&self, intent_id: &IntentId) -> Result<B256>;
    async fn withdraw_intent(
        &self,
        intent_id: &IntentId,
        author: Address,
        mtoken: Address,
        amount: U256,
        store: Arc<StorageService>,
    ) -> Result<B256>;
    async fn post_solution(&self, solution: &SignedSolution) -> Result<(B256, u64)>;
    async fn redeem_receipt(&self, receipt_id: &B256) -> Result<B256>;
    async fn withdraw_mtokens_from_intent_receipt(
        &self,
        intent_id: IntentId,
        owner: Address,
        m_token: Address,
        amount: U256,
        store: Arc<StorageService>,
    ) -> Result<B256>;
    async fn withdraw_mtokens(
        &self,
        owner: Address,
        m_token: Address,
        amount: U256,
    ) -> Result<B256>;
    async fn get_nonce(&self, user: Address) -> Result<U256>;
}

pub struct ChainService<P> {
    provider: Arc<P>,
    intent_contract: LightContract,
    m_token_manager: LightContract,
    receipt_manager: LightContract,
    abi_error_signatures: HashMap<String, String>,
    chain_id: u64,
    _hyperlane_api_url: String,
    gas_price: u64,
}

#[async_trait::async_trait]
impl<P: Provider<Http<Client>> + 'static + WalletProvider> ChainServiceTrait for ChainService<P> {
    async fn post_intent(&self, intent: &SignedIntent) -> Result<B256> {
        let intent_id = intent.intent.intent_id();
        let sol_intent: sol_types::SignedIntent = intent.convert_to_sol_type();
        let args = &[sol_intent.into()];
        let input = PublishIntentCall {
            signed_intent: EthersSignedIntent {
                intent: intent.intent.clone().into(),
                signature: intent.signature.as_bytes().into(),
            },
        };

        let (tx_hash, receipt) = self
            ._make_intent_book_contract_call(PUBLISH_INTENT, args, Some(input.encode()))
            .await?;

        if receipt.status() {
            info!(tx_hash = %tx_hash, "`publishIntent` contract call succeeded for intent id {}.", intent_id);
            Ok(tx_hash)
        } else {
            let error = self.get_transaction_revert_reason(&tx_hash).await?;
            error!(tx_hash = %tx_hash, error = %error, "`publishIntent` contract call failed for intent id {}.", intent_id);
            Err(TransactionError::new(tx_hash, error).into())
        }
    }

    async fn get_nonce(&self, user: Address) -> Result<U256> {
        let args = &[DynSolValue::from(user)];
        let result = self._make_intent_book_query_call(GET_NONCE, args).await?;
        if let Some((nonce, _)) = result[0].clone().as_uint() {
            return Ok(nonce);
        }

        Err(anyhow!("Failed to parse get nonce response"))
    }

    async fn cancel_intent(&self, intent_id: &IntentId) -> Result<B256> {
        let fixed_32_bytes: [u8; 32] = intent_id.0;
        let word = Word::from_slice(&fixed_32_bytes);
        let dyn_sol_value = DynSolValue::FixedBytes(word, 32);

        let args = &[dyn_sol_value];

        let (tx_hash, receipt) = self
            ._make_intent_book_contract_call(CANCEL_INTENT, args, None)
            .await?;

        if receipt.status() {
            info!(tx_hash = %tx_hash, "`cancelIntent` contract call succeeded.");
            Ok(tx_hash)
        } else {
            let error = self.get_transaction_revert_reason(&tx_hash).await?;
            error!(tx_hash = %tx_hash, error = %error, "`cancelIntent` contract call failed.");
            Err(TransactionError::new(tx_hash, error).into())
        }
    }
    async fn withdraw_intent(
        &self,
        intent_id: &IntentId,
        author: Address,
        mtoken: Address,
        amount: U256,
        store: Arc<StorageService>,
    ) -> Result<B256> {
        let fixed_32_bytes: [u8; 32] = intent_id.0;
        let word = Word::from_slice(&fixed_32_bytes);
        let dyn_sol_value = DynSolValue::FixedBytes(word, 32);

        let args = &[
            dyn_sol_value,
            DynSolValue::Address(author.0.into()),
            DynSolValue::Address(mtoken.0.into()),
            DynSolValue::Uint(amount, 256),
        ];

        let (tx_hash, receipt) = self
            ._make_contract_call(&self.m_token_manager, WITHDRAW_INTENT, args, None)
            .await?;

        if receipt.status() {
            info!(tx_hash = %tx_hash, "`withdrawIntentBalance` contract call succeeded on hub chain.");
            let intent_id = intent_id.clone();
            tokio::spawn(async move {
                check_withdrawal_result(&receipt, Some((store, intent_id))).await
            });
            Ok(tx_hash)
        } else {
            let error = self.get_transaction_revert_reason(&tx_hash).await?;
            error!(tx_hash = %tx_hash, error = %error, "`withdrawIntentBalance` contract call failed on hub chain.");
            Err(TransactionError::new(tx_hash, error).into())
        }
    }

    async fn redeem_receipt(&self, receipt_id: &B256) -> Result<B256> {
        let fixed_32_bytes: [u8; 32] = receipt_id.0;

        let word = Word::from_slice(&fixed_32_bytes);
        let dyn_sol_value = DynSolValue::FixedBytes(word, 32);

        let args = &[dyn_sol_value];
        let (tx_hash, receipt) = self
            ._make_contract_call(&self.receipt_manager, REDEEM, args, None)
            .await?;
        if receipt.status() {
            info!(tx_hash = %tx_hash, "`redeem` contract call succeeded.");
            Ok(tx_hash)
        } else {
            let error = self.get_transaction_revert_reason(&tx_hash).await?;
            error!(tx_hash = %tx_hash, error = %error, "`redeem` contract call failed.");
            Err(TransactionError::new(tx_hash, error).into())
        }
    }

    async fn withdraw_mtokens_from_intent_receipt(
        &self,
        intent_id: IntentId,
        owner: Address,
        m_token: Address,
        amount: U256,
        store: Arc<StorageService>,
    ) -> Result<B256> {
        let args = &[
            DynSolValue::Address(owner.0.into()),
            DynSolValue::Address(m_token.0.into()),
            DynSolValue::Uint(amount, 256),
        ];
        let (tx_hash, receipt) = self
            ._make_contract_call(&self.m_token_manager, WITHDRAWAL, args, None)
            .await?;
        if receipt.status() {
            info!(tx_hash = %tx_hash, "`withdrawMToken` contract call succeeded on hub chain.");
            tokio::spawn(async move {
                check_withdrawal_result(&receipt, Some((store, intent_id))).await
            });
            Ok(tx_hash)
        } else {
            let error = self.get_transaction_revert_reason(&tx_hash).await?;
            error!(tx_hash = %tx_hash, error = %error, "`withdrawMToken` contract call failed on hub chain.");
            Err(TransactionError::new(tx_hash, error).into())
        }
    }

    async fn withdraw_mtokens(
        &self,
        receipt_owner: Address,
        m_token: Address,
        m_amount: U256,
    ) -> Result<B256> {
        let args = &[
            DynSolValue::Address(receipt_owner.0.into()),
            DynSolValue::Address(m_token.0.into()),
            DynSolValue::Uint(m_amount, 256),
        ];
        let (tx_hash, receipt) = self
            ._make_contract_call(&self.m_token_manager, WITHDRAWAL, args, None)
            .await?;
        if receipt.status() {
            info!(tx_hash = %tx_hash, "`withdrawMToken` contract call succeeded on hub chain.");
            tokio::spawn(async move { check_withdrawal_result(&receipt, None).await });
            Ok(tx_hash)
        } else {
            let error = self.get_transaction_revert_reason(&tx_hash).await?;
            error!(tx_hash = %tx_hash, error = %error, "`withdrawMToken` contract call failed on hub chain.");
            Err(TransactionError::new(tx_hash, error).into())
        }
    }

    async fn post_solution(&self, solution: &SignedSolution) -> Result<(B256, u64)> {
        let solution_hash = solution.hash();
        let sol_solution: sol_types::Solution = solution.solution.convert_to_sol_type();
        let args = &[sol_solution.into()];
        let input = SolveCall {
            solution: solution.solution.clone().into(),
        };
        let (tx_hash, receipt) = self
            ._make_intent_book_contract_call(SOLVE, args, Some(input.encode()))
            .await?;

        if receipt.status() {
            info!(tx_hash = %tx_hash, "`solve` contract call succeeded for solution hash {}", solution_hash);
            Ok((tx_hash, receipt.block_number.unwrap()))
        } else {
            let error = self.get_transaction_revert_reason(&tx_hash).await?;
            error!(tx_hash = %tx_hash, error = %error, "`solve` contract call failed for solution hash {}", solution_hash);
            Err(TransactionError::new(tx_hash, error).into())
        }
    }
}

impl<P: Provider<Http<Client>> + 'static + WalletProvider> ChainService<P> {
    pub async fn new(
        provider: Arc<P>,
        intent_contract: LightContract,
        m_token_manager: LightContract,
        receipt_manager: LightContract,
        hyperlane_api_url: String,
        gas_price: u64,
    ) -> Self {
        let chain_id = provider.get_chain_id().await.unwrap();
        let mut abi_error_signatures = HashMap::default();
        let intent_book_abi = intent_contract.abi.clone();
        let m_token_manager_abi = m_token_manager.abi.clone();
        let receipt_manager_abi = receipt_manager.abi.clone();

        for entry in intent_book_abi.items() {
            if let AbiItem::Error(error) = entry {
                let selector_bytes = error.selector();
                let selector_hex = format!("0x{}", hex::encode(selector_bytes)).to_lowercase();
                abi_error_signatures.insert(selector_hex, error.signature().to_string());
            }
        }

        for entry in m_token_manager_abi.items() {
            if let AbiItem::Error(error) = entry {
                let selector_bytes = error.selector();
                let selector_hex = format!("0x{}", hex::encode(selector_bytes)).to_lowercase();
                abi_error_signatures.insert(selector_hex, error.signature().to_string());
            }
        }

        for entry in receipt_manager_abi.items() {
            if let AbiItem::Error(error) = entry {
                let selector_bytes = error.selector();
                let selector_hex = format!("0x{}", hex::encode(selector_bytes)).to_lowercase();
                abi_error_signatures.insert(selector_hex, error.signature().to_string());
            }
        }

        Self {
            provider,
            intent_contract,
            m_token_manager,
            receipt_manager,
            abi_error_signatures,
            chain_id,
            _hyperlane_api_url: hyperlane_api_url,
            gas_price,
        }
    }

    pub async fn get_transaction_revert_reason(&self, tx_hash: &B256) -> Result<String> {
        let tx = match self.provider.get_transaction_by_hash(*tx_hash).await? {
            Some(tx) => tx,
            None => return Err(anyhow!("Transaction not found")),
        };

        let call_request = alloy::rpc::types::TransactionRequest::default()
            .with_from(tx.from)
            .with_to(tx.to.unwrap())
            .with_gas_price(tx.gas_price.unwrap())
            .with_value(tx.value)
            .with_input(tx.input);

        match self.provider.call(&call_request).await {
            Err(err) => {
                warn!("error: {:?}", err);
                let error_message = self.decode_error_message(&err.to_string())?;
                warn!("error_message: {:?}", error_message);
                Ok(error_message)
            }
            Ok(_) => Ok(
                "Transaction failed but simulation succeeded. Possible gas or nonce issue."
                    .to_string(),
            ),
        }
    }

    fn decode_error_message(&self, error: &String) -> Result<String> {
        for (selector, signature) in self.abi_error_signatures.iter() {
            if error.to_lowercase().contains(selector) {
                return Ok(format!("Contract reverted with: {}", signature));
            }
        }

        Ok(format!("Unknown error: {}", error))
    }

    async fn _check_hyperlane(&self, _tx_hash: B256) -> bool {
        unimplemented!()
    }

    #[allow(dead_code)]
    async fn _make_mtoken_manager_query(
        &self,
        function_name: &str,
        args: &[DynSolValue],
    ) -> Result<Vec<DynSolValue>> {
        let contract_abi = self.m_token_manager.abi.clone();
        let contract_instance = ContractInstance::new(
            self.m_token_manager.address,
            Arc::clone(&self.provider),
            Interface::new(contract_abi),
        );
        let result = contract_instance
            .function(function_name, args)?
            .call()
            .await?;

        Ok(result)
    }

    async fn _make_contract_call(
        &self,
        contract: &LightContract,
        function_name: &str,
        args: &[DynSolValue],
        input: Option<Vec<u8>>,
    ) -> Result<(B256, TransactionReceipt)> {
        let contract_abi = contract.abi.clone();
        let contract_instance = ContractInstance::new(
            contract.address,
            Arc::clone(&self.provider),
            Interface::new(contract_abi),
        );
        let wallet = contract_instance.provider().wallet();
        let address = wallet.default_signer_address();
        let nonce = self.provider.get_transaction_count(address).await?;

        let builder = if let Some(data) = input {
            contract_instance
                .function(function_name, args)?
                .into_transaction_request()
                .with_input(data)
        } else {
            contract_instance
                .function(function_name, args)?
                .into_transaction_request()
        };

        let mut tx = builder
            .with_from(address)
            .with_gas_price(self.gas_price as u128)
            .with_gas_limit(10_000_000)
            .with_chain_id(self.chain_id)
            .with_nonce(nonce);

        if function_name == WITHDRAWAL {
            tx = tx.with_value(U256::from(5000000000000000i64))
        }

        let tx = tx.build(&wallet).await?;

        let receipt = self
            .provider
            .send_tx_envelope(tx)
            .await?
            .get_receipt()
            .await?;
        let tx_hash = receipt.transaction_hash;

        Ok((tx_hash, receipt))
    }

    async fn _make_intent_book_contract_call(
        &self,
        function_name: &str,
        args: &[DynSolValue],
        input: Option<Vec<u8>>,
    ) -> Result<(B256, TransactionReceipt)> {
        let contract_abi = self.intent_contract.abi.clone();
        let contract_instance = ContractInstance::new(
            self.intent_contract.address,
            Arc::clone(&self.provider),
            Interface::new(contract_abi),
        );
        let wallet = contract_instance.provider().wallet();
        let address = wallet.default_signer_address();
        let nonce = self.provider.get_transaction_count(address).await?;

        let builder = if let Some(data) = input {
            contract_instance
                .function(function_name, args)?
                .into_transaction_request()
                .with_input(data)
        } else {
            contract_instance
                .function(function_name, args)?
                .into_transaction_request()
        };

        let tx = builder
            .with_from(address)
            .with_gas_price(self.gas_price as u128)
            .with_gas_limit(10_000_000)
            .with_chain_id(self.chain_id)
            .with_nonce(nonce)
            .build(&wallet)
            .await?;
        let receipt = self
            .provider
            .send_tx_envelope(tx)
            .await?
            .get_receipt()
            .await?;
        let tx_hash = receipt.transaction_hash;

        Ok((tx_hash, receipt))
    }

    async fn _make_intent_book_query_call(
        &self,
        function_name: &str,
        args: &[DynSolValue],
    ) -> Result<Vec<DynSolValue>> {
        let contract_abi = self.intent_contract.abi.clone();
        let contract_instance = ContractInstance::new(
            self.intent_contract.address,
            Arc::clone(&self.provider),
            Interface::new(contract_abi),
        );
        let result = contract_instance
            .function(function_name, args)?
            .call()
            .await?;

        Ok(result)
    }
}
