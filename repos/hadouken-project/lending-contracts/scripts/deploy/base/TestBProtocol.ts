import { Deployer } from '@src/types';
import { LendingContracts } from '@src/utils';
import { ethers } from 'hardhat';

export async function deployTestBProtocol(deployer: Deployer, lendingPool: string) {
  console.log('Deploying Collateral Manager');

  const TestBProtocolFactory = await ethers.getContractFactory(
    LendingContracts.TestBProtocol,
    deployer
  );

  const deployTransaction = TestBProtocolFactory.getDeployTransaction(lendingPool);

  const TestBProtocolGasLimit = await deployer.estimateGas(deployTransaction);
  deployTransaction.gasLimit = TestBProtocolGasLimit;

  const receipt = await (await deployer.sendTransaction(deployTransaction)).wait();

  console.log(`TestBProtocol deployed: ${receipt.contractAddress}`);

  return receipt.contractAddress;
}
