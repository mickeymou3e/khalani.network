import EVM from "../vms/evm";
import Log from "../vms/log";
import { ChainType } from "../vms/config-types";
import chainsJson from "./chains.json";
import dotenv from "dotenv";
import { ChainId } from "./types";
import { SendTokenResponse } from "../vms/request-types";
import { EvmSigner } from "../vms/signer";

dotenv.config();

const log = new Log("transfer-funds-from-kms-key");

export function getChainType(chainID: ChainId) {
  const chains = chainsJson as ChainType[];
  const chain = chains.find((c) => c.ID === chainID);
  if (!chain) {
    throw new Error(`Unknown chain ${chainID}`);
  }
  return chain;
}

export async function sendFundsTo(
  chain: ChainType,
  amount: number,
  kmsSigner: EvmSigner,
  recipient: string
) {
  const evm = new EVM({ ...chain, DRIP_AMOUNT: amount }, kmsSigner, log, false);
  let response: SendTokenResponse;
  try {
    await evm.start();
    response = await evm.sendToken(recipient, undefined);
  } finally {
    await evm.stop();
  }
  if (response.status !== 200) {
    throw new Error(`Failed to send tokens: ${response.message})`);
  }
  log.info(
    `Successfully transferred ${amount} ${chain.TOKEN} to ${recipient}: ${chain.EXPLORER}/tx/${response.txHash}`
  );
}
