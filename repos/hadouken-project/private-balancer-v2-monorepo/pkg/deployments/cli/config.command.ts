import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { ChainConfigWithDeployer } from '../../../chain-config/types';
import DeploymentsSchema from '../../config/src/deployments/deployments.schema.json';

dotenv.config({ path: '../../.env' });

const removeExtension = (filename: string) => {
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
};

export const getConfigFromNetworkName = (networkName: string): ChainConfigWithDeployer => {
  const configPath = path.resolve(__dirname, '../../..').concat(`/chain-config/${networkName}.json`);

  const deployer = process.env.CLI_ACCOUNT;

  if (!fs.existsSync(configPath)) {
    throw Error(`[getConfigFromNetworkName] - Unknown networkName: ${networkName}`);
  }

  const configRawData = fs.readFileSync(configPath);
  const config = JSON.parse(configRawData.toString());

  if (deployer) {
    config.deployer = deployer;
  }

  return config;
};

export const getDeploymentsAddresses = (networkName: string): typeof DeploymentsSchema => {
  const configPath = path.resolve(__dirname, '../../config/src/deployments/').concat(`/${networkName}.json`);

  const configRawData = fs.readFileSync(configPath);

  const deployments: typeof DeploymentsSchema = JSON.parse(configRawData.toString());

  return deployments;
};

const CONFIG_PATH = path.resolve(__dirname, '../../..').concat('/chain-config');

const selectConfigCommand = async (): Promise<ChainConfigWithDeployer> => {
  const configs = fs.readdirSync(CONFIG_PATH).filter((config) => config.includes('.json'));

  const { config: configName } = await prompts({
    type: 'select',
    name: 'config',
    choices: configs.map((config) => ({ title: config, value: config })),
    message: 'Select config',
  });

  const config = getConfigFromNetworkName(removeExtension(configName));

  return config;
};

export default selectConfigCommand;
