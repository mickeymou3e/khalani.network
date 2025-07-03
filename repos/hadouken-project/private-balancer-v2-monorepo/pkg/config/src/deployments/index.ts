import DeploymentsGodwokenTestnet from './godwoken-testnet.json';
import DeploymentsGodwokenMainnet from './godwoken-mainnet.json';
import DeploymentsMantleTestnet from './mantle-testnet.json';
import DeploymentsSchema from './deployments.schema.json';
import { ChainId, Network } from '../networks';

export const deployments = (chainId: ChainId): typeof DeploymentsSchema => {
  if (chainId === Network.GodwokenMainnet) {
    return DeploymentsGodwokenMainnet;
  } else if (chainId === Network.GodwokenTestnet) {
    return DeploymentsGodwokenTestnet;
  } else if (chainId === Network.MantleTestnet) {
    return DeploymentsMantleTestnet;
  }

  return DeploymentsGodwokenMainnet;
};
