#[allow(dead_code, unused)]
mod intent_book;

use std::sync::Arc;

use alloy::consensus::Transaction;
use alloy::contract::{ContractInstance, Interface};
use alloy::dyn_abi::{DynSolValue, Word};
use alloy::json_abi::AbiItem;
use alloy::network::{NetworkWallet, TransactionBuilder};
use alloy::primitives::{Address, B256, U256};
use alloy::providers::{Provider, WalletProvider};
use alloy::rpc::types::TransactionReceipt;
use anyhow::{Result, anyhow};
use async_trait::async_trait;
use ethers::abi::AbiEncode;
use medusa_config::LightContract;
use medusa_storage::{StorageService, StorageServiceTrait as _};
use medusa_types::conversion::RpcToSol;
use medusa_types::{IntentId, SignedIntent, SignedSolution, sol_types};
use rustc_hash::FxHashMap as HashMap;
use tracing::{error, info, warn};

use crate::intent_book::{PublishIntentCall, SignedIntent as EthersSignedIntent, SolveCall};

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
const GET_RECEIPT_NONCE: &str = "getReceiptNonce";
const SOLVE: &str = "solve";
const REDEEM: &str = "redeem";
const WITHDRAWAL: &str = "withdrawMToken";

#[async_trait]
pub trait ChainServiceTrait: Send + Sync + 'static {
    async fn post_intent(&self, intent: &SignedIntent) -> Result<B256>;
    async fn cancel_intent(&self, intent_id: &IntentId) -> Result<B256>;
    async fn post_solution(&self, solution: &SignedSolution) -> Result<(B256, u64)>;
    async fn redeem_receipt(&self, receipt_id: &B256) -> Result<B256>;
    async fn withdraw_mtokens(
        &self,
        owner: Address,
        m_token: Address,
        amount: U256,
    ) -> Result<B256>;
    async fn get_nonce(&self, user: Address) -> Result<U256>;
    async fn get_receipt_nonce(&self) -> Result<U256>;
    async fn get_chain_id(&self) -> u64;
}

pub struct ChainService<P> {
    provider: Arc<P>,
    intent_contract: LightContract,
    m_token_manager: LightContract,
    receipt_manager: LightContract,
    abi_error_signatures: HashMap<String, String>,
    chain_id: u64,
    gas_price: u64,
}

