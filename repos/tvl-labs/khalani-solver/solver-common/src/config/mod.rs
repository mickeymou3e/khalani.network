pub mod addresses;
pub mod args;
pub mod ccmm;
pub mod chain;
pub mod token;
pub mod wallet;

use std::collections::HashMap;
use std::{env, fs};

use anyhow::{Context, Result};
use ethers::types::Address;
use serde::{Deserialize, Serialize};

use crate::config::addresses::{
    AddressesConfig, AddressesConfigRaw, IntentbookAddresses, VerifierConfig,
};
use crate::config::ccmm::{CCMMConfig, CCMMConfigRaw};
use crate::config::chain::{ChainConfig, ChainConfigRaw, ChainId};
use crate::config::token::{TokenConfig, TokenConfigRaw};
use crate::error::ConfigError;
#[derive(Serialize, Deserialize, Debug)]
pub struct ConfigRaw {
    pub addresses: AddressesConfigRaw,
    pub chains: Vec<ChainConfigRaw>,
    pub tokens: HashMap<String, Vec<TokenConfigRaw>>,
    pub ccmm: CCMMConfigRaw,
}

#[derive(Debug, Clone)]
pub struct Config {
    pub addresses: AddressesConfig,
    pub chains: Vec<ChainConfig>,
    pub tokens: Vec<TokenConfig>,
    pub ccmm: CCMMConfig,
}

impl Config {
    pub fn read_config(file_path: &str) -> Result<Config> {
        let file_content = fs::read_to_string(file_path)?;
        let config: ConfigRaw = serde_json::from_str(&file_content)?;
        let addresses_config_raw = config.addresses;
        let chains = config
            .chains
            .iter()
            .map(Self::create_chain_config)
            .collect::<Result<Vec<ChainConfig>>>()?;
        let addresses = AddressesConfig {
            intents_mempool_address: Self::parse_address(
                &addresses_config_raw.intents_mempool_address,
                "intents_mempool_address",
            )?,
            settlement_reactor_address: Self::parse_address(
                &addresses_config_raw.settlement_reactor_address,
                "settlement_reactor_address",
            )?,
            verifiers: {
                let mut verifier_addresses = Vec::new();
                for (verifier_chain_name, prover_chains) in &addresses_config_raw.verifiers {
                    let verifier_chain_config = chains
                        .iter()
                        .find(|chain| &chain.name == verifier_chain_name)
                        .context(ConfigError::FieldNotFound(
                            String::from("Verifier chain"),
                            verifier_chain_name.clone(),
                        ))?;
                    let verifier_chain_id = verifier_chain_config.chain_id;
                    let prover_chain_to_verifier_address =
                        Self::parse_chain_to_address_map(prover_chains, &chains)?;
                    let verifier_addresses_vec: Vec<VerifierConfig> =
                        prover_chain_to_verifier_address
                            .iter()
                            .map(|(prover_chain_id, verifier_address)| VerifierConfig {
                                verifier_chain_id,
                                prover_chain_id: *prover_chain_id,
                                verifier_address: *verifier_address,
                            })
                            .collect();
                    verifier_addresses.extend(verifier_addresses_vec);
                }
                verifier_addresses
            },
            escrows: Self::parse_chain_to_address_map(&addresses_config_raw.escrows, &chains)?,
            swap_intent_fillers: Self::parse_chain_to_address_map(
                &addresses_config_raw.swap_intent_fillers,
                &chains,
            )?,
            intentbook_addresses: IntentbookAddresses {
                limit_order_intentbook: Self::parse_address(
                    &addresses_config_raw
                        .intentbook_addresses
                        .limit_order_intentbook,
                    "limit_order_intentbook",
                )?,
                spoke_chain_call_intentbook: Self::parse_address(
                    &addresses_config_raw
                        .intentbook_addresses
                        .spoke_chain_call_intentbook,
                    "spoke_chain_call_intentbook",
                )?,
                swap_intent_intentbook: Self::parse_address(
                    &addresses_config_raw
                        .intentbook_addresses
                        .swap_intent_intentbook,
                    "swap_intent_intentbook",
                )?,
            },
            spoke_chain_executor_addresses: Self::parse_chain_to_address_map(
                &addresses_config_raw.spoke_chain_executors,
                &chains,
            )?,
        };

        let mut result_tokens = Vec::with_capacity(config.tokens.len());
        for (chain_name, tokens) in &config.tokens {
            let chain_config = chains
                .iter()
                .find(|chain| &chain.name == chain_name)
                .ok_or_else(|| {
                    ConfigError::FieldNotFound(String::from("Token chain"), chain_name.to_string())
                })?;

            for token in tokens {
                result_tokens.push(TokenConfig {
                    chain_id: chain_config.chain_id,
                    address: Self::parse_address(&token.address, "token_address")?,
                });
            }
        }

        Ok(Config {
            addresses,
            chains,
            tokens: result_tokens,
            ccmm: Self::create_ccmm_config(&config.ccmm)?,
        })
    }

    fn parse_chain_to_address_map(
        chain_to_address_map: &HashMap<String, String>,
        chains: &[ChainConfig],
    ) -> Result<HashMap<ChainId, Address>> {
        let mut result_map = HashMap::new();

        for (chain_name, address) in chain_to_address_map.iter() {
            let chain_config = chains
                .iter()
                .find(|chain| &chain.name == chain_name)
                .ok_or_else(|| {
                    ConfigError::FieldNotFound(String::from("Chain"), chain_name.to_string())
                })?;

            let parsed_address = Self::parse_address(address, "chain_address")?;
            result_map.insert(chain_config.chain_id, parsed_address);
        }

        Ok(result_map)
    }

    fn create_chain_config(chain_raw: &ChainConfigRaw) -> Result<ChainConfig> {
        let rpc_url = Self::parse_url(chain_raw.rpc_url.as_str())?;
        let ws_url = Self::parse_url(chain_raw.ws_url.as_str())?;
        Ok(ChainConfig {
            name: chain_raw.name.clone(),
            chain_id: chain_raw.chain_id.try_into()?,
            rpc_url,
            ws_url,
        })
    }

    fn create_ccmm_config(ccmm_raw: &CCMMConfigRaw) -> Result<CCMMConfig> {
        Ok(CCMMConfig {
            address: Self::parse_address(&ccmm_raw.address, "ccmm_address")?,
            base_token: Self::parse_address(&ccmm_raw.base_token, "base_token")?,
            quote_token: Self::parse_address(&ccmm_raw.quote_token, "quote_token")?,
        })
    }

    fn parse_url(url: &str) -> Result<String> {
        if url.starts_with('$') {
            Ok(
                env::var(url.trim_start_matches('$')).context(ConfigError::FieldNotFound(
                    String::from("URL from ENV variable"),
                    url.to_string(),
                ))?,
            )
        } else {
            Ok(String::from(url))
        }
    }

    fn parse_address(address: &str, field_name: &str) -> Result<Address> {
        address
            .parse::<Address>()
            .context(ConfigError::FailedParseAddress(
                field_name.to_string(),
                address.to_string(),
            ))
    }
}
