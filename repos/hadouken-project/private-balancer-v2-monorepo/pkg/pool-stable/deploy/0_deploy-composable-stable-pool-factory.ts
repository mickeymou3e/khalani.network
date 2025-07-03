import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { saveDeploymentAddress } from '../../deployments/cli/utils/save';

import { getDeploymentsAddresses } from '../../deployments/cli/config.command';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const network = hre.network.name;

  const signer = await ethers.getSigner(deployer);

  const { Vault, ProtocolFeePercentagesProvider } = getDeploymentsAddresses(network);

  const composableStablePoolFactory = await ethers.getContractFactory('ComposableStablePoolFactory', signer);

  const initialPauseWindowDuration = 90 * 24 * 60 * 60;

  const bufferPeriodDuration = 30 * 24 * 60 * 60;

  const POOL_VERSION = '5';
  const FACTORY_VERSION = '1';

  const deployRequest = composableStablePoolFactory.getDeployTransaction(
    Vault,
    ProtocolFeePercentagesProvider,
    FACTORY_VERSION,
    POOL_VERSION,
    initialPauseWindowDuration,
    bufferPeriodDuration
  );

  const receipt = await (await signer.sendTransaction(deployRequest)).wait();

  const composableStablePoolFactoryAddress = receipt.contractAddress;

  console.log('ComposableStablePoolFactory deployed', composableStablePoolFactoryAddress);

  saveDeploymentAddress('ComposableStablePoolFactory', composableStablePoolFactoryAddress, network);
};

func.tags = ['base'];

export default func;
