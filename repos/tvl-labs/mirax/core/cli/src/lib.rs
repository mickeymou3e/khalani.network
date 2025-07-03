mod args;
mod error;

use clap::{CommandFactory as _, FromArgMatches as _, Parser, Subcommand};
use mirax_types::{MiraxResult, MiraxVersion};

use crate::args::{init::InitArgs, keypair::KeyPairArgs, run::RunArgs, CliArgs as _};

#[derive(Subcommand, Debug)]
enum Commands {
    Init(InitArgs),
    #[command(name = "generate-keypair")]
    GenerateKeyPair(KeyPairArgs),
    Run(RunArgs),
}

pub struct MiraxCli {
    version: MiraxVersion,
    cli: InnerCli,
}

impl MiraxCli {
    pub fn init(version: MiraxVersion) -> Self {
        let cmd = InnerCli::command().version(version.to_string());
        let cli = InnerCli::from_arg_matches(&cmd.get_matches()).unwrap();

        Self { version, cli }
    }

    pub fn start(self) -> MiraxResult<()> {
        match self.cli.command {
            Commands::GenerateKeyPair(args) => args.execute(&self.version),
            Commands::Init(args) => args.execute(&self.version),
            Commands::Run(args) => args.execute(&self.version),
        }
    }
}

#[derive(Parser, Debug)]
struct InnerCli {
    #[clap(subcommand)]
    command: Commands,
}
