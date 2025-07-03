import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { Liquidation, Liquidation__factory } from "../../contracts/zksync";
import { ChainEnvironment, ContractsConfig } from "../../types/types";
import { getContractsConfigStatic } from "../../utils/utils";

export default function (
  signerOrProvider: Signer | Provider,
  environment: ChainEnvironment
): Liquidation | null {
  const json = getContractsConfigStatic(
    environment
  ) as unknown as ContractsConfig;

  if (!json || !json.liquidation) {
    return null;
  }

  return Liquidation__factory.connect(json.liquidation, signerOrProvider);
}