#[async_trait]
impl<P: Provider + 'static + WalletProvider> ChainServiceTrait for ChainService<P> {
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

        let (tx_hash, receipt) = make_contract_call(
            Arc::clone(&self.provider),
            &self.intent_contract,
            PUBLISH_INTENT,
            args,
            Some(input.encode()),
            self.gas_price,
        )
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

    async fn redeem_receipt(&self, receipt_id: &B256) -> Result<B256> {
        let fixed_32_bytes: [u8; 32] = receipt_id.0;

        let word = Word::from_slice(&fixed_32_bytes);
        let dyn_sol_value = DynSolValue::FixedBytes(word, 32);

        let args = &[dyn_sol_value];
        let (tx_hash, receipt) = make_contract_call(
            Arc::clone(&self.provider),
            &self.receipt_manager,
            REDEEM,
            args,
            None,
            self.gas_price,
        )
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

        let (tx_hash, receipt) = make_contract_call(
            Arc::clone(&self.provider),
            &self.intent_contract,
            CANCEL_INTENT,
            args,
            None,
            self.gas_price,
        )
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
        let (tx_hash, receipt) = make_contract_call(
            Arc::clone(&self.provider),
            &self.m_token_manager,
            WITHDRAWAL,
            args,
            None,
            self.gas_price,
        )
        .await?;
        if receipt.status() {
            info!(tx_hash = %tx_hash, "`withdrawMToken` contract call succeeded on hub chain.");
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
        let (tx_hash, receipt) = make_contract_call(
            Arc::clone(&self.provider),
            &self.intent_contract,
            SOLVE,
            args,
            Some(input.encode()),
            self.gas_price,
        )
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

    async fn get_chain_id(&self) -> u64 {
        self.chain_id
    }
    async fn get_receipt_nonce(&self) -> Result<U256> {
        let result = self
            ._make_receipt_manager_query_call(GET_RECEIPT_NONCE, &[])
            .await?;
        if let Some((nonce, _)) = result[0].clone().as_uint() {
            return Ok(nonce);
        }

        Err(anyhow!("Failed to parse get receiptnonce response"))
    }
}

impl<P: Provider + 'static + WalletProvider> ChainService<P> {
    pub async fn new(
        provider: Arc<P>,
        storage_service: StorageService,
        intent_contract: LightContract,
        m_token_manager: LightContract,
        receipt_manager: LightContract,
        gas_price: u64,
    ) -> Self {
        let chain_id = provider.get_chain_id().await.unwrap();
        let mut abi_error_signatures = HashMap::default();
        let intent_book_abi = intent_contract.abi.clone();
        let m_token_manager_abi = m_token_manager.abi.clone();
        let receipt_manager_abi = receipt_manager.abi.clone();

        for entry in intent_book_abi
            .items()
            .chain(m_token_manager_abi.items())
            .chain(receipt_manager_abi.items())
        {
            if let AbiItem::Error(error) = entry {
                let selector_bytes = error.selector();
                let selector_hex = format!("0x{}", hex::encode(selector_bytes)).to_lowercase();
                abi_error_signatures.insert(selector_hex, error.signature().to_string());
            }
        }
        let provider_clone_expiration_processor = Arc::clone(&provider);
        let provider_clone_chain_height_checker = Arc::clone(&provider);
        let storage_service_chain_height_updater = storage_service.clone();
        let intent_contract_clone = intent_contract.clone();

        tokio::spawn(async move {
            loop {
                let height = match provider_clone_chain_height_checker.get_block_number().await {
                    Ok(height) => height,
                    Err(e) => {
                        error!(
                            "Error getting chain height: {:?}. Will wait 2 seconds before retrying.",
                            e
                        );
                        continue;
                    }
                };
                info!("chain height: {:?}", height);
                storage_service_chain_height_updater.update_chain_height(height);
                tokio::time::sleep(std::time::Duration::from_secs(2)).await; // block time is 2 seconds.
            }
        });
        tokio::spawn(async move {
            let mut expiration_rx = storage_service.subscribe_expired_intents();
            while let Ok(expired_intents) = expiration_rx.recv().await {
                info!("Received expired intents: {:?}", expired_intents);
                for intent_id in expired_intents.iter() {
                    // probably need to refactor
                    let fixed_32_bytes: [u8; 32] = intent_id.0;
                    let word = Word::from_slice(&fixed_32_bytes);
                    let dyn_sol_value = DynSolValue::FixedBytes(word, 32);

                    let args = &[dyn_sol_value];

                    match make_contract_call(
                        provider_clone_expiration_processor.clone(),
                        &intent_contract_clone,
                        CANCEL_INTENT,
                        args,
                        None,
                        gas_price,
                    )
                    .await
                    {
                        Ok((tx_hash, _)) => {
                            info!(
                                "Cancelled intent after expiration: {:?}, cancellation tx hash: {}",
                                intent_id, tx_hash
                            );
                            match storage_service.cancel_intent(intent_id, tx_hash).await {
                                Ok(_) => {
                                    info!("Recorded intent cancellation after expiration to db.");
                                }
                                Err(e) => {
                                    warn!(
                                        "Error recording intent cancellation after expiration: {:?}",
                                        e
                                    );
                                }
                            }
                        }
                        Err(e) => {
                            error!("Error cancelling intent after expiration: {:?}", e);
                        }
                    }
                }
            }
        });

        Self {
            provider,
            intent_contract,
            m_token_manager,
            receipt_manager,
            abi_error_signatures,
            chain_id,
            gas_price,
        }
    }

    pub async fn get_transaction_revert_reason(&self, tx_hash: &B256) -> Result<String> {
        let tx = match self.provider.get_transaction_by_hash(*tx_hash).await? {
            Some(tx) => tx.inner,
            None => return Err(anyhow!("Transaction not found")),
        };

        let call_request = alloy::rpc::types::TransactionRequest::default()
            .with_from(tx.signer())
            .with_to(tx.to().unwrap())
            .with_gas_price(tx.gas_price().unwrap())
            .with_value(tx.value())
            .with_input(tx.input().to_vec());

        match self.provider.call(call_request).await {
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

    async fn _make_receipt_manager_query_call(
        &self,
        function_name: &str,
        args: &[DynSolValue],
    ) -> Result<Vec<DynSolValue>> {
        let contract_abi = self.receipt_manager.abi.clone();
        let contract_instance = ContractInstance::new(
            self.receipt_manager.address,
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
async fn make_contract_call<P: Provider + 'static + WalletProvider>(
    provider: Arc<P>,
    contract: &LightContract,
    function_name: &str,
    args: &[DynSolValue],
    input: Option<Vec<u8>>,
    gas_price: u64,
) -> Result<(B256, TransactionReceipt)> {
    let contract_abi = contract.abi.clone();
    let chain_id = provider.get_chain_id().await?;
    let contract_instance = ContractInstance::new(
        contract.address,
        Arc::clone(&provider),
        Interface::new(contract_abi),
    );
    let wallet = contract_instance.provider().wallet();
    let address = wallet.default_signer_address();
    let nonce = provider.get_transaction_count(address).await?;

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
        .with_gas_price(gas_price as u128)
        .with_gas_limit(10_000_000)
        .with_chain_id(chain_id)
        .with_nonce(nonce);

    if function_name == WITHDRAWAL {
        tx = tx.with_value(U256::from(5000000000000000i64))
    }

    let tx = tx.build(&wallet).await?;

    let receipt = provider.send_tx_envelope(tx).await?.get_receipt().await?;
    let tx_hash = receipt.transaction_hash;

    Ok((tx_hash, receipt))
}
