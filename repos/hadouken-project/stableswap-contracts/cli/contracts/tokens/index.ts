import prompts from 'prompts';

import { Cli, ScriptRunEnvironment } from '../../types';

import { deployCli } from './deploy';
import { mintCli } from './mint';
import { list } from './list'
import { balanceCli } from './balance';

const tokensCli: Cli = async ({ environment, parentCli }) => {
    const { action } = await prompts({
        type: 'select',
        name: 'action',
        message: 'Select action',
        choices: [
          { title: 'deploy', value: 'deploy' },
          { title: 'mint', value: 'mint' },
          { title: 'balance', value: 'balance'},
          { title: 'list', value: 'list'}
        ],
    }, {
        onCancel: () => {
            return parentCli ? parentCli({ environment }) : process.exit(0)
        }
    });

    switch(action) {
        case 'deploy':
            await deployCli(environment)
            break;
        case 'mint':
            await mintCli(environment)
            break;
        case 'balance':
            await balanceCli(environment)
            break;
        case 'list':
            await list(environment)
            break;
    }

    return tokensCli({ environment, parentCli })
};

export default tokensCli;