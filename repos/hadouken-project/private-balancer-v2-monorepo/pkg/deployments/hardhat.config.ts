import { HardhatUserConfig } from 'hardhat/types';

import '@nomiclabs/hardhat-ethers';

import { hardhatBaseConfig } from '@balancer-labs/v2-common';

const builderConfig: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: hardhatBaseConfig.compilers,
  },
  networks: hardhatBaseConfig.networks,
};

export default builderConfig;
