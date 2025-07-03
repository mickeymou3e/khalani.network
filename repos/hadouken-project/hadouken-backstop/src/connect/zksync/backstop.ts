import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import {
  TriCryptoBackstop,
  TriCryptoBackstop__factory,
} from "../../contracts/zksync";
import { ChainEnvironment, ContractsConfig } from "../../types/types";
import { getContractsConfigStatic } from "../../utils/utils";

export default function (
  signerOrProvider: Signer | Provider,
  environment: ChainEnvironment
): TriCryptoBackstop | null {
  const json = getContractsConfigStatic(
    environment
  ) as unknown as ContractsConfig;

  if (!json || !json.backstop) {
    return null;
  }

  return TriCryptoBackstop__factory.connect(json.backstop, signerOrProvider);
}
