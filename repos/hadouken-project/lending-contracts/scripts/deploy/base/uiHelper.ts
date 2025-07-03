import { getContractsConfigInstant, waitForTx } from '@src/utils';
import { ethers } from 'hardhat';

import { writeToContractsConfig } from '@scripts/filesManager';
import { ZERO_ADDRESS } from '@src/constants';
import { ScriptRunEnvironment } from '@src/types';
import { LendingContracts } from '@src/utils';

export async function deployBaseUIHelper(environment: ScriptRunEnvironment) {
  const { deployer, chainId, env, networkName } = environment;
  const contractsConfig = getContractsConfigInstant(chainId, env, true);
  if (!contractsConfig) throw Error('contractsConfig not found');
  const hadoukenOracle = contractsConfig.hadoukenOracle;

  const UIDataProvider = await ethers.getContractFactory(
    LendingContracts.UiPoolDataProvider,
    deployer
  );

  const UIDataProviderTransaction = UIDataProvider.getDeployTransaction(
    ZERO_ADDRESS,
    hadoukenOracle
  );

  const uiProviderGasLimit = await deployer.estimateGas(UIDataProviderTransaction);
  UIDataProviderTransaction.gasLimit = uiProviderGasLimit;

  const uiHelperTransaction = await waitForTx(
    await deployer.sendTransaction(UIDataProviderTransaction)
  );

  writeToContractsConfig(
    { UIHelper: uiHelperTransaction.contractAddress },
    chainId,
    env,
    networkName
  );

  return uiHelperTransaction.contractAddress;
}
