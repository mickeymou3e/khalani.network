use std::{collections::HashMap, path::PathBuf, sync::Arc};

use anyhow::{anyhow, Context as _, Result};
use clap::Parser;
use ethers::{
    providers::{Http, Provider},
    types::{Address, Bytes},
    utils::{Anvil, AnvilInstance},
};
use futures::{channel::oneshot, prelude::*, stream::SelectAll};
use serde::Deserialize;

// Generated with `forge bind --module --select TestIsm --select Mailbox` in hyperlane-monorepo/solidity.
mod bindings;
use bindings::{
    mailbox::{DispatchFilter, Mailbox},
    test_ism::TestIsm,
};

#[derive(Deserialize)]
struct Config {
    hub: Chain,
    spokes: HashMap<String, Chain>,
}

#[derive(Deserialize)]
struct Chain {
    name: Option<String>,
    rpc: String,
    port: u16,
    mailbox: Address,
    sender: Address,
}

/// Fork chains and relay messages between their hyperlane mailboxes.
#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Config file path.
    #[clap(short, long, default_value = "config/local.toml")]
    config: PathBuf,
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<()> {
    let args = Args::parse();

    let config: Config =
        toml::from_str(&std::fs::read_to_string(args.config).context("reading config file")?)
            .context("parsing config file")?;

    let (ready_tx, _ready_rx) = oneshot::channel();
    run(config, ready_tx).await?;
    println!("relay task unexpectedly finished, exiting");

    Ok(())
}

async fn run(config: Config, ready: oneshot::Sender<()>) -> Result<()> {
    let hub_name = config.hub.name.as_deref().unwrap_or("hub");

    println!("forking hub chain {}", hub_name);
    let (ha, hp) = fork(&config.hub.rpc, config.hub.port, config.hub.sender).await?;
    println!("overriding default ism for {} mailbox", hub_name);
    let hm = Mailbox::new(config.hub.mailbox, hp.clone());
    override_ism(&hm).await.context("override default ism")?;

    let mut anvils = vec![ha];
    let mut mailboxes = vec![(hub_name.to_string(), hm)];

    for (name, s) in config.spokes {
        let spoke_name = s.name.unwrap_or(name);
        println!("forking spoke chain {}", spoke_name);
        let (sa, sp) = fork(&s.rpc, s.port, s.sender).await?;
        println!("overriding default ism for {} mailbox", spoke_name);
        let sm = Mailbox::new(s.mailbox, sp.clone());
        override_ism(&sm).await.context("override default ism")?;
        anvils.push(sa);
        mailboxes.push((spoke_name, sm));
    }

    relay_all(mailboxes, ready).await?;

    Ok(())
}

async fn fork(
    rpc: &str,
    port: u16,
    sender: Address,
) -> Result<(AnvilInstance, Arc<Provider<Http>>)> {
    let fork = Anvil::new()
        .fork(rpc)
        .port(port)
        .timeout(30_000_u64)
        .spawn();
    let provider = Arc::new(
        Provider::<Http>::try_from(format!("http://127.0.0.1:{port}"))?.with_sender(sender),
    );
    provider
        .request("anvil_autoImpersonateAccount", [true])
        .await?;
    Ok((fork, provider))
}

async fn override_ism(mailbox: &Mailbox<Provider<Http>>) -> Result<()> {
    let owner = mailbox.owner().call().await?;

    let test_ism = TestIsm::deploy(mailbox.client(), /* required_metadata */ Bytes::new())?
        .legacy()
        .send()
        .await
        .context("deploy TestIsm")?;

    mailbox
        .set_default_ism(test_ism.address())
        .from(owner)
        // Workaround axon rpc response problem estimating gas price.
        .legacy()
        .send()
        .await
        .context("setDefaultIsm")?;

    Ok(())
}

