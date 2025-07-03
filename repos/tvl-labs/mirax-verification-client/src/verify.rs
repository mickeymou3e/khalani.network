use anyhow::{Result, bail};
use reqwest::Client;
use serde::{Deserialize, Serialize};

use crate::{Context, Transaction};

#[derive(Serialize)]
struct VerifyRequest<'a> {
    context: &'a Context,
    transaction: &'a Transaction,
}

#[derive(Deserialize, Debug)]
pub struct RunResult {
    pub ok: bool,
    pub status: Option<i32>,
    pub signal: Option<i32>,
    pub stdout: String,
    pub stderr: String,
}

impl RunResult {
    pub fn err_for_status(&self) -> Result<()> {
        if self.ok {
            Ok(())
        } else if self.status.is_some() {
            bail!("failed with status {}", self.status.unwrap());
        } else if self.signal.is_some() {
            bail!("failed with signal {}", self.signal.unwrap());
        } else {
            bail!("failed");
        }
    }
}

pub const AXI_PLAYGROUND_API_URL: &str = "https://axi-playground-api-ski9a.ondigitalocean.app";

pub async fn verify(client: &Client, ctx: &Context, tx: &Transaction) -> Result<RunResult> {
    verify_at(client, AXI_PLAYGROUND_API_URL, ctx, tx).await
}

pub async fn verify_at(
    client: &Client,
    base_url: &str,
    ctx: &Context,
    tx: &Transaction,
) -> Result<RunResult> {
    let r = client
        .post(format!("{}/verify", base_url))
        .json(&VerifyRequest {
            context: ctx,
            transaction: tx,
        })
        .send()
        .await?;

    if !r.status().is_success() {
        let status = r.status();
        let body = r.text().await?;
        bail!("Request failed with status {}: {}", status, body);
    }

    Ok(r.json().await?)
}
