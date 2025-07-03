use serde::{Deserialize, Serialize};
use sqlx::Type;

// #[derive(Serialize, Deserialize, Debug)]
#[derive(Type, Debug, Deserialize)]
#[sqlx(type_name = "quote_type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum QuoteType {
    ExactInput,
    ExactOutput,
}

#[derive(Type, Debug, Deserialize)]
pub struct QuoteRequest {
    pub token_in_chain_id: i32,
    pub token_out_chain_id: i32,
    pub request_id: String,
    pub quote_id: String,
    pub token_in: String,
    pub token_out: String,
    pub amount: String,
    pub swapper: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct QuoteResponse {
    pub chain_id: i32,
    pub request_id: String,
    pub quote_id: String,
    pub token_in: String,
    pub amount_in: String,
    pub token_out: String,
    pub amount_out: String,
    pub filler: String,
}
