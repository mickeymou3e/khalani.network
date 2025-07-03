import { config } from 'dotenv'
import prompts from 'prompts';

import {
    setupProvider,
    setupWallet,
    transactionOverrides
} from './provider';

import { Config } from '../src/types';
import { ScriptRunEnvironment } from './types';

const env = config()

const setupScriptRunEnvironment = async (config: Config): Promise<ScriptRunEnvironment> => {
    const DEPLOYER_PRIVATE_KEY = env?.parsed?.DEPLOYER_PRIVATE_KEY as string;

    const network = `godwoken.${config.env}`
    const provider = await setupProvider(config)
    const { wallet, address } = await setupWallet(DEPLOYER_PRIVATE_KEY, provider, config)

    const { confirmed } = await prompts({
        type: 'confirm',
        name: 'confirmed',
        message: `Use ${wallet.address} wallet`,
        initial: true,
    });

    if (!confirmed) {
        throw new Error("Set env variable DEPLOYER_PRIVATE_KEY");
    }

    return { network, address, provider, wallet, transactionOverrides };
};

export default setupScriptRunEnvironment;
