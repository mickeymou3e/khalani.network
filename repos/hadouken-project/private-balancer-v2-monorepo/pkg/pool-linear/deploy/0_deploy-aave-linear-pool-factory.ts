import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { saveDeploymentAddress } from '../../deployments/cli/utils/save';

import { getDeploymentsAddresses } from '../../deployments/cli/config.command';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const network = hre.network.name;

  const signer = await ethers.getSigner(deployer);

  const { Vault, ProtocolFeePercentagesProvider, BalancerQueries } = getDeploymentsAddresses(network);

  const aaveLinearPoolFactory = await ethers.getContractFactory('AaveLinearPoolFactory', signer);

  const initialPauseWindowDuration = 90 * 24 * 60 * 60;

  const bufferPeriodDuration = 30 * 24 * 60 * 60;

  const deployRequest = aaveLinearPoolFactory.getDeployTransaction(
    Vault,
    ProtocolFeePercentagesProvider,
    BalancerQueries,
    '1',
    '1',
    initialPauseWindowDuration,
    bufferPeriodDuration
  );

  const receipt = await (await signer.sendTransaction(deployRequest)).wait();

  const aaveLinearPoolFactoryAddress = receipt.contractAddress;

  console.log('AaveLinearPoolFactory deployed', aaveLinearPoolFactoryAddress);

  saveDeploymentAddress('AaveLinearPoolFactory', aaveLinearPoolFactoryAddress, network);
};

func.tags = ['base'];

export default func;
