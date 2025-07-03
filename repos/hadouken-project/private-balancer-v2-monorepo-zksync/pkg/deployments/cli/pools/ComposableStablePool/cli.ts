import prompts from 'prompts';

import { Cli } from '../../types';

import createGetterMethodsCli from '../../utils/createGetterMethodsCli';
import ComposableStablePoolFactoryCli from './factory/cli';

import { ComposableStablePool__factory } from '@balancer-labs/typechain';
import { createSetterMethodsCli } from '../../utils/createSetterMethodsCli';
import poolAbi from './abi/pool.json';

const ComposableStablePoolCli: Cli = async ({ environment, parentCli }) => {
  const choices = [
    { title: 'factory', value: 'factory' },
    { title: 'pool getters', value: 'pool getters' },
    { title: 'pool setters', value: 'pool setters' },
    { title: 'Get action id', value: 'getActionId' },
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
      await ComposableStablePoolFactoryCli({ environment: environment });
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
    case 'pool setters': {
      const { address } = await prompts({
        type: 'text',
        name: 'address',
        message: 'Composable pool address',
      });
      const setterMethodsCli = createSetterMethodsCli(poolAbi);
      await setterMethodsCli(address, { environment, parentCli });
      break;
    }

    case 'getActionId': {
      const { poolAddress } = await prompts({
        type: 'text',
        name: 'poolAddress',
        message: 'pool address',
      });

      const { actionName } = await prompts({
        type: 'text',
        name: 'actionName',
        message: 'action name',
      });

      const composablePool = ComposableStablePool__factory.connect(poolAddress, environment.deployer);

      const actionId = await composablePool.getActionId(composablePool.interface.getSighash(actionName));
      console.log('actionId', actionId);

      break;
    }
  }

  return ComposableStablePoolCli({ environment, parentCli });
};

export default ComposableStablePoolCli;
