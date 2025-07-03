import { readdir, readFile } from "fs/promises";
import * as path from "path";

interface BroadcastTx {
  hash: string;
  transactionType: string;
  contractName: string | null;
  contractAddress: string | null;
  function: string | null;
  arguments: Array<string> | null;
}

interface BroadcastReceipt {
  logs: Array<{
    address: string;
  }>;
}

interface BroadcastFile {
  transactions: BroadcastTx[];
  receipts: BroadcastReceipt[];
  chain: number;
  timestamp: number;
}

async function listNumericRunFiles(broadcastDir: string): Promise<string[]> {
  const allFiles = await readdir(broadcastDir);
  return allFiles.filter((f) => /^run-\d+\.json$/.test(f));
}

async function loadBroadcastFile(fullpath: string): Promise<BroadcastFile> {
  const raw = await readFile(fullpath, "utf8");
  return JSON.parse(raw) as BroadcastFile;
}

export async function collectLatestMTokens(
  baseBroadcastPath: string
): Promise<Record<string, string>> {
  const files = await listNumericRunFiles(baseBroadcastPath);
  type Key = string;

  const latest: Record<Key, { timestamp: number; address: string }> = {};

  await Promise.all(
    files.map(async (filename) => {
      const fullpath = path.join(baseBroadcastPath, filename);
      const bf = await loadBroadcastFile(fullpath);
      const { transactions, receipts, timestamp } = bf;

      for (let i = 0; i < transactions.length; ++i) {
        const tx = transactions[i];
        if (
          tx.function?.startsWith("createMToken(") &&
          Array.isArray(tx.arguments) &&
          tx.arguments.length === 4
        ) {
          const symbol = tx.arguments[1];
          const chainIdStr = tx.arguments[3];
          const chainIdNum = Number(chainIdStr);
          const key = `${symbol}-${chainIdNum}`;

          const mAddr = receipts[0]?.logs[0]?.address;
          if (!mAddr) continue;

          if (!latest[key] || timestamp > (latest[key]?.timestamp ?? 0)) {
            latest[key] = { timestamp, address: mAddr };
          }
        }
      }
    })
  );

  const result: Record<string, string> = {};
  for (const [key, { address }] of Object.entries(latest)) {
    result[key] = address;
  }
  return result;
}

export async function getIntentBookAddress(
  baseBroadcastPath: string
): Promise<string> {
  const latestPath = path.join(baseBroadcastPath, "run-latest.json");
  const bf = await loadBroadcastFile(latestPath);

  for (const tx of bf.transactions) {
    if (
      tx.transactionType === "CREATE" &&
      tx.contractName === "IntentBook" &&
      typeof tx.contractAddress === "string"
    ) {
      return tx.contractAddress;
    }
  }
  throw new Error("IntentBook CREATE not found in run-latest.json");
}

export async function getAssetReservesAddress(
  baseBroadcastPath: string
): Promise<string> {
  const latestPath = path.join(baseBroadcastPath, "run-latest.json");
  const bf = await loadBroadcastFile(latestPath);

  for (const tx of bf.transactions) {
    if (
      tx.transactionType === "CREATE2" &&
      tx.contractName === "AssetReserves" &&
      typeof tx.contractAddress === "string"
    ) {
      return tx.contractAddress;
    }
  }
  throw new Error("AssetReserves CREATE2 not found in run-latest.json");
}
