import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { saveDeploymentAddress } from '../../deployments/cli/utils/save';

import { getDeploymentsAddresses } from '../../deployments/cli/config.command';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const network = hre.network.name;

  const signer = await ethers.getSigner(deployer);

  const { Vault } = getDeploymentsAddresses(network);

  const balancerQueriesFactory = await ethers.getContractFactory('BalancerQueries', signer);

  const deployRequest = balancerQueriesFactory.getDeployTransaction(Vault);

  const balancerQueriesReceipt = await (await signer.sendTransaction(deployRequest)).wait();

  const balancerQueriesAddress = balancerQueriesReceipt.contractAddress;

  console.log('BalancerQueries deployed', balancerQueriesAddress);

  saveDeploymentAddress('BalancerQueries', balancerQueriesAddress, network);
};

func.tags = ['base'];

export default func;
