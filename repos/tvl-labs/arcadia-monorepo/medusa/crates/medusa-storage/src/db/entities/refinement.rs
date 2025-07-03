use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, DeriveEntityModel)]
#[sea_orm(table_name = "refinement")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub intent_id: Vec<u8>,
    /// BCS encoding of RefinementStatus.
    pub refinement: Option<Vec<u8>>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
