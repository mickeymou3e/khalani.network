import { connectToContractsRuntime } from '@scripts/connect';
import { writeToContractsConfig } from '@scripts/filesManager';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import { LendingContracts, delay, getContractsConfigInstant, waitForTx } from '@src/utils';

export const deployZkSyncConfigurator = async (
  environment: ZkSyncDeploymentEnvironment
): Promise<string> => {
  const { chainId, env, networkName, deployer, delayInMs } = environment;

  console.log('Deploying Lending pool configurator');

  const lendingPoolConfiguratorFactory = await deployer.loadArtifact(LendingContracts.Configurator);

  const contract = await deployer.deploy(lendingPoolConfiguratorFactory);

  const lendingPoolConfiguratorAddress = contract.address;

  console.log(`Lending pool configurator deployed: ${lendingPoolConfiguratorAddress}`);

  await delay(delayInMs);

  writeToContractsConfig(
    {
      poolConfigurator: lendingPoolConfiguratorAddress,
    },
    chainId,
    env,
    networkName
  );

  return lendingPoolConfiguratorAddress;
};

export const initializeZkSyncConfigurator = async (environment: ZkSyncDeploymentEnvironment) => {
  console.log('Initializing Lending pool configurator');
  const { env, chainId, delayInMs } = environment;

  const lendingPoolConfigurationImpl = getContractsConfigInstant(
    chainId,
    env,
    true
  )?.poolConfigurator;

  if (!lendingPoolConfigurationImpl) throw Error('lendingPoolConfigurationImpl not found');

  const addressProvider = connectToContractsRuntime(environment).addressProvider;
  if (!addressProvider) throw Error('addressProvider not found');

  const setLendingPoolConfImplGasLimit =
    await addressProvider.estimateGas.setLendingPoolConfiguratorImpl(lendingPoolConfigurationImpl);

  await waitForTx(
    await addressProvider.setLendingPoolConfiguratorImpl(lendingPoolConfigurationImpl, {
      gasLimit: setLendingPoolConfImplGasLimit,
    })
  );

  console.log('setting lending pool configuration impl - Done');

  const configuratorProxy = await addressProvider.getLendingPoolConfigurator();

  writeToContractsConfig(
    { poolConfiguratorProxy: configuratorProxy },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  console.log(`setLendingPoolConfiguratorImpl Done. Proxy configuration: ${configuratorProxy}`);
  await delay(delayInMs);

  return configuratorProxy;
};
