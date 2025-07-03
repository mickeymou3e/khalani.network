use anyhow::{Context, Result};
use ariadne::Source;
use axi_core_semantics::interpreter::Interpreter;
use axi_parser::{lex::lexer, parser::stmts_all};
use clap::Parser;

#[derive(Parser)]
struct Cli {
    #[clap(long)]
    ast_only: bool,
    #[cfg(feature = "sandbox")]
    #[clap(long)]
    no_sandbox: bool,
    input: String,
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    let input = std::fs::read_to_string(&cli.input).context("reading input file")?;

    // Setup seccomp filter after reading the input so that we don't need to allow open/read/etc.
    #[cfg(feature = "sandbox")]
    if !cli.no_sandbox {
        setup_seccomp_sandbox().context("setting up seccomp sandbox")?;
    }

    let r = stmts_all(lexer(&input));

    let mut source = Source::from(&*input);

    let p = match r {
        Ok(p) => p,
        Err(e) => {
            e.as_ariadne_report(input.len()).eprint(&mut source)?;
            std::process::exit(1);
        }
    };

    if cli.ast_only {
        println!("{p:#?}");
        return Ok(());
    }

    let mut i = Interpreter::new_with_builtins();

    for stmt in p {
        match i.interpret_top(stmt) {
            Ok(r) => println!("Result: {r:?}"),
            Err(e) => {
                e.as_ariadne_report().eprint(&mut source)?;
                std::process::exit(1);
            }
        }
    }

    Ok(())
}

#[cfg(feature = "sandbox")]
fn setup_seccomp_sandbox() -> Result<()> {
    use seccompiler::*;

    let filter: BpfProgram = SeccompFilter::new(
        [
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
