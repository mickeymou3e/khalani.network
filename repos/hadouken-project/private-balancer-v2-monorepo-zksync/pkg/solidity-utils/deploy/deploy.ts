import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { Wallet } from 'zksync-web3';
import dotenv from 'dotenv';
import { saveDeploymentAddress } from '../../deployments/src/utils';

dotenv.config({ path: '../../.env' });

export default async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  console.log('Running deploy script for AddressBalances contract');

  const privateKey = process.env.ZK_SYNC_DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('Missing private key to deploy');
  }

  const wallet = new Wallet(privateKey);

  const deployer = new Deployer(hre, wallet);

  const artifact = await deployer.loadArtifact('AddressBalances');

  console.log('Deploying AddressBalances contract');

  const addressBalancesContract = await deployer.deploy(artifact);

  const addressBalancesContractAddress = addressBalancesContract.address;

  console.log(`${artifact.contractName} was deployed to ${addressBalancesContractAddress}`);

  saveDeploymentAddress(artifact.contractName, addressBalancesContractAddress);
}
