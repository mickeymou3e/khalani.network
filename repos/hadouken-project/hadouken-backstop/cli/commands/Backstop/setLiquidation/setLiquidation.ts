import { ethers } from "ethers";
import prompts from "prompts";

import { TriCryptoBackstop__factory } from "../../../../src/contracts/godwoken";
import { getConfig, getContractsConfig } from "../../../config";
import { Cli } from "../../../types";
import { getDeployer, updateDeployedContracts } from "../../../utils";

export const setLiquidationCli: Cli = async ({ environment, parentCli }) => {
  const config = getConfig(environment.env);
  const deployer = await getDeployer(config);

  const contractsConfig = getContractsConfig(environment.env);

  const backstopContract = TriCryptoBackstop__factory.connect(
    contractsConfig.backstop,
    deployer
  );

  const { address } = await prompts({
    type: "text",
    name: "address",
    message: "New liquidation address",
  });

  if (!ethers.utils.isAddress(address)) throw Error("wrong address");

  const transaction = await backstopContract.setLiquidation(address, {
    from: deployer.address,
  });

  const receipt = await transaction.wait();

  updateDeployedContracts(environment.env, "liquidation", address);

  console.log("Set new liquidation complete", receipt);
};
