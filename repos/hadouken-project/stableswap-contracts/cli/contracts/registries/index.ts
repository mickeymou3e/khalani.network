import prompts from 'prompts';

import { Cli, ScriptRunEnvironment } from '../../types';
import allRegistriesCli from './all';
import { batchBalanceCli } from './balances/batchBalances';

import registryCli from './registry'
import swapsCli from './swaps'

const registriesCli: Cli = async ({ environment, parentCli }) => {
    const { registry } = await prompts({
        type: 'select',
        name: 'registry',
        message: 'Select registry',
        choices: [
          { title: 'registry', value: 'registry' },
          { title: 'swaps', value: 'swaps' },
          { title: 'batch balances', value: 'batch-balances' },
          { title: 'all', value: 'all' },
        ],
    }, {
        onCancel: () => {
            return parentCli ? parentCli({ environment }) : process.exit(0)
        }
    });

    switch(registry) {
        case 'all':
            await allRegistriesCli(environment)
            break;
        case 'registry':
            await registryCli(environment)
            break;
        case 'swaps':
            await swapsCli({
                environment,
                parentCli: registriesCli
            })
            break;
        case 'batch-balances': 
            await batchBalanceCli(environment)
        default:
            break;
    }

    return registriesCli({ environment, parentCli })
};

export default registriesCli;