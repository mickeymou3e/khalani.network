import prompts from 'prompts';
import { Cli } from '../types';
import { createSetterMethodsCli } from '../utils/createSetterMethodsCli';
import { deployCli } from './deploy/cli';
import depositCli from './deposit/cli';
import { InitializableAdminUpgradeabilityProxy__factory } from '@hadouken-project/typechain';

const staticATokenCli: Cli = async (cliProps) => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [
      { title: 'deploy', value: 'deploy' },
      { title: 'deposit', value: 'deposit' },
      { title: 'withdraw', value: 'withdraw' },
      { title: 'Admin proxy setters', value: 'Admin proxy setters' },
    ],
  });

  switch (action) {
    case 'deploy':
      await deployCli({ ...cliProps, parentCli: staticATokenCli });
      break;
    case 'deposit': {
      const { address } = await prompts({
        type: 'text',
        name: 'address',
        message: 'address',
      });
      await depositCli(cliProps.environment, address);
      break;
    }

    case 'withdraw':
      break;

    case 'Admin proxy setters': {
      const { address } = await prompts({
        type: 'text',
        name: 'address',
        message: 'Wrapped hToken proxy address',
      });

      const setterMethodsCli = createSetterMethodsCli(InitializableAdminUpgradeabilityProxy__factory.abi);
      await setterMethodsCli(address, cliProps);

      break;
    }
  }
};

export default staticATokenCli;
