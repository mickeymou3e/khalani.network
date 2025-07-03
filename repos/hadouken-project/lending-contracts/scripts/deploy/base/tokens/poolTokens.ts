import { PoolTokens } from '@scripts/types';
import { Deployer, ScriptRunEnvironment, tEthereumAddress } from '@src/types';
import { LendingContracts, getConfigInstant, getContractsConfigInstant } from '@src/utils';
import { ethers } from 'hardhat';

export const deployBasePoolTokens = async (
  environment: ScriptRunEnvironment
): Promise<PoolTokens> => {
  const { deployer, env, chainId } = environment;
  const configContracts = getContractsConfigInstant(chainId, env, true);
  if (!configContracts) throw Error('configContracts not found');
  const lendingPool = configContracts.lendingPoolProxy;
  const addressProvider = configContracts.addressProvider;
  const configurator = configContracts.poolConfiguratorProxy;

  const aTokenAddress = await deployBaseAToken(deployer);
  const stableTokenAddress = await deployBaseStableDebtToken(deployer);
  const variableTokenAddress = await deployBaseVariableDebtToken(deployer);
  const tokensAndRatesAddress = await deployBaseATokensAndRatesHelper(
    deployer,
    lendingPool,
    addressProvider,
    configurator
  );

  const stableAndVariableTokensHelperAddress = await deployBaseStableAndVariableTokensHelper(
    environment,
    lendingPool,
    addressProvider
  );

  return {
    aTokenAddress,
    stableTokenAddress,
    variableTokenAddress,
    tokensAndRatesAddress,
    stableAndVariableTokensHelperAddress,
  };
};

const deployBaseAToken = async (deployer: Deployer) => {
  console.log('Deploying A token');

  const aTokenFactory = await ethers.getContractFactory(LendingContracts.AToken, deployer);
  const deployTransaction = aTokenFactory.getDeployTransaction();

  const aTokenGasLimit = await deployer.estimateGas(deployTransaction);
  deployTransaction.gasLimit = aTokenGasLimit;

  const receipt = await (await deployer.sendTransaction(deployTransaction)).wait();

  console.log(`A token deployed: ${receipt.contractAddress}`);
  return receipt.contractAddress;
};

const deployBaseStableDebtToken = async (deployer: Deployer) => {
  console.log('Deploying Stable Debt token');

  const stableDebtFactory = await ethers.getContractFactory(
    LendingContracts.StableDebtToken,
    deployer
  );

  const deployTransaction = stableDebtFactory.getDeployTransaction();

  const stableDebtGasLimit = await deployer.estimateGas(deployTransaction);
  deployTransaction.gasLimit = stableDebtGasLimit;

  const receipt = await (await deployer.sendTransaction(deployTransaction)).wait();

  console.log(`Stable Debt token deployed: ${receipt.contractAddress}`);
  return receipt.contractAddress;
};

const deployBaseVariableDebtToken = async (deployer: Deployer) => {
  console.log('Deploying Variable Debt token');

  const variableDebtFactory = await ethers.getContractFactory(
    LendingContracts.VariableDebtToken,
    deployer
  );
  const deployTransaction = variableDebtFactory.getDeployTransaction();

  const variableDebtGasLimit = await deployer.estimateGas(deployTransaction);
  deployTransaction.gasLimit = variableDebtGasLimit.mul(2);

  const receipt = await (await deployer.sendTransaction(deployTransaction)).wait();

  console.log(`Variable Debt token deployed: ${receipt.contractAddress}`);
  return receipt.contractAddress;
};

export const deployBaseATokensAndRatesHelper = async (
  deployer: Deployer,
  lendingPool: tEthereumAddress,
  addressProvider: tEthereumAddress,
  lendingPoolConfiguration: tEthereumAddress
) => {
  console.log('Deploying A tokens and rate helper');

  const variableDebtFactory = await ethers.getContractFactory(
    LendingContracts.ATokensAndRatesHelper,
    deployer
  );

  const deployTransaction = variableDebtFactory.getDeployTransaction(
    lendingPool,
    addressProvider,
    lendingPoolConfiguration
  );

  const variableDebtGasLimit = await deployer.estimateGas(deployTransaction);
  deployTransaction.gasLimit = variableDebtGasLimit;

  const receipt = await (await deployer.sendTransaction(deployTransaction)).wait();

  console.log(`A tokens and rate helper deployed: ${receipt.contractAddress}`);
  return receipt.contractAddress;
};

export const deployBaseStableAndVariableTokensHelper = async (
  environment: ScriptRunEnvironment,
  lendingPool: tEthereumAddress,
  addressProvider: tEthereumAddress
) => {
  console.log('Deploying Stable and Variable Token Helper');
  const { deployer, chainId, env } = environment;
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const stableAndVariableTokenHelper = await ethers.getContractFactory(
    LendingContracts.StableAndVariableTokensHelper,
    deployer
  );

  const deployTransaction = stableAndVariableTokenHelper.getDeployTransaction(
    lendingPool,
    addressProvider,
    { gasPrice: config.gasPrice }
  );

  const stableAndVariableTokensHelperGasLimit = await deployer.estimateGas(deployTransaction);
  deployTransaction.gasLimit = stableAndVariableTokensHelperGasLimit;

  const receipt = await (await deployer.sendTransaction(deployTransaction)).wait();

  console.log(`Deploying Stable and Variable Token Helper deployed: ${receipt.contractAddress}`);
  return receipt.contractAddress;
};
