import fs from "fs";
import { CONFIG_PATH } from "../constants";
import { Config, Environments, IContractsConfig } from "../types";

import godwokenMainnetConfig from "./environmentConfig/godwoken-mainnet.json";
import godwokenTestnetConfig from "./environmentConfig/godwoken-testnet.json";

export const getConfigStatic = (environment: Environments): Config => {
  switch (environment) {
    case "godwoken-mainnet":
      return godwokenMainnetConfig as Config;
    case "godwoken-testnet":
      return godwokenTestnetConfig as Config;
    default:
      console.log(
        `Unknown environment: ${environment} - Using local config file`
      );
      return godwokenTestnetConfig as Config;
  }
};

export const getContractsConfig = (
  environment: Environments
): IContractsConfig => {
  const CONFIG_DIR = `${CONFIG_PATH}/deployedContracts/${environment}.json`;
  const configPath = CONFIG_DIR;

  if (!fs.existsSync(configPath)) {
    console.log(
      `Unknown environment: ${environment} - Using local contracts config file`
    );
    const configRawData = fs.readFileSync(
      `${CONFIG_PATH}/deployedContracts/godwoken-testnet.json`
    );
    const contractsConfig = JSON.parse(configRawData.toString());

    return contractsConfig as IContractsConfig;
  }

  const configRawData = fs.readFileSync(configPath);
  const contractsConfig = JSON.parse(configRawData.toString());

  return contractsConfig as IContractsConfig;
};

export const getConfig = (environment: Environments): Config => {
  const CONFIG_DIR = `${CONFIG_PATH}/environmentConfig/${environment}.json`;
  const configPath = CONFIG_DIR;
  const deployer = process.env.CLI_ACCOUNT;
  const isGnosisSafe = Boolean(process.env.GNOSIS_SAFE === "true");

  if (!fs.existsSync(configPath)) {
    console.log(
      `Unknown environment: ${environment} - Using local config file`
    );

    const configRawData = fs.readFileSync(
      `${CONFIG_PATH}/environmentConfig/godwoken-testnet.json`
    );

    const config: Config = JSON.parse(configRawData.toString());

    if (deployer) {
      config.deployer = deployer;
    }

    config.isGnosisSafe = isGnosisSafe;

    return config as Config;
  }

  const configRawData = fs.readFileSync(configPath);
  const config = JSON.parse(configRawData.toString());

  if (deployer) {
    config.deployer = deployer;
  }

  config.isGnosisSafe = isGnosisSafe;

  return config as Config;
};
