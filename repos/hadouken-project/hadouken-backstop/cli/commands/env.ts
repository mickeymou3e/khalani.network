import fs from "fs";
import prompts from "prompts";
import { getConfig } from "../config";
import { CONFIG_PATH } from "../constants";
import { Config, Environments, ScriptRunEnvironment } from "../types";
import { getDeployer, getProvider } from "../utils";

export const selectConfigCommand = async () => {
  const configs = fs.readdirSync(`${CONFIG_PATH}/environmentConfig`);

  const removeExtension = (filename: string) => {
    return filename.substring(0, filename.lastIndexOf(".")) || filename;
  };

  const { config: configName } = await prompts({
    type: "select",
    name: "config",
    choices: configs.map((config) => ({ title: config, value: config })),
    message: "Select config",
  });

  const config = getConfig(removeExtension(configName) as Environments);

  return config;
};

export const confirmCorrectWalletCommand = async (
  config: Config
): Promise<ScriptRunEnvironment> => {
  const env = config.env as Environments;
  const provider = getProvider(env);
  const deployer = await getDeployer(config);

  const { confirmed } = await prompts({
    type: "confirm",
    name: "confirmed",
    message: `Use ${deployer.address} wallet`,
    initial: true,
  });

  if (!confirmed) {
    throw new Error("Set env variable DEPLOYER_PRIVATE_KEY");
  }

  return {
    env,
    address: deployer.address,
    provider,
    deployer,
    transactionOverrides: {
      gasPrice: config.gasPrice,
      gasLimit: config.gasLimit,
    },
  };
};
