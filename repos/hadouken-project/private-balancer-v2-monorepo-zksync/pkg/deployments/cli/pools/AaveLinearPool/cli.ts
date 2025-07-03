import prompts from 'prompts';

import { Cli } from '../../types';

import createGetterMethodsCli from '../../utils/createGetterMethodsCli';
import AaveLinearPoolFactoryCli from './factory/cli';

import { AaveLinearPool__factory } from '@balancer-labs/typechain';
import { createSetterMethodsCli } from '../../utils/createSetterMethodsCli';
import AaveLinearPoolAbi from './abi/AaveLinearPool.json';
import { AddTokensCli } from './factory/addTokens';

const AaveLinearPoolCli: Cli = async ({ environment, parentCli }) => {
  const choices = [
    { title: 'factory', value: 'factory' },
    { title: 'pool getters', value: 'pool getters' },
    { title: 'pool setters', value: 'pool setters' },
    { title: 'getActionId', value: 'getActionId' },
    { title: 'swap tokens', value: 'swap tokens' },
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
      await AaveLinearPoolFactoryCli({ environment: environment, parentCli: AaveLinearPoolCli });
      break;
    case 'pool getters': {
      const { poolAddress } = await prompts({
        type: 'text',
        name: 'poolAddress',
        message: 'pool address',
      });

      const getterMethodsCli = createGetterMethodsCli(AaveLinearPoolAbi);
      await getterMethodsCli(poolAddress, {
        environment: environment,
        parentCli: AaveLinearPoolCli,
      });

      break;
    }

    case 'pool setters': {
      const { address } = await prompts({
        type: 'text',
        name: 'address',
        message: 'Aave linear pool address',
      });
      const setterMethodsCli = createSetterMethodsCli(AaveLinearPoolAbi);
      await setterMethodsCli(address, { environment, parentCli });
      break;
    }

    case 'swap tokens': {
      await AddTokensCli({ environment: environment, parentCli: AaveLinearPoolCli });
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

      const aavePool = AaveLinearPool__factory.connect(poolAddress, environment.deployer);

      const actionId = await aavePool.getActionId(aavePool.interface.getSighash(actionName));
      console.log('actionId', actionId);

      break;
    }
  }

  return parentCli?.({ environment });
};

export default AaveLinearPoolCli;
