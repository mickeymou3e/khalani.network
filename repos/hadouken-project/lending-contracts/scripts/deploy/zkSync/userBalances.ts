import { writeToContractsConfig } from '@scripts/filesManager';
import { LendingContracts, delay, getConfigInstant } from '@src/utils';

import { ZkSyncDeploymentEnvironment } from '@src/types';

export const deployZkSyncUserBalances = async (environment: ZkSyncDeploymentEnvironment) => {
  console.log('Deploying user balances');

  const { env, chainId, deployer, networkName } = environment;

  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const delayTime = Number(config.delay);

  const userBalancesMock = await deployer.loadArtifact(LendingContracts.UserBalances);

  const contract = await deployer.deploy(userBalancesMock);

  writeToContractsConfig({ userBalances: contract.address }, chainId, env, networkName);

  await delay(delayTime);

  console.log(`User Balances have been deployed at address: ${contract.address}`);
  return contract.address;
};
