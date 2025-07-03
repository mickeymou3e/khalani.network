import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { saveDeploymentAddress } from '../../deployments/cli/utils/save';
import { MONTH } from '@balancer-labs/v2-helpers/src/time';
import { getDeploymentsAddresses } from '../../deployments/cli/config.command';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const network = hre.network.name;

  const signer = await ethers.getSigner(deployer);

  const vaultsFactory = await ethers.getContractFactory('Vault', signer);

  const { Authorizer } = getDeploymentsAddresses(network);

  const deployRequest = vaultsFactory.getDeployTransaction(Authorizer, ethers.constants.AddressZero, 3 * MONTH, MONTH);

  const receipt = await (await signer.sendTransaction(deployRequest)).wait();

  const vaultAddress = receipt.contractAddress;

  console.log('Vault deployed ', vaultAddress);

  saveDeploymentAddress('Vault', vaultAddress, network);
};

func.tags = ['base'];

export default func;
