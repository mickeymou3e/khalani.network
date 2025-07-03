import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import { getConfigFromNetworkName } from '@src/filesManager';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Provider, Wallet } from 'zksync-web3';

import { Config, Environments } from '@src/types/types';
export function getDeployer(hre?: HardhatRuntimeEnvironment, network?: string) {
  const privateKey = process.env.CLI_DEPLOYER;

  if (!privateKey) throw Error('Deployer not provided');
  const wallet = new Wallet(privateKey);

  const networkName = hre ? hre?.network.name : network;

  const config = getConfigFromNetworkName(networkName as Environments, process.env.CLI_DEPLOYER);

  const provider = new Provider(config.rpcUrl);

  const walletWithProvider = wallet.connect(provider);

  const deployer = hre ? new Deployer(hre, walletWithProvider) : walletWithProvider;

  return {
    walletWithProvider,
    provider,
    deployer,
  };
}

export function setupZkSyncDeploymentEnvironment(config: Config, hre?: HardhatRuntimeEnvironment) {
  const env = config.env as Environments;

  const { deployer, walletWithProvider } = getDeployer(hre, config.network);

  return {
    env,
    networkName: config.network,
    chainId: config.chainId,
    delayInMs: Number(config.delay),
    address: walletWithProvider.address,
    deployer,
    walletWithProvider,
    transactionOverrides: {},
  };
}
