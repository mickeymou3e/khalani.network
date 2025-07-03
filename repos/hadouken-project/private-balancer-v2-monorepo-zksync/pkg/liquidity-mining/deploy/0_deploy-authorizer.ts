import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Wallet } from 'zksync-web3';
import dotenv from 'dotenv';
import { saveDeploymentAddress } from '../../deployments/src/utils';

dotenv.config({ path: '../../.env' });

const func = async function (hre: HardhatRuntimeEnvironment) {
  console.log('Running deploy script for Authorizer contract');

  const privateKey = process.env.ZK_SYNC_DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('Missing private key to deploy');
  }

  const wallet = new Wallet(privateKey);

  const deployer = new Deployer(hre, wallet);

  const artifact = await deployer.loadArtifact('Authorizer');

  console.log('Deploying Authorizer contract');

  const admin = process.env.ADMIN;

  if (!admin) {
    throw new Error('Missing Admin address');
  }

  const authorizerContract = await deployer.deploy(artifact, [admin]);

  const authorizerContractAddress = authorizerContract.address;

  console.log(`${artifact.contractName} was deployed to ${authorizerContractAddress}`);

  saveDeploymentAddress(artifact.contractName, authorizerContractAddress);
};

func.tags = ['base'];

export default func;
