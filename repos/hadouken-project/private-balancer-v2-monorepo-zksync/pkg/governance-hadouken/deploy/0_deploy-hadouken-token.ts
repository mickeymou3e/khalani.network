import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { Wallet } from 'zksync-web3';
import { saveDeploymentAddress } from '../../deployments/src/utils';
import { BigNumber } from 'ethers';
import dotenv from 'dotenv';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

dotenv.config({ path: '../../.env' });

const func = async function (hre: HardhatRuntimeEnvironment) {
  const privateKey = process.env.ZK_SYNC_DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('Missing private key to deploy');
  }

  const wallet = new Wallet(privateKey);

  const deployer = new Deployer(hre, wallet);

  const artifact = await deployer.loadArtifact('HadoukenToken');

  console.log('Deploying Hadouken Token');

  const maxTokens = 1000000;
  const initSupply = BigNumber.from(10).pow(18).mul(maxTokens);

  const hadoukenTokenContract = await deployer.deploy(artifact, [initSupply]);

  const hadoukenTokenContractAddress = hadoukenTokenContract.address;

  console.log(`${artifact.contractName} was deployed to ${hadoukenTokenContractAddress}`);

  saveDeploymentAddress(artifact.contractName, hadoukenTokenContractAddress);
};

func.tags = ['hadouken_token'];

export default func;
