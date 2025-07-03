use std::str::FromStr;

use alloy::{
    contract::CallBuilder,
    json_abi::ContractObject,
    network::{Ethereum, EthereumWallet},
    node_bindings::{Anvil, AnvilInstance},
    primitives::Bytes,
    providers::{
        fillers::{
            BlobGasFiller, ChainIdFiller, FillProvider, GasFiller, JoinFill, NonceFiller,
            WalletFiller,
        },
        Identity, ProviderBuilder, RootProvider,
    },
    signers::local::LocalSigner,
    transports::http::{reqwest::Url, Client, Http},
};
use tokio::signal::unix::{self, SignalKind};

pub const CONTRACT_PATH: &str = "contracts/arcadia-core-contracts";
pub const ANVIL_PORT: u16 = 8545;
pub const INTENT_BOOK: &str = "intent_book";
pub const M_TOKEN_MANAGER: &str = "m_token_manager";
pub const RECEIPT_MANAGER: &str = "receipt_manager";
pub const EVENT_PUBLISHER: &str = "event_publisher";
pub const EVENT_VERIFIER: &str = "event_verifier";
pub const ASSET_RESERVES: &str = "asset_reserve";
pub const ERC_20: &str = "erc_20";

type AnvilProvider<'a> = FillProvider<
    JoinFill<
        JoinFill<
            Identity,
            JoinFill<GasFiller, JoinFill<BlobGasFiller, JoinFill<NonceFiller, ChainIdFiller>>>,
        >,
        WalletFiller<&'a EthereumWallet>,
    >,
    RootProvider<Http<Client>>,
    Http<Client>,
    Ethereum,
>;

#[derive(Debug)]
pub enum Chain {
    Arcadia, // port 8545, chain id 31337
    Sepolia, // port 8546, chain id 31338
    Fuji,    // port 8547, chain id 31339
}

pub struct DevNet {
    arcadia_chain: AnvilInstance,
    sepolia_chain: AnvilInstance,
    fuji_chain: AnvilInstance,
    wallet: EthereumWallet,
}

impl DevNet {
    pub async fn new(key: &str) -> Self {
        let wallet =
            EthereumWallet::new(LocalSigner::from_str(key).expect("Failed to parse private key"));

        let arcadia_chain = Anvil::new()
            .block_time(1)
            .port(8545u16)
            .chain_id(31337)
            .spawn();
        let sepolia_chain = Anvil::new()
            .block_time(1)
            .port(8546u16)
            .chain_id(31338)
            .spawn();
        let fuji_chain = Anvil::new()
            .block_time(1)
            .port(8547u16)
            .chain_id(31339)
            .spawn();

        Self {
            arcadia_chain,
            sepolia_chain,
            fuji_chain,
            wallet,
        }
    }

    pub async fn deploy_asset_reserves(&self) {
        println!("Deploying AssetReserves contract");
        let asset_reserve_contract = contract_byte_code(format!(
            "{}/out/AssetReserves.sol/AssetReserves.json",
            CONTRACT_PATH
        ));

        self.deploy_contract(
            Chain::Sepolia,
            asset_reserve_contract.deployed_bytecode.clone().unwrap(),
            ASSET_RESERVES,
        )
        .await;
        self.deploy_contract(
            Chain::Fuji,
            asset_reserve_contract.deployed_bytecode.clone().unwrap(),
            ASSET_RESERVES,
        )
        .await;
    }

    pub async fn deploy_erc20(&self) {
        println!("Deploying ERC20 contract");
        let erc20_contract =
            contract_byte_code(format!("{}/out/ERC20.sol/ERC20.json", CONTRACT_PATH));

        self.deploy_contract(
            Chain::Arcadia,
            erc20_contract.deployed_bytecode.clone().unwrap(),
            ERC_20,
        )
        .await;
        self.deploy_contract(
            Chain::Sepolia,
            erc20_contract.deployed_bytecode.clone().unwrap(),
            ERC_20,
        )
        .await;
        self.deploy_contract(
            Chain::Fuji,
            erc20_contract.deployed_bytecode.clone().unwrap(),
            ERC_20,
        )
        .await;
    }

