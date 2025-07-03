import ExternalMainnet from './external.mainnet.json';
import ExternalTestnet from './external.testnet.json';
import ExternalSchema from './external.schema.json';
import { Environment } from '../types';

export const external = (environment: Environment): typeof ExternalSchema => {
  if (environment.valueOf() === Environment.Mainnet.valueOf()) {
    return ExternalMainnet;
  } else if (environment.valueOf() === Environment.Testnet.valueOf()) {
    return ExternalTestnet;
  }

  return ExternalMainnet;
};
