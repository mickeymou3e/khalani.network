import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { saveDeploymentAddress } from '../../deployments/cli/utils/save';

import { getDeploymentsAddresses } from '../../deployments/cli/config.command';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const network = hre.network.name;

  const signer = await ethers.getSigner(deployer);

  const { Vault, ProtocolFeePercentagesProvider } = getDeploymentsAddresses(network);

  const weightedPoolFactory = await ethers.getContractFactory('WeightedPoolFactory', signer);

  const initialPauseWindowDuration = 90 * 24 * 60 * 60;

  const bufferPeriodDuration = 30 * 24 * 60 * 60;

  const deployRequest = weightedPoolFactory.getDeployTransaction(
    Vault,
    ProtocolFeePercentagesProvider,
    initialPauseWindowDuration,
    bufferPeriodDuration
  );

  const receipt = await (await signer.sendTransaction(deployRequest)).wait();

  const weightedPoolFactoryAddress = receipt.contractAddress;

  console.log('WeightedPoolFactory deployed', weightedPoolFactoryAddress);

  saveDeploymentAddress('WeightedPoolFactory', weightedPoolFactoryAddress, network);
};

func.tags = ['base'];

export default func;
