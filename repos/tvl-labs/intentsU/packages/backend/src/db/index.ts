import { Db, MongoClient } from "mongodb";
import { serverApi, uri } from "../config/db.setup";

let db: Db | null = null;

export const connect = async (): Promise<Db> => {
  if (!db) {
    const client = new MongoClient(uri, serverApi);
    await client.connect();
    db = client.db("intentsu");
  }
  return db;
};
