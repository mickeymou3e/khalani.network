import prompts from 'prompts';

import { Cli } from '../../types';

import ComposableStablePoolFactoryCli from './factory/cli';
import createGetterMethodsCli from '../../utils/createGetterMethodsCli';

import poolAbi from './abi/pool.json';

const ComposableStablePoolCli: Cli = async ({ environment, parentCli }) => {
  const choices = [
    { title: 'factory', value: 'factory' },
    { title: 'pool getters', value: 'pool getters' },
  ];

  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select action',
      choices,
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  switch (action) {
    case 'factory':
      await ComposableStablePoolFactoryCli({ environment: environment, parentCli: ComposableStablePoolCli });
      break;
    case 'pool getters': {
      const { poolAddress } = await prompts({
        type: 'text',
        name: 'poolAddress',
        message: 'pool address',
      });

      const getterMethodsCli = createGetterMethodsCli(poolAbi);
      await getterMethodsCli(poolAddress, {
        environment: environment,
        parentCli: ComposableStablePoolCli,
      });

      break;
    }
  }

  return ComposableStablePoolCli({ environment, parentCli });
};

export default ComposableStablePoolCli;
