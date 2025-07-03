use axum::{routing::post, Extension, Json, Router};
use dotenv::dotenv;
use sqlx::PgPool;
use std::env;
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::net::TcpListener;
mod models;
use crate::errors::*;
use models::{QuoteRequest, QuoteResponse};
use once_cell::sync::Lazy;
use std::collections::HashMap;
use tokio::sync::Mutex;
mod errors;

static WEBHOOKS: Lazy<Mutex<HashMap<String, String>>> = Lazy::new(|| Mutex::new(HashMap::new()));

#[tokio::main]
async fn main() {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPool::connect(&database_url).await.unwrap();
    let app = Router::new()
        .route("/receive_quote", post(receive_quote_request))
        .route("/post_quote", post(post_quote_response))
        .route("/register_webhook", post(register_webhook))
        .layer(axum::Extension(Arc::new(pool)));

    let addr = SocketAddr::from(([0, 0, 0, 1], 3000));
    let listener = TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}

#[axum::debug_handler]
async fn receive_quote_request(
    Extension(pool): Extension<Arc<PgPool>>,
    Json(payload): Json<QuoteRequest>,
) -> Result<Json<serde_json::Value>, MedusaErrors> {
    insert_quote_request(&payload, &pool).await?;
    Ok(Json(serde_json::json!({
        "status": "success",
        "message": "Quote request received successfully."
    })))
}

// Receives
#[axum::debug_handler]
async fn post_quote_response(
    Extension(pool): Extension<Arc<PgPool>>,
    Json(payload): Json<QuoteResponse>,
) -> Result<Json<serde_json::Value>, MedusaErrors> {
    insert_quote_response(&payload, &pool).await?;
    Ok(Json(serde_json::json!({
        "status": "success",
        "message": "Quote response received successfully."
    })))
}

async fn insert_quote_request(
    quote_request: &QuoteRequest,
    pool: &PgPool,
) -> Result<(), MedusaErrors> {
    sqlx::query!(
        "INSERT INTO quote_request (request_id, quote_id, token_in, token_out, amount, swapper) VALUES ($1, $2, $3, $4, $5, $6)",
        quote_request.request_id,
        quote_request.quote_id,
        quote_request.token_in,
        quote_request.token_out,
        quote_request.amount,
        quote_request.swapper,
    )
    .execute(pool)
    .await
    .map_err(MedusaErrors::Database)?;

    Ok(())
}

async fn insert_quote_response(
    quote_response: &QuoteResponse,
    pool: &PgPool,
) -> Result<(), MedusaErrors> {
    sqlx::query!(
        "INSERT INTO quote_response (chain_id, request_id, quote_id, token_in, amount_in, token_out, amount_out, filler) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        quote_response.chain_id,
        quote_response.request_id,
        quote_response.quote_id,
        quote_response.token_in,
        quote_response.amount_in,
        quote_response.token_out,
        quote_response.amount_out,
        quote_response.filler,
    )
    .execute(pool)
    .await
    .map_err(MedusaErrors::Database)?;

    if let Some(webhook_url) = WEBHOOKS.lock().await.get(&quote_response.request_id) {
        let client = reqwest::Client::new();
        client
            .post(webhook_url)
            .json(&quote_response)
            .send()
            .await
            .map_err(MedusaErrors::Network)?;
    }

    Ok(())
}

async fn register_webhook(
    Extension(_pool): Extension<Arc<PgPool>>,
    Json(payload): Json<HashMap<String, String>>,
) -> Result<Json<serde_json::Value>, MedusaErrors> {
    let mut webhooks = WEBHOOKS.lock().await;
    if let Some(webhook_url) = payload.get("webhook_url") {
        webhooks.insert(payload["request_id"].clone(), webhook_url.clone());
        Ok(Json(serde_json::json!({"status": "success"})))
    } else {
        Err(MedusaErrors::BadRequest)
    }
}
