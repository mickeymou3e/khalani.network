use medusa_types::{Address, B256, Intent, IntentState, Signature, SignedIntent, U256};
use sea_orm::entity::prelude::*;
use sea_orm::{ActiveValue, IntoActiveModel};

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, DeriveEntityModel)]
#[sea_orm(table_name = "intent")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[sea_orm(unique)]
    pub intent_id: Vec<u8>,
    pub author: Vec<u8>,
    pub ttl: Vec<u8>,
    pub ttl_i64: i64,
    pub nonce: Vec<u8>,
    pub src_m_token: Vec<u8>,
    pub src_amount: Vec<u8>,
    pub outcome: Vec<u8>,
    pub signature: Option<Vec<u8>>,
    pub is_active: bool,
    // If we use i8, sea-orm will use char, and it doesn't work.
    pub status: i16,
    pub solution_hash: Option<Vec<u8>>,
    pub tx_hash: Option<Vec<u8>>,
    pub is_tx_success: bool,
    pub timestamp: i64,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::solution::Entity",
        from = "Column::SolutionHash",
        to = "super::solution::Column::SolutionHash"
    )]
    Solution,
    #[sea_orm(has_one = "super::intent_history::Entity")]
    History,
}

impl Related<super::intent_history::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::History.def()
    }
}

impl Related<super::solution::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Solution.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

impl From<Model> for Intent {
    fn from(model: Model) -> Self {
        Intent {
            author: Address::from_slice(&model.author),
            ttl: U256::from_be_slice(&model.ttl),
            nonce: U256::from_be_slice(&model.nonce),
            src_m_token: Address::from_slice(&model.src_m_token),
            src_amount: U256::from_be_slice(&model.src_amount),
            outcome: bcs::from_bytes(&model.outcome).unwrap(),
        }
    }
}

impl From<Model> for SignedIntent {
    fn from(model: Model) -> Self {
        SignedIntent {
            signature: Signature::from_raw(model.signature.as_deref().unwrap()).unwrap(),
            intent: model.into(),
        }
    }
}

impl ActiveModel {
    /// Create a new intent active model from an intent.
    ///
    /// The model will be open and active.
    pub fn from_intent(
        intent: &Intent,
        signature: Option<Signature>,
        tx_hash: Option<B256>,
        timestamp: i64,
    ) -> Self {
        let intent_id = intent.intent_id().to_vec();
        let mut am = Model {
            id: 0,
            intent_id,
            author: intent.author.to_vec(),
            ttl: intent.ttl.to_be_bytes_vec(),
            ttl_i64: intent.ttl.saturating_to(),
            nonce: intent.nonce.to_be_bytes_vec(),
            src_m_token: intent.src_m_token.to_vec(),
            src_amount: intent.src_amount.to_be_bytes_vec(),
            outcome: bcs::to_bytes(&intent.outcome).unwrap(),
            signature: signature.map(|sig| sig.as_bytes().to_vec()),
            is_active: true,
            status: IntentState::Open as i16,
            solution_hash: None,
            is_tx_success: tx_hash.is_some(),
            tx_hash: tx_hash.map(|hash| hash.to_vec()),
            timestamp,
        }
        .into_active_model();
        am.id = ActiveValue::NotSet;
        am
    }
}
