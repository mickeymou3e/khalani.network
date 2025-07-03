import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { saveDeploymentAddress } from '../../deployments/cli/utils/save';
import { BatchRelayerLibrary__factory } from '@hadouken-project/typechain';
import { getDeploymentsAddresses } from '../../deployments/cli/config.command';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const network = hre.network.name;

  const signer = await ethers.getSigner(deployer);

  const { Vault } = getDeploymentsAddresses(network);

  const batchRelayerLibraryFactory = await ethers.getContractFactory('BatchRelayerLibrary', signer);

  const deployRequest = batchRelayerLibraryFactory.getDeployTransaction(Vault, ethers.constants.AddressZero);

  const receipt = await (await signer.sendTransaction(deployRequest)).wait();

  const batchRelayerLibraryAddress = receipt.contractAddress;

  console.log('BatchRelayerLibrary deployed ', batchRelayerLibraryAddress);

  saveDeploymentAddress('BatchRelayerLibrary', batchRelayerLibraryAddress, network);

  const batchRelayerLibrary = BatchRelayerLibrary__factory.connect(batchRelayerLibraryAddress, signer);

  const batchRelayerAddress = await batchRelayerLibrary.getEntrypoint();

  saveDeploymentAddress('BatchRelayer', batchRelayerAddress, network);
};

func.tags = ['base'];

export default func;
