use std::cell::LazyCell;
use std::sync::Arc;
use std::time::Duration;

use anyhow::Result;
use arcadia::types::{Block, Hasher, H256};

use crate::client::RpcClient;
use crate::db::{RocksDB, COLUMN_BLOCK_NUMBER};
use crate::merkle::BinaryMerkleTree;
use crate::smt::SMT;
use crate::store::SMTStore;

const ARCADIA_BLOCK_TIME: u64 = 3000;
const LATEST_BLOCK_NUMBER_KEY: LazyCell<[u8; 32]> =
    LazyCell::new(|| Hasher::digest("latest_block_number").0);

pub struct Runner {
    db: Arc<RocksDB>,
    smt: SMT,
    client: RpcClient,
}

impl Runner {
    pub fn new(db_path: &str, url: &str) -> Self {
        let db = Arc::new(RocksDB::new_with_path(db_path).unwrap());
        let smt = SMT::new_with_store(SMTStore::new(Arc::clone(&db))).unwrap();
        let client = RpcClient::new(url);
        Runner { db, smt, client }
    }

    pub async fn run(mut self) -> Result<()> {
        eprintln!("Starting running.");
        let latest_block_number = self.get_latest_block_number()?;
        let mut chain_tip = self.get_chain_tip().await?;
        let mut number = latest_block_number + 1;
        let mut leaves = Vec::with_capacity(100);

        loop {
            if number < chain_tip {
                eprintln!("Processing block number: {}", number);
                let block = self.client.get_block_by_id(number.into()).await?.expect("block not found");

                leaves.push(calculate_leaf(&block));

                if (number + 1) % 100 == 0 {
                    self.commit_root(number, &leaves).await?;
                    leaves.clear();
                }

                number += 1;
            } else {
                tokio::time::sleep(Duration::from_millis(ARCADIA_BLOCK_TIME)).await;
                chain_tip = self.get_chain_tip().await?;
            }
        }

        Ok(())
    }

    async fn commit_root(&mut self, number: u64, leaves: &[H256]) -> Result<()> {
        let flag_number = number / 100;
        eprintln!(
            "Committing root for flag: {}, block count {}",
            flag_number,
            leaves.len()
        );

        let root = BinaryMerkleTree::build_merkle_root(leaves).0;
        self.db.put(
            COLUMN_BLOCK_NUMBER,
            LATEST_BLOCK_NUMBER_KEY.as_slice(),
            &number.to_le_bytes(),
        )?;
        let key = Hasher::digest(flag_number.to_le_bytes()).0;
        self.smt.update(key.into(), root.into())?;
        let smt_root = self.smt.root();

        Ok(())
    }

    fn get_latest_block_number(&self) -> Result<u64> {
        if let Some(buf) = self
            .db
            .get(COLUMN_BLOCK_NUMBER, LATEST_BLOCK_NUMBER_KEY.as_slice())?
        {
            let mut bytes = [0u8; 8];
            bytes.copy_from_slice(&buf[0..8]);
            Ok(u64::from_le_bytes(bytes))
        } else {
            Ok(0)
        }
    }

    async fn get_chain_tip(&self) -> Result<u64> {
        let tip = self.client.block_number().await?.low_u64();
        eprintln!("Chain tip: {}", tip);
        Ok(tip)
    }
}

fn calculate_leaf(block: &Block) -> H256 {
    let mut buf = [0u8; 64];
    buf[0..32].copy_from_slice(block.hash().as_bytes());
    buf[32..64].copy_from_slice(block.header.transactions_root.as_bytes());
    Hasher::digest(buf)
}
