import prompts from 'prompts';
import path from 'path';
import fs from 'fs';
import { getData } from '../scripts/godwoken/utils';
import { Config } from '../src/types';

const CONFIG_PATH = path.join(__dirname, '../config');

const selectConfigCommand = async () => {
    const configs = fs.readdirSync(CONFIG_PATH);

    const { config: configName } = await prompts({
        type: 'select',
        name: 'config',
        choices: configs.map((config) => ({ title: config, value: config })),
        message: 'Select config',
    });


    const config = getData<Config>(path.join(CONFIG_PATH, configName));
    
    return config;
};

export default selectConfigCommand;