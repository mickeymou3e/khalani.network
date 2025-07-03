import fs from 'fs';
import path from 'path';
import { Config, IContractsConfig } from './types/types';

export const getConfigFromNetworkName = (networkName: string, deployer?: string): Config => {
  const CONFIG_DIR = `src/config/${networkName}.json`;
  const configPath = path.join(process.cwd(), CONFIG_DIR);

  const isGnosisSafe = Boolean(process.env.GNOSIS_SAFE === 'true');

  if (!fs.existsSync(configPath)) {
    throw Error(`[getConfigFromNetworkName] - Unknown networkName: ${networkName}`);
  }

  const configRawData = fs.readFileSync(configPath);
  const config = JSON.parse(configRawData.toString());
  if (deployer) {
    config.deployer = deployer;
  }

  config.isGnosisSafe = isGnosisSafe;

  return config as Config;
};

export const getContractsConfigFromNetworkName = (networkName: string): IContractsConfig => {
  const CONFIG_DIR = `src/deployedContracts/deployedContracts.${networkName}.json`;
  const configPath = path.join(process.cwd(), CONFIG_DIR);

  if (!fs.existsSync(configPath)) {
    throw Error(`[getContractsConfigFromNetworkName] -Unknown networkName: ${networkName}`);
  }

  const configRawData = fs.readFileSync(configPath);
  const config = JSON.parse(configRawData.toString());

  return config as IContractsConfig;
};
