import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Wallet } from 'zksync-web3';
import dotenv from 'dotenv';
import { saveDeploymentAddress, getDeploymentAddress } from '../../deployments/src/utils';

dotenv.config({ path: '../../.env' });

export default async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  console.log('Running deploy script for ComposableStablePoolFactory contract');

  const privateKey = process.env.ZK_SYNC_DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('Missing private key to deploy');
  }

  const wallet = new Wallet(privateKey);

  const deployer = new Deployer(hre, wallet);

  const artifact = await deployer.loadArtifact('ComposableStablePoolFactory');

  console.log('Deploying ComposableStablePoolFactory contract');

  const { Vault, ProtocolFeePercentagesProvider } = getDeploymentAddress(hre.network.name);

  const initialPauseWindowDuration = 90 * 24 * 60 * 60;

  const bufferPeriodDuration = 30 * 24 * 60 * 60;

  const composableStablePoolFactoryContract = await deployer.deploy(artifact, [
    Vault,
    ProtocolFeePercentagesProvider,
    initialPauseWindowDuration,
    bufferPeriodDuration,
  ]);

  const composableStablePoolFactoryContractAddress = composableStablePoolFactoryContract.address;

  console.log(`${artifact.contractName} was deployed to ${composableStablePoolFactoryContractAddress}`);

  saveDeploymentAddress(artifact.contractName, composableStablePoolFactoryContractAddress);
}
