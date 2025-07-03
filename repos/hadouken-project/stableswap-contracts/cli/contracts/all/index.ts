import prompts from 'prompts';

import { Cli } from '../../types';

const allContractsCli: Cli = async ({ environment, parentCli }) => {
    const { action } = await prompts({
        type: 'select',
        name: 'action',
        message: 'Select action',
        choices: [
          { title: 'deploy', value: 'deploy' },
          { title: 'mint', value: 'mint' },
          { title: 'balance', value: 'balance'}
        ],
    }, {
        onCancel: () => {
            return parentCli ? parentCli({ environment }) : process.exit(0)
        }
    });

    switch(action) {
        case 'deploy':
            console.log('NOT IMPLEMENTED YET')
            break;
        case 'list':
            console.log('NOT IMPLEMENTED YET')
            break;
    }

    return allContractsCli({ environment, parentCli })
};

export default allContractsCli;