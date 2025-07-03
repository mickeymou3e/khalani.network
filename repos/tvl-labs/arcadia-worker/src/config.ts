import * as dotenv from "dotenv";
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ArcadiaSDK } from "@khalani-labs/arcadia-sdk";
import { NetworkType } from "@khalani-labs/arcadia-sdk";

dotenv.config();

export const DYNAMO_TABLE = process.env.DYNAMODB_TABLE!;
export const PORT = process.env.PORT!;

// 1) Initialize the low‑level client
const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  ...(process.env.DYNAMODB_ENDPOINT && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
  }),
});

export function getNetworkType() {
  switch (process.env.NETWORK_TYPE) {
    case "mainnet":
      return NetworkType.mainnet;
    case "testnet":
    default:
      return NetworkType.testnet;
  }
}

// 2) Ensure the table exists
async function ensureTable() {
  try {
    console.log("▶️ DynamoDB endpoint:", process.env.DYNAMODB_ENDPOINT);
    await ddbClient.send(new DescribeTableCommand({ TableName: DYNAMO_TABLE }));
    console.log(`✅ DynamoDB table "${DYNAMO_TABLE}" already exists.`);
  } catch (err: any) {
    if (err.name === "ResourceNotFoundException") {
      console.log(`🔨 Creating DynamoDB table "${DYNAMO_TABLE}"...`);
      await ddbClient.send(
        new CreateTableCommand({
          TableName: DYNAMO_TABLE,
          AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" },
            { AttributeName: "userAddress", AttributeType: "S" },
          ],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          BillingMode: "PAY_PER_REQUEST",
          GlobalSecondaryIndexes: [
            {
              IndexName: "ByUserIndex",
              KeySchema: [{ AttributeName: "userAddress", KeyType: "HASH" }],
              Projection: { ProjectionType: "ALL" },
            },
          ],
        })
      );
      await waitUntilTableExists(
        { client: ddbClient, maxWaitTime: 40 },
        { TableName: DYNAMO_TABLE }
      );
      console.log(`✅ DynamoDB table "${DYNAMO_TABLE}" is now active.`);
    } else {
      console.error("Error checking/creating DynamoDB table:", err);
      process.exit(1);
    }
  }
}

(async () => {
  if (process.env.NODE_ENV !== "production") {
    await ensureTable();
  }

  console.log("▶️ DynamoDB ready, NODE_ENV=", process.env.NODE_ENV);
})();

// 3) Export the Document client for the rest of your app
export const dbClient = DynamoDBDocumentClient.from(ddbClient);

// Arcadia SDK instance
export const arcadiaSDK = new ArcadiaSDK("EthersV5", getNetworkType());
