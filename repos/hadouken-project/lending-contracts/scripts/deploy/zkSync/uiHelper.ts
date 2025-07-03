import { writeToContractsConfig } from '@scripts/filesManager';
import { LendingContracts, delay, getConfigInstant, getContractsConfigInstant } from '@src/utils';

import { ZERO_ADDRESS } from '@src/constants';
import { ZkSyncDeploymentEnvironment } from '@src/types';

export const deployZkSyncUIHelper = async (environment: ZkSyncDeploymentEnvironment) => {
  const { env, chainId, deployer } = environment;
  const contractsConfig = getContractsConfigInstant(chainId, env, true);
  if (!contractsConfig) throw Error('contractsConfig not found');
  const config = getConfigInstant(chainId, env, true);
  if (!config) throw Error('config not found');
  const delayTime = Number(config.delay);

  const UIDataProvider = await deployer.loadArtifact(LendingContracts.UiPoolDataProvider);

  const priceOracle = contractsConfig.hadoukenOracle;

  const contract = await deployer.deploy(UIDataProvider, [ZERO_ADDRESS, priceOracle]);

  writeToContractsConfig(
    { UIHelper: contract.address },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  await delay(delayTime);

  return contract.address;
};
