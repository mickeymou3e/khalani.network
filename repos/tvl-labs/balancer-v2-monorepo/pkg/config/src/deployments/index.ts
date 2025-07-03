import DeploymentsTestnet from './deployments.testnet.json';
import DeploymentsMainnet from './deployments.mainnet.json';
import DeploymentsSchema from './deployments.schema.json';
import { Environment } from '../types';

export const deployments = (environment: Environment): typeof DeploymentsSchema => {
  if (environment.valueOf() === Environment.Mainnet.valueOf()) {
    return DeploymentsMainnet;
  } else if (environment.valueOf() === Environment.Testnet.valueOf()) {
    return DeploymentsTestnet;
  }

  return DeploymentsMainnet;
};
