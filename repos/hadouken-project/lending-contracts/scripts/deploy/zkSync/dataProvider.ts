import { writeToContractsConfig } from '@scripts/filesManager';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import { LendingContracts, delay, getConfigInstant, getContractsConfigInstant } from '@src/utils';

export const deployZkSyncDataProvider = async (
  environment: ZkSyncDeploymentEnvironment
): Promise<string> => {
  const { env, chainId, deployer } = environment;

  const contractsConfig = getContractsConfigInstant(chainId, env, true);
  const config = getConfigInstant(chainId, env, true);
  if (!config) throw Error('config not found');
  const delayTime = Number(config.delay);

  const addressProviderAddress = contractsConfig?.addressProvider;

  if (!addressProviderAddress) {
    throw Error('Address provider has not been initialized! Aborting deployment of data provider.');
  }

  console.log('Deploying Data provider');

  const dataProviderFactory = await deployer.loadArtifact(LendingContracts.DataProvider);

  const contract = await deployer.deploy(dataProviderFactory, [addressProviderAddress]);

  const dataProviderAddress = contract.address;

  console.log(`Data provider deployed: ${dataProviderAddress}`);

  await delay(delayTime);
  writeToContractsConfig(
    {
      dataProvider: dataProviderAddress,
    },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  return dataProviderAddress;
};
