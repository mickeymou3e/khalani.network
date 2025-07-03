use std::{fs::File, io::Write, path::PathBuf};

use clap::Parser;
use serde::{Serialize, Serializer};

use mirax_crypto::{
    ed25519::{Ed25519PrivateKey, Ed25519PublicKey},
    PrivateKey, PublicKey,
};
use mirax_types::{Bytes, MiraxResult, MiraxVersion};

use crate::{args::CliArgs, error::CliError};

#[derive(Parser, Debug)]
#[command(about = "Generate key pairs for mirax blockchain.")]
pub struct KeyPairArgs {
    #[arg(
        short = 'n',
        long = "number",
        value_name = "NUMBER",
        help = "The number of key pairs to generate.",
        default_value = "1"
    )]
    pub num: usize,
    #[arg(
        short = 'p',
        long = "path",
        value_name = "PRIVATE_KEY_PATH",
        help = "The path to store the generated private key binary."
    )]
    pub path: PathBuf,
}

impl CliArgs for KeyPairArgs {
    fn execute(self, _version: &MiraxVersion) -> MiraxResult<()> {
        let mut key_pairs = Vec::with_capacity(self.num);

        for i in 0..self.num {
            let key_pair = KeyPair::generate(i);
            self.write_private_keys(&key_pair.private_key.as_bytes(), i)?;
            key_pairs.push(key_pair);
        }

        println!(
            "{}",
            serde_json::to_string_pretty(&Output(key_pairs)).unwrap()
        );

        Ok(())
    }
}

impl KeyPairArgs {
    fn write_private_keys(&self, private_key: &Bytes, index: usize) -> MiraxResult<()> {
        let mut file_path = self.path.clone();
        file_path.push(format!("private_key_{}.key", index));

        File::create(file_path)
            .map_err(CliError::from)?
            .write_all(private_key)
            .map_err(CliError::from)?;

        Ok(())
    }
}

#[derive(Serialize, Clone, Debug)]
pub struct KeyPair {
    pub index: usize,
    #[serde(serialize_with = "serialize_private_key")]
    pub private_key: Ed25519PrivateKey,
    #[serde(serialize_with = "serialize_public_key")]
    pub public_key: Ed25519PublicKey,
}

impl KeyPair {
    pub fn generate(index: usize) -> Self {
        let mut rng = rand::thread_rng();
        let private_key = Ed25519PrivateKey::generate(&mut rng);
        let public_key = private_key.public_key();

        Self {
            index,
            private_key,
            public_key,
        }
    }
}

#[derive(Serialize, Debug)]
struct Output(Vec<KeyPair>);

fn serialize_private_key<S: Serializer, P: PrivateKey>(key: &P, s: S) -> Result<S::Ok, S::Error> {
    key.as_bytes().encode_hex().serialize(s)
}

fn serialize_public_key<S: Serializer, P: PublicKey>(key: &P, s: S) -> Result<S::Ok, S::Error> {
    key.as_bytes().encode_hex().serialize(s)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_key_pair() {
        let key_pair = KeyPair::generate(0);
        let value = serde_json::to_value(&key_pair).unwrap();

        println!(
            "{}",
            serde_json::to_string_pretty(&Output(vec![key_pair.clone()])).unwrap()
        );

        assert!(value.is_object());
        let obj = value.as_object().cloned().unwrap();

        assert_eq!(obj.get("index").unwrap(), 0);
        assert_eq!(
            Bytes::decode_hex(obj.get("private_key").unwrap().as_str().unwrap()).unwrap(),
            key_pair.private_key.as_bytes()
        );
        assert_eq!(
            Bytes::decode_hex(obj.get("public_key").unwrap().as_str().unwrap()).unwrap(),
            key_pair.public_key.as_bytes()
        );
    }
}
