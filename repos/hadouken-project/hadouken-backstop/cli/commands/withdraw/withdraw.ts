import { BigNumber } from "ethers";

import {
  ERC20__factory,
  TriCryptoBackstop__factory,
} from "../../../src/contracts/godwoken";
import { getConfig, getContractsConfig } from "../../config";
import { Cli } from "../../types";
import { BigNumberToFloat, getDeployer } from "../../utils";
import { selectAmountCli } from "../utils";

export const withdrawCli: Cli = async ({ environment, parentCli }) => {
  const config = getConfig(environment.env);
  const deployer = await getDeployer(config);

  const contractsConfig = getContractsConfig(environment.env);

  const BammToken = ERC20__factory.connect(contractsConfig.backstop, deployer);
  const liquidationToken = ERC20__factory.connect(
    config.contracts.swap.triCryptoPool,
    deployer
  );

  const userBalanceBigNumber = await BammToken.balanceOf(deployer.address);
  const userBalance = BigNumberToFloat(userBalanceBigNumber, 18);

  const backstopContract = TriCryptoBackstop__factory.connect(
    contractsConfig.backstop,
    deployer
  );

  const totalLpTokens = await backstopContract.totalSupply();
  const totalTriCryptoTokens = await liquidationToken.balanceOf(
    contractsConfig.backstop
  );

  const virtualPrice = totalLpTokens.gt(0)
    ? totalTriCryptoTokens.mul(BigNumber.from(10).pow(9)).div(totalLpTokens)
    : BigNumber.from(10).pow(9);

  const { bigNumberAmount: amountInBigNumber } = await selectAmountCli(
    18,
    userBalance,
    `Backstop Lp token amount [Virtual price: ${BigNumberToFloat(
      virtualPrice,
      9
    )}] [Max: ${userBalance.toString()}] (float amount):`
  );

  console.log(
    "You will get ~",
    BigNumberToFloat(
      amountInBigNumber.mul(virtualPrice).div(BigNumber.from(10).pow(9)),
      18
    )
  );

  const approveTransaction = await BammToken.approve(
    backstopContract.address,
    amountInBigNumber
  );

  await approveTransaction.wait();

  const withdrawTransaction = await backstopContract.withdraw(
    amountInBigNumber
  );
  const receipt = await withdrawTransaction.wait();

  console.log("withdraw success", receipt);
};
