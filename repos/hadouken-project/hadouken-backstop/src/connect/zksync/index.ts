import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";

import { default as connectBackstop } from "./backstop";
import { default as connectLiquidation } from "./liquidation";

export default function (
  signerOrProvider: Signer | Provider,
  environment: "mainnet" | "testnet"
) {
  const env = environment === "mainnet" ? "zksync-mainnet" : "zksync-testnet";

  return {
    liquidation: connectLiquidation(signerOrProvider, env),
    backstop: connectBackstop(signerOrProvider, env),
  };
}
