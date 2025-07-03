use sea_orm::prelude::*;
use sea_orm::{DerivePartialModel, FromQueryResult};

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, DeriveEntityModel)]
#[sea_orm(table_name = "solution")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[sea_orm(unique)]
    pub solution_hash: Vec<u8>,
    /// BCS encoding of signed solutions.
    pub solution_bytes: Vec<u8>,
    pub solver: Vec<u8>,
    pub tx_hash: Vec<u8>,
    pub is_tx_success: bool,
    pub timestamp: i64,
}

#[derive(DerivePartialModel, FromQueryResult)]
#[sea_orm(entity = "Entity")]
pub struct OnlySolutionBytes {
    /// BCS encoding of signed solutions.
    pub solution_bytes: Vec<u8>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
