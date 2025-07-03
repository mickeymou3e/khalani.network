import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";

import { default as connectBackstop } from "./backstop";
import { default as connectLiquidation } from "./liquidation";

import { ChainEnvironment, Network } from "../../types/types";

export default function (
  signerOrProvider: Signer | Provider,
  environment: "mainnet" | "testnet",
  chainId: Network | string
) {
  let env: ChainEnvironment | undefined;
  if (
    chainId === Network.GodwokenTestnet ||
    chainId === Network.GodwokenMainnet
  ) {
    env = environment === "mainnet" ? "godwoken-mainnet" : "godwoken-testnet";
  } else if (
    chainId === Network.MantleTestnet ||
    chainId === Network.MantleMainnet
  ) {
    env = environment === "mainnet" ? "mantle-mainnet" : "mantle-testnet";
  }

  if (!env) throw new Error("Invalid backstop chainId or environment");

  return {
    liquidation: connectLiquidation(signerOrProvider, env),
    backstop: connectBackstop(signerOrProvider, env),
  };
}
