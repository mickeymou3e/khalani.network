import prompts from 'prompts';

import { Cli } from '../../types';

import createGetterMethodsCli from '../../utils/createGetterMethodsCli';
import poolFactoryCli from './factory/cli';

import { WeightedPool__factory } from '@hadouken-project/typechain';

const poolCli: Cli = async ({ environment, parentCli }) => {
  const choices = [
    { title: 'factory', value: 'factory' },
    { title: 'pool getters', value: 'pool getters' },
    { title: 'get action id', value: 'get action id' },
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
      await poolFactoryCli({ environment: environment, parentCli: poolCli });
      break;
    case 'pool getters': {
      const { poolAddress } = await prompts({
        type: 'text',
        name: 'poolAddress',
        message: 'pool address',
      });

      const getterMethodsCli = createGetterMethodsCli(WeightedPool__factory.abi);
      await getterMethodsCli(poolAddress, {
        environment: environment,
        parentCli: poolCli,
      });

      break;
    }
    case 'get action id': {
      const { poolAddress } = await prompts({
        type: 'text',
        name: 'poolAddress',
        message: 'pool address',
      });

      const { actionName } = await prompts({
        type: 'text',
        name: 'actionName',
        message: 'Action name',
      });

      const weightedPool = await WeightedPool__factory.connect(poolAddress, environment.deployer);
      const actionId = await weightedPool.getActionId(weightedPool.interface.getSighash(actionName));

      console.log('actionId', actionId);

      break;
    }
  }

  return poolCli({ environment, parentCli });
};

export default poolCli;
