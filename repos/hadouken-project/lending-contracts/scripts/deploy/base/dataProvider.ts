import { ethers } from 'hardhat';

import { ScriptRunEnvironment } from '@src/types';
import { LendingContracts, getContractsConfigInstant } from '@src/utils';

export async function deployBaseDataProvider(environment: ScriptRunEnvironment) {
  console.log('Deploying Data provider');
  const { deployer, chainId, env } = environment;

  const contractsConfig = getContractsConfigInstant(chainId, env, true);
  if (!contractsConfig) throw Error('contractsConfig not found');
  const dataProviderFactory = await ethers.getContractFactory(
    LendingContracts.DataProvider,
    deployer
  );

  const deployTransaction = dataProviderFactory.getDeployTransaction(
    contractsConfig.addressProvider
  );

  const dataProviderGasLimit = await deployer.estimateGas(deployTransaction);
  deployTransaction.gasLimit = dataProviderGasLimit;

  const receipt = await (await deployer.sendTransaction(deployTransaction)).wait();

  console.log(`Data provider deployed: ${receipt.contractAddress}`);

  return receipt.contractAddress;
}
