import { fp } from '@balancer-labs/v2-helpers/src/numbers';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Wallet } from 'zksync-web3';
import dotenv from 'dotenv';
import { saveDeploymentAddress, getDeploymentAddress } from '../../deployments/src/utils';

dotenv.config({ path: '../../.env' });

export default async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  console.log('Running deploy script for ProtocolFeePercentagesProvider contract');

  const privateKey = process.env.ZK_SYNC_DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('Missing private key to deploy');
  }

  const wallet = new Wallet(privateKey);

  const deployer = new Deployer(hre, wallet);

  const artifact = await deployer.loadArtifact('ProtocolFeePercentagesProvider');

  console.log('Deploying ProtocolFeePercentagesProvider contract');

  const maxYieldValue = fp(0.5);

  const maxAUMValue = fp(0.5);

  const { Vault } = getDeploymentAddress(hre.network.name);

  const protocolFeePercentagesProviderContract = await deployer.deploy(artifact, [Vault, maxYieldValue, maxAUMValue]);

  const protocolFeePercentagesProviderAddress = protocolFeePercentagesProviderContract.address;

  console.log(`${artifact.contractName} was deployed to ${protocolFeePercentagesProviderAddress}`);

  saveDeploymentAddress(artifact.contractName, protocolFeePercentagesProviderAddress);
}
