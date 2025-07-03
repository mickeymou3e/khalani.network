pub(crate) mod init;
pub(crate) mod keypair;
pub(crate) mod run;

use mirax_config::LoggerConfig;
use mirax_logger::MiraxLogger;
use mirax_types::{MiraxResult, MiraxVersion};

pub trait CliArgs {
    fn execute(self, version: &MiraxVersion) -> MiraxResult<()>;
}

fn register_logger(config: &LoggerConfig) {
    MiraxLogger::new(
        config.filter.clone(),
        config.log_to_console,
        config.log_to_console,
        config.log_path.is_some(),
        config.metrics,
        config.log_path.clone().unwrap_or_default(),
        config.file_size_limit,
        config.modules_level.clone(),
    )
    .init();
}
