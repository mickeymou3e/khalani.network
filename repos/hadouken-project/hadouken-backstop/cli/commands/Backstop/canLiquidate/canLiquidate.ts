import {
  ERC20__factory,
  TriCryptoBackstop__factory,
} from "../../../../src/contracts/godwoken";
import { getConfig, getContractsConfig } from "../../../config";
import { Cli } from "../../../types";
import { getDeployer } from "../../../utils";
import { selectAddressCli, selectAmountCli, selectTokenCli } from "../../utils";

export const canLiquidateCli: Cli = async ({ environment, parentCli }) => {
  const config = getConfig(environment.env);
  const deployer = await getDeployer(config);

  const contractsConfig = getContractsConfig(environment.env);

  const debtToken = await selectTokenCli(environment.env, "Select Debt token");
  const collateralToken = await selectTokenCli(
    environment.env,
    "Select Collateral token"
  );

  const collateralTokenErc20 = ERC20__factory.connect(
    collateralToken,
    deployer
  );
  const collateralTokenName = await collateralTokenErc20.name();

  const debtTokenErc20 = ERC20__factory.connect(debtToken, deployer);
  const debTokenName = await debtTokenErc20.name();
  const debtTokenDecimals = await debtTokenErc20.decimals();

  const user = await selectAddressCli("Select user address to liquidate");

  const backstopContract = TriCryptoBackstop__factory.connect(
    contractsConfig.backstop,
    deployer
  );

  const { bigNumberAmount: repayAmount, amount: repayAmountInFloat } =
    await selectAmountCli(
      debtTokenDecimals,
      undefined,
      `Repay amount [${debTokenName}]: `
    );

  const canLiquidateResult = await backstopContract.callStatic.canLiquidate(
    debtToken,
    collateralToken,
    user,
    repayAmount
  );

  console.log(
    `debt token: ${debtToken} collateral: ${collateralToken} amount bignumber: ${repayAmount.toString()}`
  );
  console.log(
    `Can liquidate ${debTokenName} token in amount ${repayAmountInFloat} and get ${collateralTokenName} as collateral:  ${canLiquidateResult}`
  );
};
