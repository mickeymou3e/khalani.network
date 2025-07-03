import { getConfigFromNetworkName } from '@src/filesManager';
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';

import { Environments } from '@src/types/types';
const CONFIG_PATH = path.join(process.cwd(), 'src/config');
const removeExtension = (filename: string) => {
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
};

export const selectConfigCommand = async () => {
  const configs = fs.readdirSync(CONFIG_PATH);

  const { config: configName } = await prompts({
    type: 'select',
    name: 'config',
    choices: configs.map((config) => ({ title: config, value: config })),
    message: 'Select config',
  });

  const config = getConfigFromNetworkName(
    removeExtension(configName) as Environments,
    process.env.CLI_DEPLOYER
  );

  return config;
};
