use std::str::FromStr;

use alloy::json_abi::ContractObject;
use alloy::network::{EthereumWallet, TransactionBuilder};
use alloy::primitives::Bytes;
use alloy::providers::{Provider, ProviderBuilder};
use alloy::rpc::types::TransactionRequest;
use alloy::signers::local::LocalSigner;

const CONTRACT_PATH: &str = "contracts/arcadia-core-contracts";

#[tokio::main]
async fn main() {
    let deployer_private_key = std::env::var("DEPLOYER_PRIVATE_KEY").expect("No private key found");
    let wallet = EthereumWallet::new(LocalSigner::from_str(&deployer_private_key).unwrap());
    let address = wallet.default_signer().address();
    let provider = ProviderBuilder::new()
        .with_recommended_fillers()
        .wallet(wallet.clone())
        .on_http("http://127.0.0.1:8000".parse().unwrap());

    let deploy = |byte_code: Bytes| async {
        let nonce = provider.get_transaction_count(address).await.unwrap();
        let tx = TransactionRequest::default()
            .with_from(address)
            .with_nonce(nonce)
            .with_gas_price(1)
            .with_gas_limit(6_000_000)
            .with_deploy_code(byte_code)
            .with_chain_id(31337)
            .build(&wallet)
            .await
            .unwrap();
        let tx_hash = tx.signature_hash();

        println!("Deploying contract tx {:?}", tx_hash);

        let receipt = provider
            .send_tx_envelope(tx)
            .await
            .unwrap()
            .get_receipt()
            .await
            .unwrap();

        println!("Deployed contract address {:?}", receipt.contract_address);
    };

    let intent_book_contract = contract_byte_code(format!(
        "{}/out/IntentBook.sol/IntentBook.json",
        CONTRACT_PATH
    ));
    let m_token_manager_contract = contract_byte_code(format!(
        "{}/out/MTokenManager.sol/MTokenManager.json",
        CONTRACT_PATH
    ));
    let receipt_manager_contract = contract_byte_code(format!(
        "{}/out/ReceiptManager.sol/ReceiptManager.json",
        CONTRACT_PATH
    ));

    println!("Deploying IntentBook contracts");
    deploy(intent_book_contract.deployed_bytecode.clone().unwrap()).await;

    println!("Deploying ReceiptManager contracts");
    deploy(receipt_manager_contract.deployed_bytecode.clone().unwrap()).await;

    println!("Deploying MTokenManager contracts");
    deploy(m_token_manager_contract.deployed_bytecode.clone().unwrap()).await;
}

fn contract_byte_code(path: String) -> ContractObject {
    serde_json::from_str(&std::fs::read_to_string(path.clone()).expect("Failed to read ABI"))
        .unwrap()
}
