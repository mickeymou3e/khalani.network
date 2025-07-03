// import { connect, connection } from 'mongoose';
import { Collection, Db, MongoClient } from 'mongodb';
import env from './env';
import { Timestamp } from 'mongodb';

const {
  AXON_FAUCET_MONGODB_URL,
  AXON_FAUCET_MONGODB_DB,
  AXON_FAUCET_MONGODB_TRANSACTIONS_COLLECTION,
  AXON_FAUCET_MONGODB_ADDRESSES_COLLECTION,
} = env;

export class Address {
  constructor(
    public balance: string,
    public pending_amount: string[],
    public is_processing: boolean,
    public private_key: string,
  ) {}
}

export class Transaction {
  constructor(
    public from: string,
    public to: string,
    public value: string,
    public gas: string,
    public nonce: string,
    public hash: string,
    public time: Timestamp & { $timestamp?: string },
    public status: number,
  ) {}
}

let collections: {
  transaction: Collection<Transaction>;
  address: Collection<Address>;
};

export async function connectToDatabase() {
  if (collections) {
    return collections;
  }

  const client = new MongoClient(AXON_FAUCET_MONGODB_URL);
  await client.connect();
  const db = client.db(AXON_FAUCET_MONGODB_DB);

  collections = {
    transaction: db.collection(AXON_FAUCET_MONGODB_TRANSACTIONS_COLLECTION),
    address: db.collection(AXON_FAUCET_MONGODB_ADDRESSES_COLLECTION),
  };

  return collections;
}
