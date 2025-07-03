import DeploymentsSchema from './deployments.schema.json';
import ZkSyncTestnetDeployments from './deployments.zksync-testnet.json';
import ZkSyncMainnetDeployments from './deployments.zksync-mainnet.json';
import { Environment } from '../types';

export const getDeploymentsByRuntimeEnv = (network: string): typeof DeploymentsSchema => {
  switch (network) {
    case 'zksync-testnet':
      return deployments(Environment.Testnet);
    case 'zksync-mainnet':
      return deployments(Environment.Mainnet);
    default:
      console.log('Invalid network env - using testnet');

      return deployments(Environment.Testnet);
  }
};

export const deployments = (environment: Environment): typeof DeploymentsSchema => {
  if (environment.valueOf() === Environment.Testnet.valueOf()) {
    return ZkSyncTestnetDeployments;
  } else if (environment.valueOf() === Environment.Mainnet.valueOf()) {
    return ZkSyncMainnetDeployments;
  }

  console.log('Invalid network - using testnet');

  return ZkSyncTestnetDeployments;
};
