import { TriCryptoBackstop__factory } from "../../../../src/contracts/godwoken";
import { getConfig, getContractsConfig } from "../../../config";
import { Cli } from "../../../types";
import { getDeployer } from "../../../utils";

export const getLiquidationCli: Cli = async ({ environment, parentCli }) => {
  const config = getConfig(environment.env);
  const deployer = await getDeployer(config);

  const contractsConfig = getContractsConfig(environment.env);

  const backstopContract = TriCryptoBackstop__factory.connect(
    contractsConfig.backstop,
    deployer
  );

  const address = await backstopContract.liquidation();

  console.log("liquidation address", address);
};