    pub async fn deploy_event_verifier(&self) {
        println!("Deploying EventVerifier contract");
        let event_verifier_contract = contract_byte_code(format!(
            "{}/out/EventVerifier.sol/EventVerifier.json",
            CONTRACT_PATH
        ));

        self.deploy_contract(
            Chain::Arcadia,
            event_verifier_contract.deployed_bytecode.clone().unwrap(),
            EVENT_VERIFIER,
        )
        .await;
        self.deploy_contract(
            Chain::Sepolia,
            event_verifier_contract.deployed_bytecode.clone().unwrap(),
            EVENT_VERIFIER,
        )
        .await;
        self.deploy_contract(
            Chain::Fuji,
            event_verifier_contract.deployed_bytecode.clone().unwrap(),
            EVENT_VERIFIER,
        )
        .await;
    }

    pub async fn deploy_event_publisher(&self) {
        println!("Deploying EventPublisher contract");
        let event_publisher_contract = contract_byte_code(format!(
            "{}/out/EventPublisher.sol/EventPublisher.json",
            CONTRACT_PATH
        ));

        self.deploy_contract(
            Chain::Arcadia,
            event_publisher_contract.deployed_bytecode.clone().unwrap(),
            EVENT_PUBLISHER,
        )
        .await;
        self.deploy_contract(
            Chain::Sepolia,
            event_publisher_contract.deployed_bytecode.clone().unwrap(),
            EVENT_PUBLISHER,
        )
        .await;
        self.deploy_contract(
            Chain::Fuji,
            event_publisher_contract.deployed_bytecode.clone().unwrap(),
            EVENT_PUBLISHER,
        )
        .await;
    }

    pub async fn deploy_arcadia_contracts(&self) {
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

        println!("Deploying Arcadia contracts");
        self.deploy_contract(
            Chain::Arcadia,
            intent_book_contract.deployed_bytecode.clone().unwrap(),
            INTENT_BOOK,
        )
        .await;
        self.deploy_contract(
            Chain::Arcadia,
            m_token_manager_contract.deployed_bytecode.clone().unwrap(),
            M_TOKEN_MANAGER,
        )
        .await;
        self.deploy_contract(
            Chain::Arcadia,
            receipt_manager_contract.deployed_bytecode.clone().unwrap(),
            RECEIPT_MANAGER,
        )
        .await;
    }

    async fn deploy_contract(&self, chain: Chain, byte_code: Bytes, contract_name: &str) {
        let provider = self.provider(&chain);
        let address = CallBuilder::new_raw_deploy(provider, byte_code)
            .send()
            .await
            .expect("Failed to deploy intent book contract")
            .get_receipt()
            .await
            .unwrap()
            .contract_address
            .unwrap();

        println!(
            "Deployed {} contract at {:?} address {}",
            contract_name, chain, address
        );
    }

    fn provider(&self, chain: &Chain) -> AnvilProvider {
        ProviderBuilder::new()
            .with_recommended_fillers()
            .wallet(&self.wallet)
            .on_http(self.get_url(chain))
    }

    fn get_url(&self, chain: &Chain) -> Url {
        match chain {
            Chain::Arcadia => self.arcadia_chain.endpoint_url(),
            Chain::Sepolia => self.sepolia_chain.endpoint_url(),
            Chain::Fuji => self.fuji_chain.endpoint_url(),
        }
    }
}

fn contract_byte_code(path: String) -> ContractObject {
    serde_json::from_str(&std::fs::read_to_string(path.clone()).expect("Failed to read ABI"))
        .unwrap()
}

#[tokio::main]
async fn main() {
    let deployer_private_key = std::env::var("DEPLOYER_PRIVATE_KEY").expect("No private key found");
    let dev_net = DevNet::new(&deployer_private_key).await;
    dev_net.deploy_arcadia_contracts().await;
    dev_net.deploy_erc20().await;
    dev_net.deploy_asset_reserves().await;
    dev_net.deploy_event_publisher().await;
    dev_net.deploy_event_verifier().await;

    let mut interrupt_signal = unix::signal(SignalKind::interrupt()).unwrap();
    let mut terminate_signal = unix::signal(SignalKind::terminate()).unwrap();
    tokio::select! {
        _ = interrupt_signal.recv() => {}
        _ = terminate_signal.recv() => {}
    };
    drop(dev_net);
}
