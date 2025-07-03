import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { saveDeploymentAddress } from '.././../deployments/cli/utils/save';
import { BigNumber } from 'ethers';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const network = hre.network.name;

  const signer = await ethers.getSigner(deployer);

  const hadoukenTokenFactory = await ethers.getContractFactory('HadoukenToken', signer);

  const maxTokens = 1000000;
  const initSupply = BigNumber.from(10).pow(18).mul(maxTokens);

  const deployRequest = hadoukenTokenFactory.getDeployTransaction(initSupply);

  const receipt = await (await signer.sendTransaction(deployRequest)).wait();

  const hadoukenTokenAddress = receipt.contractAddress;
  console.log('Hadouken Token deployed ', hadoukenTokenAddress);

  saveDeploymentAddress('HadoukenToken', hadoukenTokenAddress, network);
};

func.tags = ['hadouken_token'];

export default func;
