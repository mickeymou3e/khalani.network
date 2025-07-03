import { program } from 'commander';

import configSelector from './config';
import setupScriptRunEnvironment from './scriptRunEnvirionment';

import contractsCli from './contracts'
import tokensCli from './contracts/tokens'

import { Config } from '../src/types';
import { ScriptRunEnvironment } from './types';

program
  .name('cli')
  .description('CLI to manage Hadoken contracts and config')
  .action(async () => {
    const config = await configSelector()
    const scriptRunEnvironment = await setupScriptRunEnvironment(config as Config)

    await contractsCli({ environment: scriptRunEnvironment as ScriptRunEnvironment })
  });

program
  .command('tokens')
  .description('List, method call or deploy tokens')
  .action(async () => {
    const config = await configSelector()
    const scriptRunEnvironment = await setupScriptRunEnvironment(config as Config)

    await tokensCli({ environment: scriptRunEnvironment });
  });

program.parse();
