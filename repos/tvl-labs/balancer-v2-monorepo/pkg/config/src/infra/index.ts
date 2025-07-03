import InfraMainnet from './infra.mainnet.json';
import InfraTestnet from './infra.testnet.json';
import InfraSchema from './infra.schema.json';
import { Environment } from '../types';

export const infra = (environment: Environment): typeof InfraSchema => {
  if (environment.valueOf() === Environment.Mainnet.valueOf()) {
    return InfraMainnet;
  } else if (environment.valueOf() === Environment.Testnet.valueOf()) {
    return InfraTestnet;
  }

  return InfraMainnet;
};
