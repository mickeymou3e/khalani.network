import { dbClient, DYNAMO_TABLE } from "../config";
import {
  PutCommand,
  UpdateCommand,
  QueryCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { AppError } from "../utils/errors";

export interface DepositRecord {
  id: string;
  userAddress: string;
  tokenAddress: string;
  amount: string;
  depositTx: string;
  status: "pending" | "error" | "success";
  intentId?: string;
  errorMessage?: string;
  intent?: any;
  intentSignature?: string;
  createdAt: string;
  updatedAt?: string;
}

export async function createPendingDeposit(
  record: Omit<DepositRecord, "status" | "createdAt" | "updatedAt">
): Promise<void> {
  console.log(
    `📝 Creating pending deposit for user ${record.userAddress} with ID: ${record.id}`
  );
  const now = Date.now();
  try {
    await dbClient.send(
      new PutCommand({
        TableName: DYNAMO_TABLE,
        Item: { ...record, status: "pending", createdAt: now },
      })
    );
    console.log(
      `✅ Successfully created pending deposit with ID: ${record.id}`
    );
  } catch (err: any) {
    console.error(`❌ Failed to create pending deposit: ${err.message}`);
    // Wrap and rethrow as application error
    throw new AppError(
      "ERR_DB_PUT",
      `Failed to write to DynamoDB: ${err.message}`
    );
  }
}

export async function markError(id: string, message: string): Promise<void> {
  console.log(`⚠️ Marking deposit ${id} as error: ${message}`);
  try {
    await dbClient.send(
      new UpdateCommand({
        TableName: DYNAMO_TABLE,
        Key: { id },
        UpdateExpression: "SET #s = :s, errorMessage = :e, updatedAt = :u",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: {
          ":s": "error",
          ":e": message,
          ":u": Date.now(),
        },
      })
    );
    console.log(`✅ Successfully marked deposit ${id} as error`);
  } catch (err: any) {
    console.error(`❌ Failed to mark deposit ${id} as error: ${err.message}`);
    throw err;
  }
}

/**
 * Mark a deposit as success and attach the intentId
 */
export async function markSuccess(id: string, intentId: string): Promise<void> {
  console.log(`🎉 Marking deposit ${id} as successful (intentId=${intentId})`);
  try {
    await dbClient.send(
      new UpdateCommand({
        TableName: DYNAMO_TABLE,
        Key: { id },
        UpdateExpression: "SET #s = :s, intentId = :i, updatedAt = :u",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: {
          ":s": "success",
          ":i": intentId,
          ":u": Date.now(),
        },
      })
    );
    console.log(
      `✅ Successfully marked deposit ${id} as successful with intentId: ${intentId}`
    );
  } catch (err: any) {
    console.error(
      `❌ Failed to mark deposit ${id} as successful: ${err.message}`
    );
    throw err;
  }
}

export async function getDepositById(
  id: string
): Promise<DepositRecord | null> {
  console.log(`🔍 Retrieving deposit with ID: ${id}`);
  try {
    const res = await dbClient.send(
      new GetCommand({
        TableName: DYNAMO_TABLE,
        Key: { id },
      })
    );
    if (res.Item) {
      console.log(`✅ Successfully retrieved deposit ${id}`);
      return res.Item as DepositRecord;
    } else {
      console.log(`ℹ️ No deposit found with ID: ${id}`);
      return null;
    }
  } catch (err: any) {
    console.error(`❌ Failed to retrieve deposit ${id}: ${err.message}`);
    throw err;
  }
}

export async function listUserDeposits(
  userAddress: string,
  status?: "pending" | "error" | "success"
): Promise<DepositRecord[]> {
  console.log(
    `🔍 Listing deposits for user ${userAddress}${
      status ? ` with status: ${status}` : ""
    }`
  );
  const params: any = {
    TableName: DYNAMO_TABLE,
    IndexName: "ByUserIndex",
    KeyConditionExpression: "userAddress = :u",
    ExpressionAttributeValues: { ":u": userAddress },
  };

  if (status) {
    params.FilterExpression = "#s = :s";
    params.ExpressionAttributeNames = { "#s": "status" };
    params.ExpressionAttributeValues[":s"] = status;
  }

  try {
    const res = await dbClient.send(new QueryCommand(params));
    const deposits = (res.Items as any[]).map((i) => i as DepositRecord) || [];
    console.log(
      `✅ Successfully retrieved ${deposits.length} deposits for user ${userAddress}`
    );
    return deposits;
  } catch (err: any) {
    console.error(
      `❌ Failed to list deposits for user ${userAddress}: ${err.message}`
    );
    throw err;
  }
}
