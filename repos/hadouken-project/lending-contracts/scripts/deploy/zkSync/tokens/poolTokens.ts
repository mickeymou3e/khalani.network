import { PoolTokens } from '@scripts/types';
import { ZkSyncDeploymentEnvironment, tEthereumAddress } from '@src/types';
import { LendingContracts, delay, getContractsConfigInstant } from '@src/utils';

export async function deployZkSyncPoolTokens(
  environment: ZkSyncDeploymentEnvironment
): Promise<PoolTokens> {
  const { chainId, env } = environment;

  const configContracts = getContractsConfigInstant(chainId, env, true);
  if (!configContracts) throw Error('configContracts not found');
  const lendingPool = configContracts.lendingPoolProxy;
  const addressProvider = configContracts.addressProvider;
  const configurator = configContracts.poolConfiguratorProxy;

  const aTokenAddress = await deployZkSyncAToken(environment);
  await delay(environment.delayInMs);
  const stableTokenAddress = await deployZkSyncStableDebtToken(environment);
  await delay(environment.delayInMs);
  const variableTokenAddress = await deployZkSyncVariableDebtToken(environment);
  await delay(environment.delayInMs);
  const tokensAndRatesAddress = await deployZkSyncATokensAndRatesHelper(
    environment,
    lendingPool,
    addressProvider,
    configurator
  );
  await delay(environment.delayInMs);
  const stableAndVariableTokensHelperAddress = await deployZkSyncStableAndVariableTokensHelper(
    environment,
    lendingPool,
    addressProvider
  );
  await delay(environment.delayInMs);
  return {
    aTokenAddress,
    stableTokenAddress,
    variableTokenAddress,
    tokensAndRatesAddress,
    stableAndVariableTokensHelperAddress,
  };
}

const deployZkSyncAToken = async (environment: ZkSyncDeploymentEnvironment) => {
  console.log('Deploying A token');
  const { deployer } = environment;
  const aTokenFactory = await deployer.loadArtifact(LendingContracts.AToken);

  const contract = await deployer.deploy(aTokenFactory);

  console.log(`A token deployed: ${contract.address}`);

  return contract.address;
};

const deployZkSyncStableDebtToken = async (environment: ZkSyncDeploymentEnvironment) => {
  console.log('Deploying Stable Debt token');
  const { deployer } = environment;
  const stableDebtFactory = await deployer.loadArtifact(LendingContracts.StableDebtToken);

  const contract = await deployer.deploy(stableDebtFactory);

  console.log(`Stable Debt token deployed: ${contract.address}`);

  return contract.address;
};

const deployZkSyncVariableDebtToken = async (environment: ZkSyncDeploymentEnvironment) => {
  console.log('Deploying Variable Debt token');
  const { deployer } = environment;
  const variableDebtFactory = await deployer.loadArtifact(LendingContracts.VariableDebtToken);

  const contract = await deployer.deploy(variableDebtFactory);

  console.log(`Variable Debt token deployed: ${contract.address}`);

  return contract.address;
};

export const deployZkSyncATokensAndRatesHelper = async (
  environment: ZkSyncDeploymentEnvironment,
  lendingPool: tEthereumAddress,
  addressProvider: tEthereumAddress,
  lendingPoolConfiguration: tEthereumAddress
) => {
  console.log('Deploying A tokens and rate helper');
  const { deployer } = environment;
  const variableDebtFactory = await deployer.loadArtifact(LendingContracts.ATokensAndRatesHelper);

  const contract = await deployer.deploy(variableDebtFactory, [
    lendingPool,
    addressProvider,
    lendingPoolConfiguration,
  ]);

  console.log(`A tokens and rate helper deployed: ${contract.address}`);

  return contract.address;
};

export const deployZkSyncStableAndVariableTokensHelper = async (
  environment: ZkSyncDeploymentEnvironment,
  lendingPool: tEthereumAddress,
  addressProvider: tEthereumAddress
) => {
  console.log('Deploying Stable and Variable Token Helper');
  const { deployer } = environment;

  const stableAndVariableTokenHelper = await deployer.loadArtifact(
    LendingContracts.StableAndVariableTokensHelper
  );

  const contract = await deployer.deploy(stableAndVariableTokenHelper, [
    lendingPool,
    addressProvider,
  ]);

  console.log(`Deploying Stable and Variable Token Helper deployed: ${contract.address}`);

  return contract.address;
};
