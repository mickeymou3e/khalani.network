import prompts from 'prompts';

import { Cli } from '../types';

import createGetterMethodsCli from '../utils/createGetterMethodsCli';
import { createSetterMethodsCli } from '../utils/createSetterMethodsCli';
import { ERC20__factory } from '@hadouken-project/typechain';

const erc20Cli: Cli = async (cliProps) => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [
      { title: 'getters', value: 'getters' },
      { title: 'setters', value: 'setters' },
    ],
  });

  const { address } = await prompts({
    type: 'text',
    name: 'address',
    message: 'address',
  });

  switch (action) {
    case 'getters': {
      const getterMethodsCli = createGetterMethodsCli(ERC20__factory.abi);
      await getterMethodsCli(address, cliProps);

      break;
    }
    case 'setters': {
      const setterMethodsCli = createSetterMethodsCli(ERC20__factory.abi);
      await setterMethodsCli(address, cliProps);

      break;
    }
  }
};

export default erc20Cli;
