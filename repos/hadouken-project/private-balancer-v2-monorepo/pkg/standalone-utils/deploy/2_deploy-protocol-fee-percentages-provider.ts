import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { saveDeploymentAddress } from '../../deployments/cli/utils/save';

import { getDeploymentsAddresses } from '../../deployments/cli/config.command';
import { fp } from '@balancer-labs/v2-helpers/src/numbers';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const network = hre.network.name;

  const signer = await ethers.getSigner(deployer);

  const { Vault } = getDeploymentsAddresses(network);

  const protocolFeePercentagesProviderFactory = await ethers.getContractFactory(
    'ProtocolFeePercentagesProvider',
    signer
  );

  const maxYieldValue = fp(0.5);

  const maxAUMValue = fp(0.5);

  const deployRequest = protocolFeePercentagesProviderFactory.getDeployTransaction(Vault, maxYieldValue, maxAUMValue);

  const receipt = await (await signer.sendTransaction(deployRequest)).wait();

  const protocolFeePercentagesProviderAddress = receipt.contractAddress;

  console.log('ProtocolFeePercentagesProvider deployed ', protocolFeePercentagesProviderAddress);

  saveDeploymentAddress('ProtocolFeePercentagesProvider', protocolFeePercentagesProviderAddress, network);
};

func.tags = ['base'];

export default func;
