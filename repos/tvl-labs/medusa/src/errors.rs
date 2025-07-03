use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};
use thiserror::Error;

pub type Result<T, E> = std::result::Result<T, E>;

#[derive(Error, Debug)]
pub enum MedusaErrors {
    #[error("network error")]
    Network(#[from] reqwest::Error),
    #[error("database error")]
    Database(#[from] sqlx::Error),
    #[error("bad request")]
    BadRequest,
}

impl IntoResponse for MedusaErrors {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            MedusaErrors::Network(_) => (StatusCode::BAD_GATEWAY, "Network error."),
            MedusaErrors::Database(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Database error."),
            MedusaErrors::BadRequest => (StatusCode::BAD_REQUEST, "Bad request."),
        };
        let body = axum::Json(serde_json::json!({ "error": error_message }));
        (status, body).into_response()
    }
}
