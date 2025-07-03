import { getChainType, KmsEvmSigner, sendFundsTo } from "./src";
import { ChainId } from "./src/types";
import Log from "./vms/log";

async function main() {
  const recipient = process.env.RECIPIENT as string;
  const rpcUrl = process.env.RPC_URL as string;
  const chainID = process.env.CHAIN_ID as ChainId;
  const awsRegion = process.env.AWS_REGION as string;
  const kmsKeyId = process.env.AWS_KMS_KEY_ID as string;
  const foundedAmount = parseFloat(process.env.FUNDED_AMOUNT as string);
  const chain = getChainType(chainID);

  const kmsSigner = await KmsEvmSigner.create(
    chain.ID,
    rpcUrl,
    awsRegion,
    kmsKeyId,
    new Log(chainID)
  );

  await sendFundsTo(chain, foundedAmount, kmsSigner, recipient);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
