/* eslint-disable no-case-declarations */
import prompts from 'prompts';
import { Cli } from '../types';

import depositCli from './deposit/cli';
import { deployCli } from './deploy/cli';

const staticATokenCli: Cli = async (cliProps) => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [
      { title: 'deploy', value: 'deploy' },
      { title: 'deposit', value: 'deposit' },
      { title: 'withdraw', value: 'withdraw' },
    ],
  });

  switch (action) {
    case 'deploy':
      await deployCli({ ...cliProps, parentCli: staticATokenCli });
      break;
    case 'deposit':
      const { address } = await prompts({
        type: 'text',
        name: 'address',
        message: 'address',
      });

      await depositCli(address);
      break;
    case 'withdraw':
      break;
  }
};

export default staticATokenCli;
