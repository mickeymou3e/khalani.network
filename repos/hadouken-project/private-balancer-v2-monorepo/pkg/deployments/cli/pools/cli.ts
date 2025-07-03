import prompts from 'prompts';

import { Cli } from '../types';
import AaveLinearPoolCli from './AaveLinearPool/cli';
import ComposableStablePoolCli from './ComposableStablePool/cli';
import WeightedPoolCli from './WeightedPool/cli';

const poolsCli: Cli = async ({ environment, parentCli }) => {
  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select action',
      choices: [
        { title: 'ComposableStablePool', value: 'ComposableStablePool' },
        { title: 'WeightedPool', value: 'WeightedPool' },
        { title: 'AaveLinearPool', value: 'AaveLinearPool' },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  switch (action) {
    case 'ComposableStablePool':
      await ComposableStablePoolCli({ environment, parentCli: poolsCli });
      break;
    case 'WeightedPool':
      await WeightedPoolCli({ environment, parentCli: poolsCli });
      break;
    case 'AaveLinearPool':
      await AaveLinearPoolCli({ environment, parentCli: poolsCli });
      break;
  }
};

export default poolsCli;
