#![allow(non_snake_case)]

mod api;
mod contract;

pub use api::*;
pub use contract::*;

use anyhow::Result;
use axum::Router;
use parking_lot::RwLock;
use prometheus::proto::MetricFamily;
use prometheus::{Encoder, TextEncoder};
use std::net::SocketAddr;
use std::time::Duration;
use tokio::net::TcpListener;

lazy_static::lazy_static! {
    pub static ref METRICS_BUFFER: RwLock<Vec<MetricFamily>> = RwLock::new(Vec::new());
}

pub fn duration_to_sec(d: Duration) -> f64 {
    d.as_secs_f64()
}

pub fn all_metrics() -> Result<Vec<u8>> {
    let metric_families = prometheus::gather();

    {
        let mut metrics_clone = metric_families.clone();
        let mut buf = METRICS_BUFFER.write();
        buf.append(&mut metrics_clone);
    }

    let encoder = TextEncoder::new();
    let mut encoded_metrics = vec![];
    encoder.encode(&metric_families, &mut encoded_metrics)?;

    Ok(encoded_metrics)
}

pub async fn run_prometheus_server(prometheus_listening_address: SocketAddr) {
    tokio::spawn(async move {
        let router = Router::new().route("/metrics", axum::routing::get(get_metrics));
        let listener = TcpListener::bind(prometheus_listening_address)
            .await
            .unwrap();
        axum::serve(listener, router.into_make_service())
            .await
            .unwrap();
    });
}

async fn get_metrics() -> String {
    let metrics_data = match all_metrics() {
        Ok(data) => data,
        Err(e) => e.to_string().into_bytes(),
    };

    String::from_utf8(metrics_data).unwrap()
}
