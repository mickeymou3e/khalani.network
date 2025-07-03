import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { saveDeploymentAddress } from '../../deployments/cli/utils/save';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();

  const network = hre.network.name;

  const signer = await ethers.getSigner(deployer);

  const addressBalancesFactory = await ethers.getContractFactory('AddressBalances', signer);

  const deployRequest = addressBalancesFactory.getDeployTransaction();

  const receipt = await (await signer.sendTransaction(deployRequest)).wait();

  const addressBalancesAddress = receipt.contractAddress;
  console.log('AddressBalances deployed ', addressBalancesAddress);

  saveDeploymentAddress('AddressBalances', addressBalancesAddress, network);
};

func.tags = ['base'];

export default func;
