pub mod db;
mod error;
pub mod migrations;
mod traits;

pub use db::{StorageService, StorageServiceOptions, connect, on_db, on_pool};
pub use error::StorageError;
#[cfg(feature = "test-with-postgres")]
pub use sqlx::PgPool as DbPool;
#[cfg(all(feature = "sqlite", not(feature = "test-with-postgres")))]
pub use sqlx::SqlitePool as DbPool;
pub use traits::StorageServiceTrait;

#[cfg(test)]
mod tests;
