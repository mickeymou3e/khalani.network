import { writeToContractsConfig } from '@scripts/filesManager';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import { LendingContracts, delay, waitForTx } from '@src/utils';

import { connectToContractsRuntime } from '@scripts/connect';
import { deployPoolTokens } from '..';

const deployLendingPool = async (environment: ZkSyncDeploymentEnvironment) => {
  console.log('Deploying Lending Pool');

  const { deployer } = environment;

  const artifact = await deployer.loadArtifact(LendingContracts.LendingPool);

  const lendingPoolContract = await deployer.deploy(artifact);

  const lendingPoolAddress = lendingPoolContract.address;

  console.log(`Lending Pool deployed: ${lendingPoolAddress}`);

  writeToContractsConfig(
    { lendingPool: lendingPoolAddress },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  await delay(environment.delayInMs);

  const addressProvider = connectToContractsRuntime(environment).addressProvider;
  if (!addressProvider) throw Error('addressProvider not found');

  const lendingPool = connectToContractsRuntime(environment).poolWithoutProxy;

  if (!lendingPool) throw Error('lendingPool is not defined');

  console.log('initializing lending pool');

  await waitForTx(await lendingPool.initialize(addressProvider.address));

  console.log('lending pool initialized');

  return lendingPoolAddress;
};

export async function deployZkSyncLendingPool(
  environment: ZkSyncDeploymentEnvironment,
  redeployImplementation: boolean
): Promise<string> {
  const { deployer } = environment;

  const lendingPoolAddress = await deployLendingPool(environment);

  if (redeployImplementation) return lendingPoolAddress;

  await delay(environment.delayInMs);

  const addressProvider = connectToContractsRuntime(environment).addressProvider;
  if (!addressProvider) throw Error('addressProvider not found');

  const lendingPool = connectToContractsRuntime(environment).poolWithoutProxy;

  if (!lendingPool) throw Error('lendingPool is not defined');

  const lendingPoolAddressProvider = await lendingPool.getAddressesProvider();

  console.log(`pool addressProvider Address: ${lendingPoolAddressProvider}`);

  await delay(environment.delayInMs);

  await waitForTx(await addressProvider.setLendingPoolImpl(lendingPoolAddress));

  console.log(
    `Lending pool address provider initialized, pool address: ${await addressProvider.getLendingPool()}`
  );

  await delay(environment.delayInMs);

  const lendingPoolProxy = await addressProvider.getLendingPool();

  writeToContractsConfig(
    { lendingPoolProxy: lendingPoolProxy },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  console.log(`Lending pool proxy address: ${lendingPoolProxy}`);

  await delay(2000);

  const configuratorFactory = await deployer.loadArtifact(LendingContracts.Configurator);

  console.log('Deploying configurator');

  const configurator = await deployer.deploy(configuratorFactory);

  writeToContractsConfig(
    { poolConfigurator: configurator.address },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  await delay(2000);

  console.log(`Configurator deployed: ${configurator.address}`);

  console.log('Setting lending pool configuration impl');

  await waitForTx(await addressProvider.setLendingPoolConfiguratorImpl(configurator.address));

  const configuratorProxy = await addressProvider.getLendingPoolConfigurator();

  writeToContractsConfig(
    { poolConfiguratorProxy: configuratorProxy },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  console.log(`setLendingPoolConfiguratorImpl Done. Proxy configuration: ${configuratorProxy}`);

  await delay(2000);

  const {
    variableTokenAddress,
    tokensAndRatesAddress,
    stableTokenAddress,
    aTokenAddress,
    stableAndVariableTokensHelperAddress,
  } = await deployPoolTokens(environment);

  writeToContractsConfig(
    {
      variableDebtToken: variableTokenAddress,
      stableDebtToken: stableTokenAddress,
      aToken: aTokenAddress,
      aTokenAndRateHelper: tokensAndRatesAddress,
      stableAndVariableTokensHelper: stableAndVariableTokensHelperAddress,
    },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  return lendingPool.address;
}
