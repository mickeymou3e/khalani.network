use std::fmt::Debug;

use mirax_codec::{Bcs, BinaryCodec as _};
use serde::{de::DeserializeOwned, Serialize};

use crate::{
    BlockEnvelope, CellDep, CellInput, CellOutput, Certificate, Header, OutPoint, Script,
    Transaction, TransactionBatch, TransactionChunk,
};

#[test]
fn test_codec() {
    inner_test_codec(Header::random());
    inner_test_codec(BlockEnvelope::random());

    inner_test_codec(CellDep::random(0));
    inner_test_codec(CellDep::random(1));
    inner_test_codec(OutPoint::random());
    inner_test_codec(CellInput::random());
    inner_test_codec(CellOutput::random(false, None));
    inner_test_codec(CellOutput::random(true, None));
    inner_test_codec(CellOutput::random(false, Some(false)));
    inner_test_codec(CellOutput::random(true, Some(false)));
    inner_test_codec(CellOutput::random(false, Some(true)));
    inner_test_codec(CellOutput::random(true, Some(true)));

    inner_test_codec(TransactionBatch::random());
    inner_test_codec(Certificate::random());
    inner_test_codec(TransactionChunk::random());

    inner_test_codec(Script::random(false));
    inner_test_codec(Script::random(true));

    inner_test_codec(Transaction::random(0));
}

fn inner_test_codec<T: Serialize + DeserializeOwned + Debug + Eq>(origin: T) {
    let encoded = Bcs::encode(&origin).unwrap();
    let decoded = Bcs::decode(&encoded).unwrap();
    assert_eq!(origin, decoded);
}
