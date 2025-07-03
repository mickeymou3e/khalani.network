import { ContractFactory } from 'ethers';

import { LendingPool__factory } from '@src/typechain/godwoken/factories/LendingPool__factory';

import { connectToContractsRuntime } from '@scripts/connect';
import { writeToContractsConfig } from '@scripts/filesManager';
import { ScriptRunEnvironment } from '@src/types';
import { delay, getContractsConfigInstant, waitForTx } from '@src/utils';
import { deployPoolTokens } from '..';
import * as LendingPool_JSON from '../../../artifacts/contracts/protocol/lendingpool/LendingPool.sol/LendingPool.json';
import { deployBaseConfigurator } from './configurator';
import { parseLibrariesAddressToContractData } from './libraries';

const deployLendingPool = async (environment: ScriptRunEnvironment) => {
  console.log('Deploying Lending Pool');
  const { deployer, chainId, env } = environment;
  const contractsConfig = getContractsConfigInstant(chainId, env, true);

  const librariesAddress = contractsConfig?.libraries;
  const addressProviderAddress = contractsConfig?.addressProvider;

  if (!librariesAddress) {
    throw Error('Libraries has not been deployed! Aborting deployment of lending pool.');
  }
  if (!addressProviderAddress) {
    throw Error('Address provider has not been deployed! Aborting deployment of lending pool.');
  }
  const libraries = parseLibrariesAddressToContractData(
    librariesAddress.reserve,
    librariesAddress.validation
  );

  const newBytecode = LendingPool__factory.linkBytecode(libraries);

  const LendingPoolFactory = new ContractFactory(
    LendingPool_JSON.abi,
    newBytecode,
    deployer
  ) as LendingPool__factory;

  const deployerRequest = LendingPoolFactory.getDeployTransaction();

  const lendingPoolGasLimit = await deployer.estimateGas(deployerRequest);
  deployerRequest.gasLimit = lendingPoolGasLimit;

  const receipt = await (await deployer.sendTransaction(deployerRequest)).wait();

  const lendingPoolAddress = receipt.contractAddress;
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

export async function deployBaseLendingPool(
  environment: ScriptRunEnvironment,
  redeployImplementation: boolean
) {
  console.log('redeployImplementation', redeployImplementation);
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

  const configuratorAddress = await deployBaseConfigurator(environment);

  writeToContractsConfig(
    { poolConfigurator: configuratorAddress },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  await delay(2000);

  console.log('Setting lending pool configuration impl');

  await waitForTx(await addressProvider.setLendingPoolConfiguratorImpl(configuratorAddress));

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
