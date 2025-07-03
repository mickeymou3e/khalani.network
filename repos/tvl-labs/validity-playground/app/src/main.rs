#![allow(dead_code)]
// #[macro_use]
// extern crate lazy_static;
pub(crate) mod vdy_sandbox;
mod output;
mod server;
use std::{env, net::SocketAddr, path::PathBuf};
const DEFAULT_ADDRESS: &str = "127.0.0.1";
const DEFAULT_PORT: u16 = 3000;
const DEFAULT_VDY_FILE_PATH: &str = "/temp-vdy-files";
pub struct Config {
    address: String,
    port: u16,
    vdy_file_path: PathBuf,
}

impl Config {
    fn addr(&self) -> SocketAddr {
        let addr = self
            .address
            .parse()
            .expect("Unable to parse socket address");
        SocketAddr::new(addr, self.port)
    }
}

impl Default for Config {
    fn default() -> Self {
        Self {
            address: DEFAULT_ADDRESS.to_string(),
            port: DEFAULT_PORT,
            vdy_file_path: PathBuf::from(DEFAULT_VDY_FILE_PATH),
        }
    }
}

fn main() {
    let port: u16 = match std::env::var("VDY_PORT") {
        Ok(p) => p.parse().unwrap(),
        Err(_) => DEFAULT_PORT
    };
    println!("Running on port {}", port);
    let config = Config {
        vdy_file_path: PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("temp-vdy-files"),
        port,
        ..Default::default()
    };

    server::serve(config);
}
