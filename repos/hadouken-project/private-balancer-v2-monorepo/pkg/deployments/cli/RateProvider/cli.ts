import prompts from 'prompts';

import { Cli } from '../types';

import createGetterMethodsCli from '../utils/createGetterMethodsCli';
import { createSetterMethodsCli } from '../utils/createSetterMethodsCli';
import { MockRateProvider__factory } from '@hadouken-project/typechain';

export const rateProviderCli: Cli = async (cliProps) => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [
      { title: 'getters', value: 'getters' },
      { title: 'setters', value: 'setters' },
    ],
  });

  switch (action) {
    case 'getters': {
      const { address } = await prompts({
        type: 'text',
        name: 'address',
        message: 'address',
      });
      const getterMethodsCli = createGetterMethodsCli(MockRateProvider__factory.abi);
      await getterMethodsCli(address, cliProps);

      break;
    }
    case 'setters': {
      const { address } = await prompts({
        type: 'text',
        name: 'address',
        message: 'address',
      });
      const setterMethodsCli = createSetterMethodsCli(MockRateProvider__factory.abi);
      await setterMethodsCli(address, cliProps);

      break;
    }
  }
};
