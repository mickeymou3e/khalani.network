import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import dotenv from 'dotenv';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Contract, Provider, Wallet, utils } from 'zksync-web3';
import { getDeploymentAddress, saveDeploymentAddress } from '../../deployments/src/utils';
import { abi as Authorizer_ABI } from '../../liquidity-mining/artifacts-zk/contracts/admin/Authorizer.sol/Authorizer.json';
import { abi as Vault_ABI } from '../../vault/artifacts-zk/contracts/Vault.sol/Vault.json';

dotenv.config({ path: '../../.env' });

export default async function (hre: HardhatRuntimeEnvironment): Promise<void> {
  console.log('Running deploy script for BatchRelayerLibrary contract');

  const privateKey = process.env.ZK_SYNC_DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('Missing private key to deploy');
  }

  const wallet = new Wallet(privateKey);

  const deployer = new Deployer(hre, wallet);

  const artifact = await deployer.loadArtifact('BatchRelayerLibrary');

  console.log('Deploying BatchRelayerLibrary contract');

  const { Vault, Authorizer } = getDeploymentAddress(hre.network.name);

  //* NOTE: change to correct address
  const minter = utils.ETH_ADDRESS;

  const batchRelayerLibraryContract = await deployer.deploy(artifact, [Vault, minter]);

  const batchRelayerLibraryContractAddress = batchRelayerLibraryContract.address;

  console.log(`${artifact.contractName} was deployed to ${batchRelayerLibraryContractAddress}`);

  saveDeploymentAddress(artifact.contractName, batchRelayerLibraryContractAddress);

  const [batchRelayerAddress]: string[] = await batchRelayerLibraryContract.functions.getEntrypoint();

  console.log('BatchRelayer', batchRelayerAddress);

  saveDeploymentAddress('BatchRelayer', batchRelayerAddress);

  const rpcUrl = (hre.network.config as { url: string }).url;

  const provider = new Provider(rpcUrl);

  const walletWithProvider = wallet.connect(provider);

  const vaultContract = new Contract(Vault, Vault_ABI, walletWithProvider);

  const roles = await Promise.all(
    ['manageUserBalance', 'joinPool', 'exitPool', 'swap', 'batchSwap', 'setRelayerApproval'].map(async (role) => {
      const data = await vaultContract.getActionId(vaultContract.interface.getSighash(role));
      return data;
    })
  );

  console.log('Generated roles', roles);

  const authorizer = new Contract(Authorizer, Authorizer_ABI, walletWithProvider);

  const address = batchRelayerAddress;

  console.log('Grant roles for', batchRelayerAddress);

  const transaction = await authorizer.grantRoles(roles, address);

  await transaction.wait();
}
