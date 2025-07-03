use std::collections::HashMap;
use std::path::PathBuf;

use serde::Deserialize;
use serde::Serialize;

const MB: u64 = 1024 * 1024;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct LoggerConfig {
    pub filter: String,
    pub log_path: Option<PathBuf>,
    #[serde(default = "default_true")]
    pub log_to_console: bool,
    #[serde(default = "default_true")]
    pub console_show_file_and_line: bool,
    #[serde(default = "default_true")]
    pub metrics: bool,
    #[serde(default = "default_file_size_limit")]
    pub file_size_limit: u64,
    #[serde(default)]
    pub modules_level: HashMap<String, String>,
}

fn default_true() -> bool {
    true
}

fn default_file_size_limit() -> u64 {
    512 * MB
}
