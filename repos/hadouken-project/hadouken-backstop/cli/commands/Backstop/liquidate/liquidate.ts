import {
  ERC20__factory,
  TriCryptoBackstop__factory,
} from "../../../../src/contracts/godwoken";
import { getConfig, getContractsConfig } from "../../../config";
import { Cli } from "../../../types";
import { getDeployer } from "../../../utils";
import { selectAddressCli, selectAmountCli, selectTokenCli } from "../../utils";

export const liquidateCli: Cli = async ({ environment, parentCli }) => {
  const config = getConfig(environment.env);
  const deployer = await getDeployer(config);

  const contractsConfig = getContractsConfig(environment.env);

  const debtToken = await selectTokenCli(environment.env, "Select Debt token");
  const collateralToken = await selectTokenCli(
    environment.env,
    "Select Collateral token"
  );

  const debtTokenErc20 = ERC20__factory.connect(debtToken, deployer);
  const debTokenName = await debtTokenErc20.name();
  const debtTokenDecimals = await debtTokenErc20.decimals();

  const user = await selectAddressCli("Select user address to liquidate");

  const backstopContract = TriCryptoBackstop__factory.connect(
    contractsConfig.backstop,
    deployer
  );

  const { bigNumberAmount: repayAmount } = await selectAmountCli(
    debtTokenDecimals,
    undefined,
    `Repay amount [${debTokenName}]: `
  );

  const liquidateTransaction = await backstopContract.liquidate(
    debtToken,
    collateralToken,
    user,
    repayAmount,
    {
      gasLimit: 8000000,
    }
  );

  const liquidationReceipt = await liquidateTransaction.wait();

  console.log("liquidation completed", liquidationReceipt);
};
