use anyhow::{Context, Result};
use axi_playground_api::json::JsonContext;
use mirax_types::Transaction;
use mirax_verification::{AxiVerifierBuilder, TransactionVerifierBuilder};
use serde::Deserialize;

#[derive(Deserialize)]
struct VerifyRequest {
    context: JsonContext,
    transaction: Transaction,
}

fn main() -> Result<()> {
    #[cfg(feature = "sandbox")]
    {
        let no_sandbox = std::env::var("MIRAX_VERIFY_NO_SANDBOX")
            .is_ok_and(|v| v == "0" || v == "no" || v == "false");
        if !no_sandbox {
            setup_seccomp_sandbox().context("Failed to setup seccomp sandbox")?;
        }
    }

    env_logger::Builder::from_default_env()
        .filter_level(log::LevelFilter::Info)
        .init();

    let VerifyRequest {
        context,
        transaction,
    } = serde_json::from_reader(std::io::stdin()).context("Failed to read request")?;

    // Why do I need to pass the tx twice?
    let verifier = AxiVerifierBuilder::new(context.into())
        .build(&transaction)
        .context("Failed to build verifier")?;

    verifier.verify_transaction(&transaction)?;

    Ok(())
}

#[cfg(feature = "sandbox")]
fn setup_seccomp_sandbox() -> Result<()> {
    use seccompiler::*;

    let filter: BpfProgram = SeccompFilter::new(
        [
            (libc::SYS_read, vec![]),
            (libc::SYS_write, vec![]),
            (libc::SYS_writev, vec![]),
            (libc::SYS_exit_group, vec![]),
            (libc::SYS_brk, vec![]),
            (libc::SYS_mmap, vec![]),
            (libc::SYS_mprotect, vec![]),
            (libc::SYS_munmap, vec![]),
            (libc::SYS_futex, vec![]),
            // Hashmap uses getrandom.
            (libc::SYS_getrandom, vec![]),
            (libc::SYS_sigaltstack, vec![]),
        ]
        .into_iter()
        .collect(),
        SeccompAction::Errno(libc::EPERM as u32),
        SeccompAction::Allow,
        std::env::consts::ARCH
            .try_into()
            .context("unsupported target architecture for seccomp sandbox")?,
    )?
    .try_into()?;

    apply_filter(&filter)?;
    Ok(())
}
