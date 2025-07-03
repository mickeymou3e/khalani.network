import fs from 'fs';
import prompts from 'prompts';
import { POOLS_CONTRACTS_DIR } from '../../../scripts/godwoken/pools/constants';

import { deployAll as deployAllScript } from '../../../scripts/godwoken/pools/batch.godwoken'
import { deploy as deployScript } from '../../../scripts/godwoken/pools/deploy.godwoken'

import poolCli from './pool'

import { Cli } from '../../types';

const poolsCli: Cli = async ({ environment, parentCli }) => {
    const poolsNames = fs.readdirSync(POOLS_CONTRACTS_DIR);
    
    if (poolsNames) {
        const { poolName } = await prompts({
            type: 'select',
            name: 'poolName',
            message: 'Select pool',
            choices: [
                ...(poolsNames.map((poolName) => ({
                    value: poolName,
                    title: poolName,
                }))),
                { title: 'all', value: 'all' },
            ],
        }, {
            onCancel: () => {
                return parentCli ? parentCli({ environment }) : process.exit(0)
            }
        });

        await poolCli({ poolName, environment, parentCli: poolsCli })

        return poolsCli({ environment, parentCli })
    }

    return parentCli ? parentCli({ environment }) : process.exit(0)
}

export default poolsCli
