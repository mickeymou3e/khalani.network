import { getConfigInstant, waitForTx } from '@src/utils';
import { ethers } from 'hardhat';

import { writeToContractsConfig } from '@scripts/filesManager';
import { ScriptRunEnvironment } from '@src/types';
import { LendingContracts } from '@src/utils';

export async function deployBaseUserBalances(environment: ScriptRunEnvironment) {
  const { deployer, chainId, env, networkName } = environment;
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const userBalancesMock = await ethers.getContractFactory(LendingContracts.UserBalances, deployer);

  const userBalancesTransaction = userBalancesMock.getDeployTransaction({
    gasPrice: config.gasPrice,
    gasLimit: config.gasLimit,
  });

  const userBalancesGasLimit = await deployer.estimateGas(userBalancesTransaction);

  userBalancesTransaction.gasLimit = userBalancesGasLimit;

  const balancesTransaction = await waitForTx(
    await deployer.sendTransaction(userBalancesTransaction)
  );

  writeToContractsConfig(
    { userBalances: balancesTransaction.contractAddress },
    chainId,
    env,
    networkName
  );

  return balancesTransaction.contractAddress;
}
