import fs from 'fs';
import prompts from 'prompts';
import { POOLS_CONTRACTS_DIR } from '../../../../scripts/godwoken/pools/constants';

import { deployAll as deployAllScript } from '../../../../scripts/godwoken/pools/batch.godwoken'
import { deploy as deployScript } from '../../../../scripts/godwoken/pools/deploy.godwoken'

import { ScriptRunEnvironment } from '../../../types';

export const deploy = async (poolName: string, {
    network,
    address: walletAddress,
    wallet,
    provider,
    transactionOverrides,
}: ScriptRunEnvironment) => {
    switch(poolName) {
        case 'all':
            await deployAllScript(walletAddress, `godwoken.${network}`, wallet, transactionOverrides)
            break
        default: {
            await deployScript(poolName, walletAddress, `godwoken.${network}`, wallet, transactionOverrides)
        }
    }
}