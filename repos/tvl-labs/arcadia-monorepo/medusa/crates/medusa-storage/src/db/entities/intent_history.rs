use medusa_types::{B256, IntentErrorType, IntentHistory};
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, DeriveEntityModel)]
#[sea_orm(table_name = "intent_history")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: i64,
    #[sea_orm(unique)]
    pub intent_hash: Vec<u8>,
    pub publish_timestamp: Option<i64>,
    pub publish_tx_hash: Option<Vec<u8>>,
    pub solve_timestamp: Option<i64>,
    pub solve_tx_hash: Option<Vec<u8>>,
    pub redeem_timestamp: Option<i64>,
    pub redeem_tx_hash: Option<Vec<u8>>,
    pub withdraw_timestamp: Option<i64>,
    pub withdraw_tx_hash: Option<Vec<u8>>,
    pub withdraw_to_spoke_timestamp: Option<i64>,
    pub cancel_timestamp: Option<i64>,
    pub cancel_tx_hash: Option<Vec<u8>>,
    pub remaining_intent_id: Option<Vec<u8>>,
    pub error_timestamp: Option<i64>,
    pub error_tx_hash: Option<Vec<u8>>,
    pub error_type: Option<i16>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::intent::Entity",
        from = "Column::Id",
        to = "super::intent::Column::Id"
    )]
    Intent,
}

impl Related<super::intent::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Intent.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

impl From<Model> for IntentHistory {
    fn from(model: Model) -> Self {
        IntentHistory {
            publish_timestamp: model.publish_timestamp.map(|t| t as u64),
            publish_tx_hash: model.publish_tx_hash.map(|hash| B256::from_slice(&hash)),
            solve_timestamp: model.solve_timestamp.map(|t| t as u64),
            solve_tx_hash: model.solve_tx_hash.map(|hash| B256::from_slice(&hash)),
            redeem_timestamp: model.redeem_timestamp.map(|t| t as u64),
            redeem_tx_hash: model.redeem_tx_hash.map(|hash| B256::from_slice(&hash)),
            withdraw_timestamp: model.withdraw_timestamp.map(|t| t as u64),
            withdraw_tx_hash: model.withdraw_tx_hash.map(|hash| B256::from_slice(&hash)),
            withdraw_to_spoke_timestamp: model.withdraw_to_spoke_timestamp.map(|t| t as u64),
            cancel_timestamp: model.cancel_timestamp.map(|t| t as u64),
            cancel_tx_hash: model.cancel_tx_hash.map(|hash| B256::from_slice(&hash)),
            remaining_intent_id: model
                .remaining_intent_id
                .map(|hash| B256::from_slice(&hash)),
            error_timestamp: model.error_timestamp.map(|t| t as u64),
            error_tx_hash: model.error_tx_hash.map(|hash| B256::from_slice(&hash)),
            error_type: model.error_type.map(|e| IntentErrorType::from(e as u8)),
        }
    }
}
