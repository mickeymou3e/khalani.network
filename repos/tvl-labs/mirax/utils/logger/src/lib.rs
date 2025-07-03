mod date_fixed_roller;

use std::collections::HashMap;
use std::path::{Path, PathBuf};

use log::LevelFilter;
use log4rs::append::rolling_file::policy::compound::{trigger::size::SizeTrigger, CompoundPolicy};
use log4rs::append::{
    console::ConsoleAppender, file::FileAppender, rolling_file::RollingFileAppender,
};
use log4rs::config::{Appender, Config, Logger, Root};
use log4rs::encode::{json::JsonEncoder, pattern::PatternEncoder};

use crate::date_fixed_roller::DateFixedWindowRoller;

pub struct MiraxLogger {
    filter: LevelFilter,
    log_to_console: bool,
    log_to_file: bool,
    log_path: PathBuf,
    log_metrics: bool,
    console_show_file_and_line: bool,
    file_size_limit: u64,
    modules_level: HashMap<String, String>,
}

impl MiraxLogger {
    pub fn new(
        filter: String,
        log_to_console: bool,
        console_show_file_and_line: bool,
        log_to_file: bool,
        log_metrics: bool,
        log_path: PathBuf,
        file_size_limit: u64,
        modules_level: HashMap<String, String>,
    ) -> Self {
        Self {
            filter: convert_level(filter.as_ref()),
            log_to_console,
            log_to_file,
            log_path,
            log_metrics,
            console_show_file_and_line,
            file_size_limit,
            modules_level,
        }
    }

    pub fn init(self) {
        let mirax_roller_pat = self.log_path.join("{date}.mirax.{timestamp}.log");
        let metrics_roller_pat = self.log_path.join("{date}.metrics.{timestamp}.log");

        let console_appender = self.console_appender();
        let file_appender = self.file_appender(&mirax_roller_pat);
        let metrics_appender = self.metrics_file_appender(&metrics_roller_pat);
        let cli_file_appender = self.cli_file_appender();
        let metrics_logger = self.metrics_logger();
        let cli_logger = self.cli_logger();

        let mut config_builder = Config::builder()
            .appender(Appender::builder().build("console", Box::new(console_appender)))
            .appender(Appender::builder().build("file", Box::new(file_appender)))
            .appender(Appender::builder().build("metrics", Box::new(metrics_appender)))
            .appender(Appender::builder().build("cli", Box::new(cli_file_appender)))
            .logger(metrics_logger)
            .logger(cli_logger);

        for (module, level) in self.modules_level.iter() {
            let module_logger = Logger::builder()
                .additive(false)
                .appender("console")
                .appender("file")
                .build(module, convert_level(level));
            config_builder = config_builder.logger(module_logger);
        }
        let config = config_builder.build(self.root()).unwrap();

        log4rs::init_config(config).expect("Init Logger");
    }

    fn console_appender(&self) -> ConsoleAppender {
        let encoder = PatternEncoder::new(if self.console_show_file_and_line {
            "[{d} {h({l})} {t} {f}:{L}] {m}{n}"
        } else {
            "[{d} {h({l})} {t}] {m}{n}"
        });

        ConsoleAppender::builder()
            .encoder(Box::new(encoder))
            .build()
    }

    fn file_appender(&self, mirax_roller_pat: &Path) -> RollingFileAppender {
        let size_trigger = SizeTrigger::new(self.file_size_limit);
        let roller = DateFixedWindowRoller::builder()
            .build(&mirax_roller_pat.to_string_lossy())
            .unwrap();
        let policy = CompoundPolicy::new(Box::new(size_trigger), Box::new(roller));

        RollingFileAppender::builder()
            .encoder(Box::new(JsonEncoder::new()))
            .build(self.log_path.join("mirax.log"), Box::new(policy))
            .unwrap()
    }

    fn cli_file_appender(&self) -> FileAppender {
        FileAppender::builder()
            .encoder(Box::new(JsonEncoder::new()))
            .build(self.log_path.join("cli.log"))
            .unwrap()
    }

    fn metrics_file_appender(&self, metrics_roller_pat: &Path) -> RollingFileAppender {
        let size_trigger = SizeTrigger::new(self.file_size_limit);
        let roller = DateFixedWindowRoller::builder()
            .build(&metrics_roller_pat.to_string_lossy())
            .unwrap();
        let policy = CompoundPolicy::new(Box::new(size_trigger), Box::new(roller));

        RollingFileAppender::builder()
            .encoder(Box::new(JsonEncoder::new()))
            .build(self.log_path.join("metrics.log"), Box::new(policy))
            .unwrap()
    }

    fn root(&self) -> Root {
        let mut root_builder = Root::builder();

        if self.log_to_console {
            root_builder = root_builder.appender("console");
        }

        if self.log_to_file {
            root_builder = root_builder.appender("file");
        }

        root_builder.build(self.filter)
    }

    fn cli_logger(&self) -> Logger {
        Logger::builder()
            .additive(false)
            .appender("cli")
            .appender("console")
            .build("cli", LevelFilter::Trace)
    }

    fn metrics_logger(&self) -> Logger {
        let metrics_level = if self.log_metrics {
            LevelFilter::Trace
        } else {
            LevelFilter::Off
        };
        Logger::builder()
            .additive(false)
            .appender("metrics")
            .build("metrics", metrics_level)
    }
}

fn convert_level(level: &str) -> LevelFilter {
    match level {
        "off" => LevelFilter::Off,
        "error" => LevelFilter::Error,
        "info" => LevelFilter::Info,
        "warn" => LevelFilter::Warn,
        "debug" => LevelFilter::Debug,
        "trace" => LevelFilter::Trace,
        f => {
            println!("Invalid logger.filter {}, use info", f);
            LevelFilter::Info
        }
    }
}
