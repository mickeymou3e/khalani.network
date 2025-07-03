import { writeToContractsConfig } from '@scripts/filesManager';
import { ScriptRunEnvironment } from '@src/types';
import { LendingContracts } from '@src/utils';
import { ethers } from 'hardhat';

export async function deployBaseConfigurator(environment: ScriptRunEnvironment) {
  console.log('Deploying configurator');
  const { deployer, env, chainId, networkName } = environment;

  const configuratorFactory = await ethers.getContractFactory(
    LendingContracts.Configurator,
    deployer
  );

  const deployTransaction = configuratorFactory.getDeployTransaction();

  const configuratorGasLimit = await deployer.estimateGas(deployTransaction);
  deployTransaction.gasLimit = configuratorGasLimit;

  const receipt = await (await deployer.sendTransaction(deployTransaction)).wait();

  writeToContractsConfig(
    {
      poolConfigurator: receipt.contractAddress,
    },
    chainId,
    env,
    networkName
  );

  console.log(`Configurator deployed: ${receipt.contractAddress}`);

  return receipt.contractAddress;
}
