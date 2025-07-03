import { TriCryptoBackstop__factory } from "../../../../src/contracts/godwoken";
import { getConfig, getContractsConfig } from "../../../config";
import { Cli } from "../../../types";
import { getDeployer } from "../../../utils";
import { selectAddressCli } from "../../utils";

export const setOwnerCli: Cli = async ({ environment, parentCli }) => {
  const config = getConfig(environment.env);
  const deployer = await getDeployer(config);

  const contractsConfig = getContractsConfig(environment.env);
  const backstop = TriCryptoBackstop__factory.connect(
    contractsConfig.backstop,
    deployer
  );

  const owner = await backstop.owner();

  if (deployer.address !== owner) {
    console.log("You are not an owner, your address is");
    console.log(deployer.address);
    console.log("Owner address is");
    console.log(owner);

    return;
  }

  const newOwner = await selectAddressCli("Provide new owner address");

  const transaction = await backstop.transferOwnership(newOwner);

  await transaction.wait();

  console.log("new owner is", newOwner);
};
