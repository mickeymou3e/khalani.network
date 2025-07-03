import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-vyper';
import 'hardhat-ignore-warnings';
import 'hardhat-deploy';

import { hardhatBaseConfig } from '@balancer-labs/v2-common';

import { name } from './package.json';

import { task } from 'hardhat/config';
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import overrideQueryFunctions from '@balancer-labs/v2-helpers/plugins/overrideQueryFunctions';

task(TASK_COMPILE).setAction(overrideQueryFunctions);

const builderConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: hardhatBaseConfig.compilers,
    overrides: { ...hardhatBaseConfig.overrides(name) },
  },
  networks: hardhatBaseConfig.networks,
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  vyper: {
    compilers: [{ version: '0.3.1' }, { version: '0.3.3' }],
  },
};

export default builderConfig;
