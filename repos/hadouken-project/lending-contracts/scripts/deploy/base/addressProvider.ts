import { ScriptRunEnvironment } from '@src/types';
import { LendingContracts } from '@src/utils';

import hre from 'hardhat';

const { ethers } = hre;

export async function deployBaseAddressProvider(
  environment: ScriptRunEnvironment,
  marketId: string
) {
  console.log('Deploying Address provider');
  const { deployer } = environment;

  const addressProviderFactory = await ethers.getContractFactory(
    LendingContracts.AddressProvider,
    deployer
  );

  const deployerRequest = addressProviderFactory.getDeployTransaction(marketId);

  const addressProviderGasLimit = await deployer.estimateGas(deployerRequest);
  deployerRequest.gasLimit = addressProviderGasLimit;

  const receipt = await (await deployer.sendTransaction(deployerRequest)).wait();

  const addressProviderAddress = receipt.contractAddress;

  console.log(`Address provider deployed: ${addressProviderAddress}`);

  return addressProviderAddress;
}
