use mirax_types::{H256, Transaction};

macro_rules! def_graphql_types {
    ($name: ident, $inner_type: ty) => {
        #[derive(serde::Serialize, serde::Deserialize)]
        pub struct $name(pub $inner_type);
        async_graphql::scalar!($name);
    };
}

def_graphql_types!(TxHash, H256);
def_graphql_types!(MiraxTransaction, Transaction);
