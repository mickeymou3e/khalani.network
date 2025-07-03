import EVM from "../vms/evm";
import { KmsEvmSigner } from "../vms/kms-signer";
import Log from "../vms/log";
import { ChainType } from "../vms/config-types";
import chainsJson from "./chains.json";
import dotenv from "dotenv";
import { ChainId } from "./types";

dotenv.config();

const log = new Log("transfer-funds-from-kms-key");

export async function sendFunds(
  recipient: string,
  rpcUrl: string,
  chainID: ChainId,
  awsRegion: string,
  kmsKeyId: string,
  amount: number
) {
  const chains = chainsJson as ChainType[];
  const chain = chains.find((c) => c.ID === chainID);
  if (!chain) {
    throw new Error(`Unknown chain ${chainID}`);
  }
  const kmsSigner = await KmsEvmSigner.create(
    chain.ID,
    rpcUrl,
    awsRegion,
    kmsKeyId,
    log
  );
  const evm = new EVM({ ...chain, DRIP_AMOUNT: amount }, kmsSigner, log);
  await evm.start(true);
  const response = await evm.sendToken(recipient, undefined);
  if (response.status !== 200) {
    throw new Error(`Failed to send tokens: ${response.message})`);
  }
  log.info(
    `Successfully transferred ${amount} ${chain.TOKEN} to ${recipient}: ${chain.EXPLORER}/tx/${response.txHash}`
  );
}
