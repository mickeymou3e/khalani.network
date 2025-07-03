import {
  ERC20__factory,
  TriCryptoBackstop__factory,
} from "../../../../src/contracts/godwoken";
import { getConfig, getContractsConfig } from "../../../config";
import { Cli } from "../../../types";
import { BigNumberToFloat, getDeployer } from "../../../utils";
import { selectAmountCli } from "../../utils";

export const depositCli: Cli = async ({ environment, parentCli }) => {
  const config = getConfig(environment.env);
  const deployer = await getDeployer(config);

  const contractsConfig = getContractsConfig(environment.env);

  const triCryptoToken = ERC20__factory.connect(
    config.contracts.tokens["TriCrypto"].address,
    deployer
  );

  const userBalanceBigNumber = await triCryptoToken.callStatic.balanceOf(
    deployer.address
  );
  const userBalance = BigNumberToFloat(userBalanceBigNumber, 18);

  const { bigNumberAmount: amountInBigNumber } = await selectAmountCli(
    18,
    userBalance,
    `TriCrypto Lp token amount [Max: ${userBalance}] (float amount):`
  );

  const backstopContract = TriCryptoBackstop__factory.connect(
    contractsConfig.backstop,
    deployer
  );

  const approveTransaction = await triCryptoToken.approve(
    backstopContract.address,
    amountInBigNumber
  );

  await approveTransaction.wait();

  const depositTransaction = await backstopContract.deposit(amountInBigNumber, {
    gasLimit: 12500000,
  });
  const receipt = await depositTransaction.wait();

  console.log("deposit success", receipt);
};
