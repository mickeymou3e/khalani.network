import prompts from "prompts";

import { IVault__factory } from "../../../../src/contracts/godwoken";
import { getConfig } from "../../../config";
import { Cli } from "../../../types";
import { getDeployer } from "../../../utils";

export const checkInternalBalanceCli: Cli = async ({ environment }) => {
  const config = getConfig(environment.env);
  const deployer = await getDeployer(config);
  const vault = await IVault__factory.connect(
    config.contracts.swap.vault,
    deployer
  );

  const { address } = await prompts({
    type: "text",
    name: "address",
    message: "put user address",
  });

  const tokens = Object.keys(config.contracts.tokens);

  const addresses = tokens.map(
    (symbol) => config.contracts.tokens[symbol].address
  );

  const internalBalances = await vault.getInternalBalance(address, addresses);

  console.log("internalBalances", internalBalances);
};
