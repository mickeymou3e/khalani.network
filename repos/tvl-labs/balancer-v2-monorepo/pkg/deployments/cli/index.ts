import { program } from 'commander';
import prompts from 'prompts';

import { Network } from '../src/types';

import setupScriptRunEnvironment from './scriptRunEnvirionment';
import selectNetworkCommand from './config.command';

import poolsCli from './pools/cli';
import vaultCli from './Vault/cli';
import erc20Cli from './ERC20/cli';
import staticATokenCli from './StaticAToken/cli';
import testTokenCli from './TestToken/cli';
import { network } from 'hardhat';

program
  .name('cli')
  .description('CLI to manage Hadouken Swap contracts')
  .action(async () => {
    const scriptRunEnvironment = await setupScriptRunEnvironment(network.name as Network);

    const { action } = await prompts({
      type: 'select',
      name: 'action',
      message: 'Select action',
      choices: [
        { title: 'pools', value: 'pools' },
        { title: 'Vault', value: 'Vault' },
        { title: 'StaticAToken', value: 'StaticAToken' },
        { title: 'ERC20', value: 'ERC20' },
        { title: 'TestToken', value: 'TestToken' },
      ],
    });

    switch (action) {
      case 'pools':
        await poolsCli({ environment: scriptRunEnvironment });
        break;
      case 'Vault':
        await vaultCli({ environment: scriptRunEnvironment });
        break;
      case 'StaticAToken':
        await staticATokenCli({ environment: scriptRunEnvironment });
        break;
      case 'ERC20':
        await erc20Cli({ environment: scriptRunEnvironment });
        break;
      case 'TestToken':
        await testTokenCli({ environment: scriptRunEnvironment });
        break;
    }
  });

program.parse();
