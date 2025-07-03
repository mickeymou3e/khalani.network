import prompts from 'prompts';

import { ScriptRunEnvironment } from '../../../types';
import { list } from './list';
import { registryPoolsCli } from './pools';

const registryCli = async (environment: ScriptRunEnvironment) => {
    const { action } = await prompts({
        type: 'select',
        name: 'action',
        message: 'Select action',
        choices: [
          { title: 'deploy', value: 'deploy' },
          { title: 'pools', value: 'pools' },
          { title: 'list', value: 'list' },
          { title: 'add pool', value: 'add-pool' },
        ],
    });

    switch(action) {
        case 'deploy':
            console.log('deploy')
            break;
        case 'pools':
            await registryPoolsCli(environment)
            break;
        case 'list':
            await list(environment)
            break;
        default:
            break;
    }
};

export default registryCli;