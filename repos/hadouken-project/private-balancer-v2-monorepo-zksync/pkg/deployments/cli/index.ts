import { program } from 'commander';
import prompts from 'prompts';

import { Network } from '../src/types';

import setupScriptRunEnvironment from './scriptRunEnvirionment';

import { network } from 'hardhat';
import AuthorizerCli from './Authorizer/cli';
import batchRelayerCli from './BatchRelayer/cli';
import erc20Cli from './ERC20/cli';
import staticATokenCli from './StaticAToken/cli';
import testTokenCli from './TestToken/cli';
import vaultCli from './Vault/cli';
import poolsCli from './pools/cli';
import { Cli } from './types';
import wEthCli from './wEth/cli';
import { lockdropCli } from './Lockdrop/cli';

const ContractsCli: Cli = async ({ environment }): Promise<void> => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [
      { title: 'pools', value: 'pools' },
      { title: 'Vault', value: 'Vault' },
      { title: 'StaticAToken', value: 'StaticAToken' },
      { title: 'ERC20', value: 'ERC20' },
      { title: 'wEth', value: 'wEth' },
      { title: 'TestToken', value: 'TestToken' },
      { title: 'BatchRelayer', value: 'BatchRelayer' },
      { title: 'Authorizer', value: 'Authorizer' },
      { title: 'Lockdrop', value: 'Lockdrop' },
    ],
  });

  switch (action) {
    case 'pools':
      await poolsCli({ environment, parentCli: ContractsCli });
      break;
    case 'Vault':
      await vaultCli({ environment, parentCli: ContractsCli });
      break;
    case 'StaticAToken':
      await staticATokenCli({ environment, parentCli: ContractsCli });
      break;
    case 'ERC20':
      await erc20Cli({ environment, parentCli: ContractsCli });
      break;
    case 'wEth':
      await wEthCli({ environment, parentCli: ContractsCli });
      break;
    case 'TestToken':
      await testTokenCli({ environment, parentCli: ContractsCli });
      break;
    case 'BatchRelayer':
      await batchRelayerCli({ environment, parentCli: ContractsCli });
      break;
    case 'Authorizer':
      await AuthorizerCli({ environment, parentCli: ContractsCli });
      break;
    case 'Lockdrop':
      await lockdropCli({ environment, parentCli: ContractsCli });
      break;
  }
};

program
  .name('cli')
  .description('CLI to manage Hadouken Swap contracts')
  .action(async () => {
    const scriptRunEnvironment = await setupScriptRunEnvironment(network.name as Network);

    await ContractsCli({ environment: scriptRunEnvironment });
  });

program.parse();
