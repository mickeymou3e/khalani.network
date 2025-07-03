import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";

import type { TriCryptoBackstop } from "@src/contracts/godwoken/TriCryptoBackstop";
import { TriCryptoBackstop__factory } from "@src/contracts/godwoken/factories/TriCryptoBackstop__factory";

import { ContractsConfig } from "@src/types/types";
import {
  getContractsConfigStatic,
  resolveChainEnvironmentByChainId,
} from "@src/utils/utils";

export const connectToBackstopPool = (
  chainId: string,
  signerOrProvider: Signer | Provider
): TriCryptoBackstop | null => {
  const json = getContractsConfigStatic(
    resolveChainEnvironmentByChainId(chainId)
  ) as unknown as ContractsConfig;

  if (!json || !json.backstop) {
    return null;
  }

  return TriCryptoBackstop__factory.connect(json.backstop, signerOrProvider);
};
