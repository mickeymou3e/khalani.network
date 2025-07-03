import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { saveDeploymentAddress } from '.././../deployments/cli/utils/save';
import dotenv from 'dotenv';

dotenv.config({ path: '../../../.env' });

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const admin = process.env.AUTHORIZER_ADMIN || deployer;

  const network = hre.network.name;

  const signer = await ethers.getSigner(deployer);

  const authorizerFactory = await ethers.getContractFactory('Authorizer', signer);

  const deployRequest = authorizerFactory.getDeployTransaction(admin);

  const receipt = await (await signer.sendTransaction(deployRequest)).wait();

  const authorizerAddress = receipt.contractAddress;
  console.log('Authorizer deployed ', authorizerAddress);

  saveDeploymentAddress('Authorizer', authorizerAddress, network);
};

func.tags = ['base'];

export default func;
