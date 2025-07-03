import { writeToContractsConfig } from '@scripts/filesManager';
import { WETHGateway__factory } from '@src/typechain/zksync';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import { delay, getContractsConfigInstant } from '@src/utils';
import { ContractFactory } from 'zksync-web3';

export const deployZkSyncWEthGateway = async (
  environment: ZkSyncDeploymentEnvironment,
  wEth: string
): Promise<string> => {
  const { chainId, env, networkName, delayInMs, walletWithProvider } = environment;

  console.log('Deploying WEth Gateway');

  const wEthGatewayFactory = new ContractFactory(
    WETHGateway__factory.abi,
    WETHGateway__factory.bytecode,
    walletWithProvider
  );

  const wEthGateway = await wEthGatewayFactory.deploy(wEth);
  const wEthGatewayAddress = wEthGateway.address;

  console.log(`WEth Gateway' deployed: ${wEthGatewayAddress}`);

  await delay(delayInMs);

  const contractsConfig = getContractsConfigInstant(chainId, env, true);
  if (!contractsConfig) throw Error('contractsConfig not found');
  const wEthGatewayContract = WETHGateway__factory.connect(wEthGatewayAddress, walletWithProvider);

  console.log('initializing lending pool to wEthGateway');

  await wEthGatewayContract.authorizeLendingPool(contractsConfig.lendingPoolProxy);

  console.log('initializing lending pool to wEthGateway completed');

  writeToContractsConfig(
    {
      wEthGateway: wEthGatewayAddress,
    },
    chainId,
    env,
    networkName
  );

  return wEthGatewayAddress;
};
