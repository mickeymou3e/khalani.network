use std::path::Path;
use std::str::FromStr;

use alloy::{
    network::EthereumWallet,
    node_bindings::{Anvil, AnvilInstance},
    primitives::Address,
    providers::{Provider, ProviderBuilder, WalletProvider},
    signers::local::{LocalSigner, PrivateKeySigner},
    transports::http::{Client, Http},
};
use anyhow::Result;

use serde::{Deserialize, Serialize};

pub const ANVIL_PKEYS: [&str; 3] = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
];

#[derive(Debug, Serialize, Deserialize)]
pub struct HyperlaneRpcUrlEntry {
    http: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    https: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HyperlaneNativeTokenEntry {
    symbol: String,
    name: String,
    decimals: u64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HyperlaneRegistryChainConfig {
    name: String,
    display_name: String,
    is_testnet: bool,
    chain_id: u64,
    domain_id: u64,
    protocol: String,
    rpc_urls: Vec<HyperlaneRpcUrlEntry>,
    native_token: HyperlaneNativeTokenEntry,
}

#[derive(Debug, Serialize, Deserialize)]
enum IsmType {
    #[serde(rename = "trustedRelayerIsm")]
    TrustedRelayerIsm,
}
#[derive(Debug, Serialize, Deserialize)]
struct IsmConfig {
    #[serde(rename = "type")]
    _type: IsmType,
    relayer: String,
}

#[derive(Debug, Serialize, Deserialize)]
enum HookType {
    #[serde(rename = "merkleTreeHook")]
    MerkleTreeHook,
}
#[derive(Debug, Serialize, Deserialize)]
struct HookConfig {
    #[serde(rename = "type")]
    _type: HookType,
}

#[derive(Debug, Serialize, Deserialize)]
enum RequiredHookType {
    #[serde(rename = "protocolFee")]
    ProtocolFee,
}

#[derive(Debug, Serialize, Deserialize)]
struct RequiredHookConfig {
    owner: String,
    #[serde(rename = "type")]
    _type: RequiredHookType,
    beneficiary: String,
    #[serde(rename = "maxProtocolFee")]
    max_protocol_fee: String,
    #[serde(rename = "protocolFee")]
    protocol_fee: String,
}
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct HyperlaneCoreConfig {
    owner: String,
    default_ism: IsmConfig,
    default_hook: HookConfig,
    required_hook: RequiredHookConfig,
}

impl HyperlaneCoreConfig {
    pub fn from_env() -> Self {
        let deployer_address = std::env::var("DEPLOYER_ADDRESS").unwrap();
        HyperlaneCoreConfig {
            owner: deployer_address.clone(),
            default_ism: IsmConfig {
                _type: IsmType::TrustedRelayerIsm,
                relayer: deployer_address.clone(),
            },
            default_hook: HookConfig {
                _type: HookType::MerkleTreeHook,
            },
            required_hook: RequiredHookConfig {
                owner: deployer_address.clone(),
                _type: RequiredHookType::ProtocolFee,
                beneficiary: deployer_address,
                max_protocol_fee: "100000000000000000".to_string(),
                protocol_fee: "0".to_string(),
            },
        }
    }

    pub fn write_to_file(&self) -> Result<()> {
        let configs_dir = Path::new("./configs");
        if !configs_dir.exists() {
            std::fs::create_dir_all(configs_dir)?;
        }
        let config_path = configs_dir.join("core-config.yaml");

        let file = std::fs::OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(config_path.clone())?;
        serde_yaml::to_writer(file, self)?;
        Ok(())
    }
}

/*
example addresses for hyperlane core contracts:
domainRoutingIsmFactory: "0x36eD1bB7540c5535a5272425b949b85C5dddCa9b"
interchainAccountIsm: "0x6E8ad9ead9131bD53F386b62348d314b550B783E"
interchainAccountRouter: "0xf922A3Fe32A009eF7dD7E7dfa789593B2D37a4bD"
mailbox: "0x8640C33C4B636d791aFC481676b12325dE3e626f"
proxyAdmin: "0x3C7c66EA971ef7239885103532527161C71A4134"
staticAggregationHookFactory: "0x9C7B13673DD9eBF360db30D531f1F08cabE753b8"
staticAggregationIsmFactory: "0x842b147F980C65394295c57baaaA4C37a4b539EA"
staticMerkleRootMultisigIsmFactory: "0xb40Ea52b72332594252fd43323Db0a8b36A924ff"
staticMerkleRootWeightedMultisigIsmFactory: "0xc5c288EfA68352334dD203220BE1eC08877731cb"
staticMessageIdMultisigIsmFactory: "0x4DA3fF9e4B15D5647df010c71fEf428CAfCa6D28"
staticMessageIdWeightedMultisigIsmFactory: "0x82BcC0ACa686E2EccF8620c7618398dcE568E171"
testRecipient: "0x90994d45449734ebF2F7e9e55072F3758eD52A40"
validatorAnnounce: "0xD06Bfd5D5130533A67EcF7E250F24358852Db055"

*/

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HyperlaneAddresses {
    domain_routing_ism_factory: Address,
    interchain_account_ism: Address,
    interchain_account_router: Address,
    mailbox: Address,
    proxy_admin: Address,
    static_aggregation_hook_factory: Address,
    static_aggregation_ism_factory: Address,
    static_merkle_root_multisig_ism_factory: Address,
    static_merkle_root_weighted_multisig_ism_factory: Address,
    static_message_id_multisig_ism_factory: Address,
    static_message_id_weighted_multisig_ism_factory: Address,
    test_recipient: Address,
    validator_announce: Address,
}

#[allow(dead_code)]
pub struct MultiChainNetwork {
    arcadia: AnvilInstance,
    spoke_chain_1: AnvilInstance,
    spoke_chain_2: AnvilInstance,
}

impl MultiChainNetwork {
    pub async fn new() -> Self {
        let spoke_1_id = 31338;
        let spoke_2_id = 31339;
        let arcadia = start_anvil(None)
            .await
            .expect("Failed to start Anvil instance for Arcadia");
        let spoke_1 = start_anvil(Some(spoke_1_id))
            .await
            .expect("Failed to start Anvil instance for Spoke 1");
        let spoke_2 = start_anvil(Some(spoke_2_id))
            .await
            .expect("Failed to start Anvil instance for Spoke 2");

        Self {
            arcadia,
            spoke_chain_1: spoke_1,
            spoke_chain_2: spoke_2,
        }
    }

    pub fn arcadia_chain_hyperlane_config() -> HyperlaneRegistryChainConfig {
        HyperlaneRegistryChainConfig {
            name: "arcadia".to_string(),
            display_name: "Arcadia".to_string(),
            chain_id: 31337,
            domain_id: 31337,
            protocol: "ethereum".to_string(),
            rpc_urls: vec![HyperlaneRpcUrlEntry {
                http: "http://127.0.0.1:8545".to_string(),
                https: None,
            }],
            native_token: HyperlaneNativeTokenEntry {
                symbol: "ARC".to_string(),
                name: "ArcadiaToken".to_string(),
                decimals: 18,
            },
            is_testnet: true,
        }
    }

    pub fn spoke_1_chain_hyperlane_config() -> HyperlaneRegistryChainConfig {
        HyperlaneRegistryChainConfig {
            name: "spoke_1".to_string(),
            display_name: "Spoke 1".to_string(),
            chain_id: 31338,
            domain_id: 31338,
            protocol: "ethereum".to_string(),
            rpc_urls: vec![HyperlaneRpcUrlEntry {
                http: "http://127.0.0.1:8546".to_string(),
                https: None,
            }],

            native_token: HyperlaneNativeTokenEntry {
                symbol: "SP1".to_string(),
                name: "SPOKE1".to_string(),
                decimals: 18,
            },
            is_testnet: true,
        }
    }

    pub fn spoke_2_chain_hyperlane_config() -> HyperlaneRegistryChainConfig {
        HyperlaneRegistryChainConfig {
            name: "spoke_2".to_string(),
            display_name: "Spoke 2".to_string(),
            chain_id: 31339,
            domain_id: 31339,
            protocol: "ethereum".to_string(),
            rpc_urls: vec![HyperlaneRpcUrlEntry {
                http: "http://127.0.0.1:8547".to_string(),
                https: None,
            }],
            native_token: HyperlaneNativeTokenEntry {
                symbol: "SP2".to_string(),
                name: "SPOKE2".to_string(),
                decimals: 18,
            },
            is_testnet: true,
        }
    }
}
pub async fn start_anvil(chain_id: Option<u64>) -> Result<AnvilInstance> {
    let anvil = Anvil::new()
        .block_time(1)
        .chain_id(chain_id.unwrap_or(31337))
        .try_spawn()?;
    Ok(anvil)
}

pub fn create_provider(rpc_url: &str) -> impl Provider<Http<Client>> + 'static + WalletProvider {
    let wallet = EthereumWallet::new(LocalSigner::from_str(ANVIL_PKEYS[0]).unwrap());
    ProviderBuilder::new()
        .with_recommended_fillers()
        .wallet(wallet)
        .on_http(rpc_url.parse().unwrap())
}

pub fn set_hyperlane_config() -> Result<()> {
    let path_to_home_dir = std::env::var("HOME").unwrap();
    let path_to_hyperlane = format!("{}/.hyperlane/chains", path_to_home_dir);
    let path_to_hyperlane = Path::new(&path_to_hyperlane);
    if !path_to_hyperlane.exists() {
        std::fs::create_dir_all(path_to_hyperlane)?;
    }
    let path_to_arcadia_config = path_to_hyperlane.join("arcadia");
    if !path_to_arcadia_config.exists() {
        std::fs::create_dir_all(path_to_arcadia_config.clone())?;
    }
    let path_to_spoke_1_config = path_to_hyperlane.join("spoke_1");
    if !path_to_spoke_1_config.exists() {
        std::fs::create_dir_all(path_to_spoke_1_config.clone())?;
    }
    let path_to_spoke_2_config = path_to_hyperlane.join("spoke_2");
    if !path_to_spoke_2_config.exists() {
        std::fs::create_dir_all(path_to_spoke_2_config.clone())?;
    }

    let path_to_arcadia_config_file = path_to_arcadia_config.clone().join("metadata.yaml");
    let path_to_spoke_1_config_file = path_to_spoke_1_config.clone().join("metadata.yaml");
    let path_to_spoke_2_config_file = path_to_spoke_2_config.clone().join("metadata.yaml");

    let mut file = std::fs::OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(path_to_arcadia_config_file)?;
    let config = MultiChainNetwork::arcadia_chain_hyperlane_config();
    serde_yaml::to_writer(&mut file, &config)?;
    let mut file = std::fs::OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(path_to_spoke_1_config_file)?;
    let config = MultiChainNetwork::spoke_1_chain_hyperlane_config();
    serde_yaml::to_writer(&mut file, &config)?;
    let mut file = std::fs::OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(path_to_spoke_2_config_file)?;
    let config = MultiChainNetwork::spoke_2_chain_hyperlane_config();
    serde_yaml::to_writer(&mut file, &config)?;
    Ok(())
}

pub async fn deploy_arcadia_contracts(anvil: &AnvilInstance) -> Result<()> {
    let signer: PrivateKeySigner = anvil.keys()[0].clone().into();
    let wallet = EthereumWallet::from(signer);

    // Create a provider with the wallet.
    let rpc_url = anvil.endpoint().parse()?;
    let _provider = ProviderBuilder::new()
        .with_recommended_fillers()
        .wallet(wallet)
        .on_http(rpc_url);

    println!("Anvil running at `{}`", anvil.endpoint());

    // let intent_book_contract = ArcadiaIntentBookInstance::deploy(&provider).await?;
    // let m_token_contract = ArcadiaMTokenManager::deploy(&provider).await?;
    // let m_token_manager_contract = ArcadiaMTokenManager::deploy(&provider).await?;
    // let receipt_manager_contract = ArcadiaReceiptManager::deploy(&provider).await?;

    Ok(())
}

pub fn get_hyperlane_config(chain_name: &str) -> Result<HyperlaneRegistryChainConfig> {
    let path_to_home_dir = std::env::var("HOME").unwrap();
    let path_to_hyperlane = format!("{}/.hyperlane/chains/{}", path_to_home_dir, chain_name);
    let path_to_hyperlane = Path::new(&path_to_hyperlane);
    let path_to_config_file = path_to_hyperlane.join("metadata.yaml");
    let file = std::fs::OpenOptions::new()
        .read(true)
        .open(path_to_config_file)?;
    let config = serde_yaml::from_reader(file)?;
    Ok(config)
}
#[tokio::main]
async fn main() -> Result<()> {
    /*
       CLI that supports following commands:
       - hyperlane registry init
    */
    let deployer_address = std::env::var("DEPLOYER_ADDRESS");
    let deployer_private_key = std::env::var("DEPLOYER_PRIVATE_KEY");
    if deployer_address.is_err() {
        println!("DEPLOYER_ADDRESS not set. Use `cast wallet new` to create a new address");
    }
    if deployer_private_key.is_err() {
        println!(
            "DEPLOYER_PRIVATE_KEY not set. Use `cast wallet new` to create a new key and address"
        );
    }
    // get balance of deployer
    let args = std::env::args().collect::<Vec<String>>();
    let command = args[1].clone();
    match command.as_str() {
        "registry" => {
            let subcommand = args[2].clone();
            match subcommand.as_str() {
                "init" => {
                    set_hyperlane_config()?;
                }
                "view" => {
                    let chain_name = args[3].clone();
                    let config = get_hyperlane_config(&chain_name)?;
                    println!("{}", serde_yaml::to_string(&config)?);
                }
                _ => {
                    eprintln!("Invalid subcommand: {}", subcommand);
                    std::process::exit(1);
                }
            }
        }
        "deploy" => {
            let subcommand = args[2].clone();
            match subcommand.as_str() {
                "init" => {
                    let hyperlane_core_config = HyperlaneCoreConfig::from_env();
                    hyperlane_core_config.write_to_file()?;
                    println!("Wrote hyperlane core config to file at ./configs/core-config.yaml");
                }
                "check" => {
                    let chain_name = args[3].clone();
                    println!(
                        "Checking hyperlane core deployment addresses for chain {}.",
                        chain_name
                    );
                    let path_to_home_dir = std::env::var("HOME").unwrap();
                    let path_to_hyperlane_addresses = format!(
                        "{}/.hyperlane/chains/{}/addresses.yaml",
                        path_to_home_dir, chain_name
                    );
                    let addresses: HyperlaneAddresses =
                        serde_yaml::from_reader(std::fs::File::open(path_to_hyperlane_addresses)?)?;
                    println!("Addresses exist for chain {}.", chain_name);
                    println!("{}", serde_yaml::to_string(&addresses)?);
                }
                _ => {
                    eprintln!("Invalid subcommand: {}", subcommand);
                    std::process::exit(1);
                }
            }
        }
        _ => {
            eprintln!("Invalid command: {}", command);
        }
    }
    Ok(())
}
