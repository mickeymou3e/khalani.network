import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { Wallet } from 'zksync-web3';
import { getDeploymentAddress, saveDeploymentAddress } from '../../deployments/src/utils';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { lockdrop as config } from '../../config/src';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const func = async function (hre: HardhatRuntimeEnvironment) {
  const privateKey = process.env.ZK_SYNC_DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('Missing private key to deploy');
  }

  const wallet = new Wallet(privateKey);

  const deployer = new Deployer(hre, wallet);

  const artifact = await deployer.loadArtifact('HadoukenLockdrop');

  console.log('Deploying Hadouken Lockdrop');

  const networkChainId = '0x118';
  if (!networkChainId) throw 'network has no chain id set';

  const networkConfig = config.chains.find(({ chainId }) => chainId === networkChainId);
  if (!networkConfig) throw `No config for network ${networkChainId}`;
  const { husdAddress, triCryptoAddress, wethAddress } = networkConfig;

  const { HadoukenToken, Vault } = getDeploymentAddress(hre.network.name);

  const lockdropContract = await deployer.deploy(artifact, [
    config.phaseOneStartTime,
    husdAddress,
    triCryptoAddress,
    HadoukenToken,
    wethAddress,
    Vault,
  ]);

  const lockdropContractAddress = lockdropContract.address;

  console.log(`${artifact.contractName} was deployed to ${lockdropContractAddress}`);

  saveDeploymentAddress(artifact.contractName, lockdropContractAddress);
};

func.tags = ['lockdrop'];

export default func;
