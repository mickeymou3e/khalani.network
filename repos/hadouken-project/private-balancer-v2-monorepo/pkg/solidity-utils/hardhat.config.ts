import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-ignore-warnings';
import 'hardhat-deploy';

import { hardhatBaseConfig } from '@balancer-labs/v2-common';

const builderConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: hardhatBaseConfig.compilers,
  },
  networks: hardhatBaseConfig.networks,
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default builderConfig;
