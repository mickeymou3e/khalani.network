#![allow(non_snake_case)]

mod api;
mod contract;

use std::net::SocketAddr;
use std::time::Duration;

use anyhow::Result;
pub use api::*;
use axum::Router;
use axum::http::header::CONTENT_TYPE;
use axum::response::IntoResponse;
pub use contract::*;
use prometheus::{Encoder, TextEncoder};
use tokio::net::TcpListener;

// TODO: inline and remove.
pub fn duration_to_sec(d: Duration) -> f64 {
    d.as_secs_f64()
}

pub fn encode_metrics() -> Result<Vec<u8>> {
    let metric_families = prometheus::gather();

    let encoder = TextEncoder::new();
    let mut encoded_metrics = vec![];
    encoder.encode(&metric_families, &mut encoded_metrics)?;

    Ok(encoded_metrics)
}

pub fn run_metrics_server(metrics_addr: SocketAddr) -> tokio::task::JoinHandle<()> {
    tokio::spawn(async move {
        let router = Router::new().route("/metrics", axum::routing::get(get_metrics));
        let listener = TcpListener::bind(metrics_addr).await.unwrap();
        axum::serve(listener, router.into_make_service())
            .await
            .unwrap();
    })
}

async fn get_metrics() -> impl IntoResponse {
    match encode_metrics() {
        // Prometheus v3 expects a correct content type header.
        Ok(body) => Ok(([(CONTENT_TYPE, "text/plain; version=0.0.4")], body)),
        Err(e) => Err(e.to_string()),
    }
}
