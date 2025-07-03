use crate::config::chain::chain_name_to_id;
use crate::config::Config;
use anyhow::{Context, Result};

use clap::Parser;
use ethers::prelude::Signer;
use ethers::signers::{AwsSigner, LocalWallet};
use rusoto_core::{
    credential::ChainProvider as AwsChainProvider, region::Region as AwsRegion,
    request::HttpClient as AwsHttpClient, Client as AwsClient,
};
use rusoto_kms::KmsClient;
use tracing::info;

use super::wallet::WalletSigner;

#[derive(Parser, Debug)]
pub struct Args {
    // TODO: move to the config file too.
    /// Private key for sending txs.
    #[arg(long)]
    pub private_key: Option<String>,
    /// KMS ID or alias
    #[arg(long)]
    pub kms_id: Option<String>,
    /// Chain name
    #[arg(long, requires = "kms_id")]
    pub chain_name: Option<String>,

    #[arg(long)]
    pub config_file: String,
}

impl Args {
    pub async fn get_config_and_wallet() -> Result<(Config, WalletSigner)> {
        let args = Args::parse();

        let config =
            Config::read_config(args.config_file.as_str()).context("Failed to read config file")?;
        info!(?config, "Config");

        let wallet_signer = match (args.private_key, args.kms_id) {
            (Some(private_key), None) => {
                let wallet = private_key
                    .parse::<LocalWallet>()
                    .expect("Failed to parse private key");
                WalletSigner::Local(wallet)
            }
            (None, Some(kms_id)) => {
                let client =
                    AwsClient::new_with(AwsChainProvider::default(), AwsHttpClient::new().unwrap());

                let kms = KmsClient::new_with_client(client, AwsRegion::default());
                let chain_id = args
                    .chain_name
                    .as_deref()
                    .map(chain_name_to_id)
                    .transpose()?
                    .unwrap_or_default();
                let signer = AwsSigner::new(kms, kms_id, chain_id)
                    .await
                    .expect("Failed to create AWS signer");
                WalletSigner::Aws(signer)
            }
            _ => panic!("Either private_key or kms_id must be provided, but not both"),
        };

        let address = wallet_signer.address();
        info!(?address, "Solver address");

        Ok((config, wallet_signer))
    }
}
