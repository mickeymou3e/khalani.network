use super::*;
use crate::bls::{
    BlsAggregatedPublicKey, BlsAggregatedSignature, BlsPrivateKey, BlsPublicKey, BlsSignature,
};
use crate::ed25519::{Ed25519PrivateKey, Ed25519PublicKey, Ed25519Signature};
use crate::secp256k1::{
    Secp256k1PrivateKey, Secp256k1PublicKey, Secp256k1RecoverablePrivateKey,
    Secp256k1RecoverablePublicKey, Secp256k1RecoverableSignature, Secp256k1Signature,
};

macro_rules! test_signature {
    ($sk: ty, $pk: ty, $sig: ty) => {
        let private_key = <$sk>::generate(&mut rand::thread_rng());
        let public_key = private_key.public_key();
        let public_key_bytes = public_key.as_bytes();
        assert_eq!(
            public_key,
            <$pk>::try_from(public_key_bytes.as_ref()).unwrap()
        );

        let msg = H256::random();
        let signature = private_key.sign(&msg);
        let signature_bytes = signature.as_bytes();
        assert_eq!(
            signature,
            <$sig>::try_from(signature_bytes.as_ref()).unwrap()
        );
        assert!(signature.verify(&msg, &public_key).is_ok());
    };
}

#[test]
fn test_signatures() {
    test_signature!(Ed25519PrivateKey, Ed25519PublicKey, Ed25519Signature);
    test_signature!(Secp256k1PrivateKey, Secp256k1PublicKey, Secp256k1Signature);
    test_signature!(
        Secp256k1RecoverablePrivateKey,
        Secp256k1RecoverablePublicKey,
        Secp256k1RecoverableSignature
    );
}

#[test]
#[should_panic]
fn test_bls() {
    test_signature!(BlsPrivateKey, BlsPublicKey, BlsSignature);
}

#[test]
fn test_secp256k1_uncompressed_public_key() {
    let private_key = Secp256k1PrivateKey::generate(&mut rand::thread_rng());
    let public_key = private_key.public_key();
    let public_key_bytes = public_key.as_bytes_uncompressed();
    assert!(Secp256k1PublicKey::try_from(public_key_bytes.as_ref()).is_err());
}

#[test]
fn test_bls_aggregate() {
    let sk_1 = BlsPrivateKey::generate(&mut rand::thread_rng());
    let sk_2 = BlsPrivateKey::generate(&mut rand::thread_rng());
    let sk_3 = BlsPrivateKey::generate(&mut rand::thread_rng());
    let sk_4 = BlsPrivateKey::generate(&mut rand::thread_rng());

    let pk_1 = sk_1.public_key();
    let pk_2 = sk_2.public_key();
    let pk_3 = sk_3.public_key();
    let pk_4 = sk_4.public_key();

    let msg = H256::random();

    let sig_1 = sk_1.sign(&msg);
    let sig_2 = sk_2.sign(&msg);
    let sig_3 = sk_3.sign(&msg);
    let sig_4 = sk_4.sign(&msg);

    let pks = vec![pk_1, pk_2, pk_3, pk_4];
    let sigs = vec![sig_1, sig_2, sig_3, sig_4];

    let aggregate_sig = BlsAggregatedSignature::aggregate(sigs).unwrap();
    let aggregate_pk = BlsAggregatedPublicKey::aggregate(pks).unwrap();

    assert!(aggregate_sig.aggregate_verify(&msg, aggregate_pk).is_ok());
}
