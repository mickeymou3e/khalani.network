import { ethers } from 'hardhat';

import { writeToContractsConfig } from '@scripts/filesManager';
import { ScriptRunEnvironment } from '@src/types';
import { LendingContracts, getConfigInstant } from '@src/utils';

export async function deployBaseRegistry(environment: ScriptRunEnvironment) {
  console.log('Deploying registry');
  const { deployer, chainId, env, networkName } = environment;
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const registryFactory = await ethers.getContractFactory(LendingContracts.Registry, deployer);

  const deployerRequest = registryFactory.getDeployTransaction({
    gasPrice: config.gasPrice,
    gasLimit: config.gasLimit,
  });

  const registryGasLimit = await deployer.estimateGas(deployerRequest);

  deployerRequest.gasLimit = registryGasLimit;

  const receipt = await (await deployer.sendTransaction(deployerRequest)).wait();

  writeToContractsConfig({ registry: receipt.contractAddress }, chainId, env, networkName);

  console.log(`Registry deploy: ${receipt.contractAddress}`);

  return receipt.contractAddress;
}
