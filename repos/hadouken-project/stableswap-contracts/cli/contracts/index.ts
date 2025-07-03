import prompts from 'prompts';

import { Cli, ScriptRunEnvironment } from '../types';
import tokens from './tokens';
import poolsCli from './pools';
import registries from './registries';

export enum Contract {
    tokens,
    pools,
    registries,
    all,
}

const contractsCli: Cli = async ({ environment }): Promise<void> => {
    const { contract } = await prompts({
        type: 'select',
        name: 'contract',
        message: 'Select contract',
        choices: [
          { title: 'tokens', value: Contract.tokens },
          { title: 'pools', value: Contract.pools },
          { title: 'registries', value: Contract.registries},
          { title: 'all', value: Contract.all },
        ],
    }, {
        onCancel: (prompt) => {
            console.log('here', prompt)
            process.exit(0)
        }
    });

    switch (contract) {
        case Contract.tokens: 
            await tokens({ environment, parentCli: contractsCli })
            break;
        case Contract.pools: 
            await poolsCli({ environment, parentCli: contractsCli })
            break;
        case Contract.registries: 
            await registries({ environment, parentCli: contractsCli })
            break;
        case Contract.all:
            break
    }

    return contractsCli({ environment });
};

export default contractsCli;