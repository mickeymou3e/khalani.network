import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const signer = await ethers.getSigner(deployer);

  const mockRateProvider = await ethers.getContractFactory('MockRateProvider', signer);

  const deployRequest = mockRateProvider.getDeployTransaction();

  const receipt = await (await signer.sendTransaction(deployRequest)).wait();

  const mockRateProviderAddress = receipt.contractAddress;
  console.log('Mock rate provider deployed ', mockRateProviderAddress);
};

func.tags = ['rate-provider'];

export default func;
