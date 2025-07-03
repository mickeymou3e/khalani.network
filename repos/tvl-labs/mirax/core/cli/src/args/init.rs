use clap::Parser;
use tokio::runtime::Builder as RuntimeBuilder;

use mirax_chain::{launch::MiraxLauncher, ChainLauncher as _};
use mirax_config::MiraxConfig;
use mirax_spec::MiraxSpec;
use mirax_types::{MiraxResult, MiraxVersion};

use crate::args::{register_logger, CliArgs};

#[derive(Parser, Debug)]
#[command(about = "Initialize new mirax data directory")]
pub struct InitArgs {
    #[arg(
        short = 'c',
        long = "config",
        value_name = "CONFIG_FILE",
        help = "File path of client configurations."
    )]
    pub config: MiraxConfig,

    #[arg(
        short = 's',
        long = "spec",
        value_name = "SPEC_FILE",
        help = "File path of client node spec."
    )]
    pub spec: MiraxSpec,
}

impl CliArgs for InitArgs {
    fn execute(self, version: &MiraxVersion) -> MiraxResult<()> {
        register_logger(&self.config.logger);
        let mut launcher = MiraxLauncher::new(self.spec, self.config)?;

        let rt = RuntimeBuilder::new_multi_thread()
            .enable_all()
            .build()
            .expect("new tokio runtime");
        rt.block_on(launcher.init(version.clone()))?;

        Ok(())
    }
}
