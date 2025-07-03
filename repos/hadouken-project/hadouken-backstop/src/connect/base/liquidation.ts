import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";

import type { Liquidation } from "@src/contracts/godwoken/Liquidation";
import { Liquidation__factory } from "@src/contracts/godwoken/factories/Liquidation__factory";

import { ContractsConfig } from "@src/types/types";
import {
  getContractsConfigStatic,
  resolveChainEnvironmentByChainId,
} from "@src/utils/utils";

export const connectToLiquidation = (
  chainId: string,
  signerOrProvider: Signer | Provider
): Liquidation | null => {
  const json = getContractsConfigStatic(
    resolveChainEnvironmentByChainId(chainId)
  ) as unknown as ContractsConfig;

  if (!json || !json.liquidation) {
    return null;
  }

  return Liquidation__factory.connect(json.liquidation, signerOrProvider);
};
