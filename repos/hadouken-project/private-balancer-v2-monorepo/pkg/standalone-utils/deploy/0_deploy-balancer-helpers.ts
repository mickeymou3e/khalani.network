import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { saveDeploymentAddress } from '../../deployments/cli/utils/save';

import { getDeploymentsAddresses } from '../../deployments/cli/config.command';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const network = hre.network.name;

  const signer = await ethers.getSigner(deployer);

  const { Vault } = getDeploymentsAddresses(network);

  const balancerHelpersFactory = await ethers.getContractFactory('BalancerHelpers', signer);

  const deployRequest = balancerHelpersFactory.getDeployTransaction(Vault);

  const balancerHelpersReceipt = await (await signer.sendTransaction(deployRequest)).wait();

  const balancerHelpersAddress = balancerHelpersReceipt.contractAddress;

  console.log('BalancerHelpers deployed ', balancerHelpersAddress);

  saveDeploymentAddress('BalancerHelpers', balancerHelpersAddress, network);
};

func.tags = ['base'];

export default func;
