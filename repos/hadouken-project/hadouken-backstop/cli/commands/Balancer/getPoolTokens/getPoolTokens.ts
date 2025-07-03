import {
  IBasePool__factory,
  IVault__factory,
} from "../../../../src/contracts/godwoken";
import { getConfig } from "../../../config";
import { Cli } from "../../../types";
import { selectAddressCli } from "../../utils";

export const getPoolTokensCli: Cli = async ({ environment }) => {
  const config = getConfig(environment.env);

  const poolAddress = await selectAddressCli("Provide pool address:");

  const pool = IBasePool__factory.connect(poolAddress, environment.deployer);

  const vault = IVault__factory.connect(
    config.contracts.swap.vault,
    environment.deployer
  );
  const poolId = await pool.callStatic.getPoolId();

  const tokens = await vault.getPoolTokens(poolId);

  const factors = await pool.getScalingFactors();

  console.log("poolId", poolId);
  console.log("poolAddress", poolAddress, config.contracts.swap.vault);
  console.log("tokens", tokens);
  console.log("factors", factors);
};
