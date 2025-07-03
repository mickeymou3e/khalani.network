use sea_orm::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, DeriveEntityModel)]
#[sea_orm(table_name = "solver")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub address: Vec<u8>,
    pub is_authorized: bool,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
