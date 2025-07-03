import { program } from 'commander';
import { selectConfigCommand } from './commands/config';
import setupScriptRunEnvironment from './scriptRunEnvironment';
// this is needed
const { ethers } = require('hardhat');

import { isZkSyncNetwork } from '@src/network';
import { ScriptRunEnvironment } from '@src/types';
import { Config } from '@src/types/types';
import { contractsCliGodwoken } from './contracts/godwoken';
import { contractsCliZkSync } from './contracts/zkSync';
import { setupZkSyncDeploymentEnvironment } from './contracts/zkSync/helpers';

program
  .name('cli')
  .description('CLI to manage Hadouken Lending contracts and config')
  .action(async () => {
    const config = await selectConfigCommand();

    if (isZkSyncNetwork(config.chainId)) {
      const zkSyncScriptEnvironment = await setupZkSyncDeploymentEnvironment(config);
      await contractsCliZkSync({
        environment: zkSyncScriptEnvironment as unknown as ScriptRunEnvironment,
      });
    } else {
      const scriptRunEnvironment = await setupScriptRunEnvironment(config as Config);
      await contractsCliGodwoken({ environment: scriptRunEnvironment as ScriptRunEnvironment });
    }
  });

program.parse();
