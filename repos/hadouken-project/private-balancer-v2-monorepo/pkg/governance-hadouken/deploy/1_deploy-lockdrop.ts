import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { saveDeploymentAddress } from '.././../deployments/cli/utils/save';
import { getDeploymentsAddresses } from '../../deployments/cli/config.command';
import { lockdrop as config } from '../../config/src';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const network = hre.network.name;

  const signer = await ethers.getSigner(deployer);

  const networkConfig = config.chains.find(({ name }) => name === network);
  if (!networkConfig) throw `No config for network ${network}`;
  const { husdAddress, triCryptoAddress, priceTokenAddress } = networkConfig;

  const hadoukenLockdropFactory = await ethers.getContractFactory('HadoukenLockdrop', signer);

  const { HadoukenToken, Vault } = getDeploymentsAddresses(network);

  const deployRequest = hadoukenLockdropFactory.getDeployTransaction(
    config.phaseOneStartTime,
    husdAddress,
    triCryptoAddress,
    HadoukenToken,
    priceTokenAddress,
    Vault
  );

  const receipt = await (await signer.sendTransaction(deployRequest)).wait();

  const hadoukenLockdropAddress = receipt.contractAddress;
  console.log('HadoukenLockdrop deployed ', hadoukenLockdropAddress);

  saveDeploymentAddress('HadoukenLockdrop', hadoukenLockdropAddress, network);
};

func.tags = ['lockdrop'];

export default func;
