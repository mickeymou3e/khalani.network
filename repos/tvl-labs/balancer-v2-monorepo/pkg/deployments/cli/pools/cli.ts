import prompts from 'prompts';

import WeightedPoolCli from './WeightedPool/cli';
import ComposableStablePoolCli from './ComposableStablePool/cli';
import AaveLinearPoolCli from './AaveLinearPool/cli';
import { Cli } from '../types';
import { templateFactoryCreateCli } from './factory/template';

const poolsCli: Cli = async (cliProps) => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [
      { title: 'ComposableStablePool', value: 'ComposableStablePool' },
      { title: 'WeightedPool', value: 'WeightedPool' },
      { title: 'AaveLinearPool', value: 'AaveLinearPool' },
    ],
  });

  switch (action) {
    case 'ComposableStablePool':
      await ComposableStablePoolCli({ ...cliProps, parentCli: poolsCli });
      break;
    case 'WeightedPool':
      await WeightedPoolCli({ ...cliProps, parentCli: poolsCli });
      break;
    case 'AaveLinearPool':
      await AaveLinearPoolCli({ ...cliProps, parentCli: poolsCli });
      break;
  }
};

export default poolsCli;