/// Relay messages between these mailboxes.
async fn relay_all(
    mailboxes: Vec<(String, Mailbox<Provider<Http>>)>,
    ready: oneshot::Sender<()>,
) -> Result<()> {
    // Domain -> mailbox.
    let mut domain_mailbox_map = HashMap::with_capacity(mailboxes.len());
    for (n, m) in &mailboxes {
        let d = m.local_domain().await?;
        println!("{d}: {n}");
        domain_mailbox_map.insert(d, (&**n, m));
    }

    let events: Vec<_> = mailboxes
        .iter()
        .map(|(n, m)| (&**n, m.event::<DispatchFilter>()))
        .collect();
    // This is a stream of (source_chain_name, Result<dispatch_event>).
    let mut stream_all = SelectAll::new();
    for (n, e) in &events {
        stream_all.push(Box::pin(e.stream().await?.map(|e| (*n, e))));
    }

    println!("relaying");
    _ = ready.send(());

    while let Some((source, e)) = stream_all.next().await {
        let e: DispatchFilter = e.with_context(|| format!("getting event from {source}"))?;
        // Relay by destination.
        let Some((dest, m)) = domain_mailbox_map.get(&e.destination) else {
            continue;
        };
        println!("relaying {source} -> {dest}: {}", e.message);
        match m
            .process(Bytes::new(), e.message)
            .legacy()
            .send()
            .await
            .map_err(|e| {
                if let Some(r) = e.decode_revert::<String>() {
                    anyhow!("process call reverted: {r}")
                } else {
                    anyhow!(e)
                }
            }) {
            Err(e) => {
                println!("{e}");
            }
            Ok(t) => {
                println!("relayed: {:#x}", t.tx_hash());
            }
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use std::time::Duration;

    use bindings_khalani::gmp_intent_event_verifier::GMPIntentEventVerifier;

    use super::*;

    // This needs the environment vairable SEPOLIA_RPC_URL.
    #[tokio::test]
    async fn test_local_dev_env_hyperlane() -> Result<()> {
        let mut c: Config = toml::from_str(include_str!("../../config/local.toml.example"))?;
        c.spokes.get_mut("sepolia").unwrap().rpc = std::env::var("SEPOLIA_RPC_URL")
            .context("reading environment variable SEPOLIA_RPC_URL")?;

        let sender = c.hub.sender;
        let k = format!("http://127.0.0.1:{}", c.hub.port);
        let s = format!("http://127.0.0.1:{}", c.spokes["sepolia"].port);
        let km = c.hub.mailbox;
        let sm = c.spokes["sepolia"].mailbox;

        let (ready_tx, ready_rx) = oneshot::channel();
        let h = tokio::spawn(async move { run(c, ready_tx).await });
        match ready_rx.await {
            Ok(()) => (),
            Err(_) => {
                h.await??;
                return Ok(());
            }
        }

        let kp = Arc::new(Provider::<Http>::try_from(&k).unwrap().with_sender(sender));
        let sp = Arc::new(Provider::<Http>::try_from(&s).unwrap().with_sender(sender));

        let km = Mailbox::new(km, kp.clone());
        let sm = Mailbox::new(sm, sp);

        let verifier = GMPIntentEventVerifier::deploy(kp.clone(), ())
            .context("deploy verifier")?
            .legacy()
            .send()
            .await?;
        verifier
            .initialise(sm.local_domain().await?, km.address())
            .legacy()
            .send()
            .await?;
        verifier
            .add_event_registerer(sender)
            .legacy()
            .send()
            .await?;
        let verifier_addr = {
            let mut out = [0u8; 32];
            out[12..].copy_from_slice(&verifier.address()[..]);
            out
        };
        sm.dispatch(km.local_domain().await?, verifier_addr, [7; 32].into())
            .send()
            .await?;
        sm.dispatch(km.local_domain().await?, verifier_addr, [9; 32].into())
            .send()
            .await?;
        while !verifier.verify([7; 32]).await? {
            println!("Waiting for proof");
            tokio::time::sleep(Duration::from_secs(1)).await;
        }
        while !verifier.verify([9; 32]).await? {
            println!("Waiting for proof");
            tokio::time::sleep(Duration::from_secs(1)).await;
        }

        Ok(())
    }
}
