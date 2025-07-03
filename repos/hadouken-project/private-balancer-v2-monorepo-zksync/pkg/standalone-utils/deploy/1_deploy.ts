import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Wallet } from 'zksync-web3';
import dotenv from 'dotenv';
import { saveDeploymentAddress, getDeploymentAddress } from '../../deployments/src/utils';

dotenv.config({ path: '../../.env' });

export default async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  console.log('Running deploy script for BalancerHelpers contract');

  const privateKey = process.env.ZK_SYNC_DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('Missing private key to deploy');
  }

  const wallet = new Wallet(privateKey);

  const deployer = new Deployer(hre, wallet);

  const artifact = await deployer.loadArtifact('BalancerHelpers');

  console.log('Deploying BalancerHelpers contract');

  const { Vault } = getDeploymentAddress(hre.network.name);

  const balancerHelpersContract = await deployer.deploy(artifact, [Vault]);

  const balancerHelpersContractAddress = balancerHelpersContract.address;

  console.log(`${artifact.contractName} was deployed to ${balancerHelpersContractAddress}`);

  saveDeploymentAddress(artifact.contractName, balancerHelpersContractAddress);
}
