import { Liquidation__factory } from "../../../../src/contracts/godwoken";
import { getConfig, getContractsConfig } from "../../../config";
import { Cli } from "../../../types";
import { getDeployer } from "../../../utils";

export const getLiquidationParamsCli: Cli = async ({
  environment,
  parentCli,
}) => {
  const config = getConfig(environment.env);
  const deployer = await getDeployer(config);

  const contractsConfig = getContractsConfig(environment.env);
  const liquidation = Liquidation__factory.connect(
    contractsConfig.liquidation,
    deployer
  );

  const triCrypto = await liquidation.getTriCryptoPoolTokens();
  const pools = await liquidation.getAllPools();
  console.log("liquidation triCrypto tokens", triCrypto);
  console.log("liquidation pool tokens", pools);
};
