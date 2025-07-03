use mirax_crypto::{
    ed25519::{Ed25519PrivateKey, Ed25519PublicKey, Ed25519Signature},
    PrivateKey,
};
use mirax_types::H256;
use zeroize::Zeroize;

#[derive(Zeroize)]
pub struct Ed25519Signer {
    private_key: Ed25519PrivateKey,
}

impl Ed25519Signer {
    pub fn new(private_key: Ed25519PrivateKey) -> Self {
        Ed25519Signer { private_key }
    }

    pub fn sign(&self, msg: &H256) -> Ed25519Signature {
        self.private_key.sign(msg)
    }

    pub fn public_key(&self) -> Ed25519PublicKey {
        self.private_key.public_key()
    }
}
