use clap::Parser;
use tokio::runtime::Builder as RuntimeBuilder;

use mirax_chain::{control::MiraxChain, ChainController as _};
use mirax_config::MiraxConfig;
use mirax_spec::MiraxSpec;
use mirax_types::{MiraxResult, MiraxVersion};

use crate::args::{register_logger, CliArgs};

#[derive(Parser, Debug)]
#[command(about = "Run Mirax node")]
pub struct RunArgs {
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

impl CliArgs for RunArgs {
    fn execute(self, _version: &MiraxVersion) -> MiraxResult<()> {
        // Todo: check version compatibility

        register_logger(&self.config.logger);

        let rt = RuntimeBuilder::new_multi_thread()
            .enable_all()
            .build()
            .expect("new tokio runtime");
        rt.block_on(async {
            if let Err(e) = self.run().await {
                panic!("Panic: {:?}", e);
            }
        });
        rt.shutdown_timeout(std::time::Duration::from_secs(1));

        Ok(())
    }
}

impl RunArgs {
    async fn run(&self) -> MiraxResult<()> {
        MiraxChain::new(self.spec.clone(), self.config.clone())
            .await?
            .run()
            .await
    }
}
