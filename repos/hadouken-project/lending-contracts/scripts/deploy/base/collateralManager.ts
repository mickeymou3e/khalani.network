import { ScriptRunEnvironment } from '@src/types';
import { LendingContracts } from '@src/utils';
import { ethers } from 'hardhat';

export async function deployBaseCollateralManager(environment: ScriptRunEnvironment) {
  console.log('Deploying Collateral Manager');
  const { deployer } = environment;

  const collateralManagerFactory = await ethers.getContractFactory(
    LendingContracts.CollateralManager,
    deployer
  );

  const deployTransaction = collateralManagerFactory.getDeployTransaction();

  const collateralManagerGasLimit = await deployer.estimateGas(deployTransaction);
  deployTransaction.gasLimit = collateralManagerGasLimit;

  const receipt = await (await deployer.sendTransaction(deployTransaction)).wait();

  console.log(`Collateral Manager deployed: ${receipt.contractAddress}`);

  return receipt.contractAddress;
}
