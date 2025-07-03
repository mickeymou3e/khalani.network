import { MONTH } from '@balancer-labs/v2-helpers/src/time';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Wallet } from 'zksync-web3';
import dotenv from 'dotenv';
import { saveDeploymentAddress, getDeploymentAddress } from '../../deployments/src/utils';
import zkSyncTokensMainnet from '../../config/src/tokens/tokens.zksync-mainnet.json';
import zkSyncTokensTestnet from '../../config/src/tokens/tokens.zksync-testnet.json';

dotenv.config({ path: '../../.env' });

export default async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  console.log('Running deploy script for Vault contract');

  const privateKey = process.env.ZK_SYNC_DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('Missing private key to deploy');
  }

  const wallet = new Wallet(privateKey);

  const deployer = new Deployer(hre, wallet);

  const artifact = await deployer.loadArtifact('Vault');

  console.log('Deploying Vault contract');

  const { Authorizer } = getDeploymentAddress(hre.network.name);

  const wethAddress =
    hre.network.name === 'zkTestnet' ? zkSyncTokensTestnet.wrappedEthAddress : zkSyncTokensMainnet.wrappedEthAddress;

  if (!wethAddress) throw new Error('WETH address is incorrect');

  const vaultContract = await deployer.deploy(artifact, [Authorizer, wethAddress, 3 * MONTH, MONTH]);

  const vaultContractAddress = vaultContract.address;

  console.log(`${artifact.contractName} was deployed to ${vaultContractAddress}`);

  saveDeploymentAddress(artifact.contractName, vaultContractAddress);
}
