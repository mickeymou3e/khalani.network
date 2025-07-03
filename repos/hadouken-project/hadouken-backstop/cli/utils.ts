import { BigNumber, Wallet, ethers, providers } from "ethers";
import fs from "fs";
import { getConfigStatic } from "./config";
import { CONFIG_PATH } from "./constants";
import { Config, Deployer, Environments } from "./types";

export const getDeployer = async (config: Config): Promise<Deployer> => {
  const DEPLOYER_PRIVATE_KEY = config.deployer as string;

  const provider = new providers.JsonRpcProvider(
    config.rpcUrl,
    Number(config.chainId)
  );

  const signer = new Wallet(DEPLOYER_PRIVATE_KEY, provider);

  return signer;
};

export const getProvider = (
  environment: Environments
): providers.JsonRpcProvider => {
  /** DEV network shouldn't be in prod bundle */
  const config = getConfigStatic(environment);
  const provider = new providers.JsonRpcProvider(
    config.rpcUrl,
    Number(config.chainId)
  );

  return provider;
};

export const getEnv = (name: string): Environments => {
  switch (name) {
    case "godwokenMainnet":
      return "godwoken-mainnet";
    case "godwokenTestnet":
      return "godwoken-testnet";
    case "zksyncTestnet":
      return "zksync-testnet";
    case "zksyncMainnet":
      return "zksync-mainnet";
    case "mantleTestnet":
      return "mantle-testnet";
    default: {
      console.error("missing network", name);
      throw Error("wrong network");
    }
  }
};

function updateConfig(path: string, fieldName: string, value: any): void {
  if (!fs.existsSync(path)) {
    fs.appendFileSync(path, JSON.stringify({}));
  }

  const file = fs.readFileSync(path, { encoding: "utf-8" });

  const parsedFileLines = JSON.parse(file);

  const newLines = {
    ...parsedFileLines,
    [fieldName]: value,
  };

  fs.writeFileSync(path, JSON.stringify(newLines));
}

export function updateDeployedContracts(
  environment: string,
  name: string,
  value: string
) {
  updateConfig(
    `${CONFIG_PATH}/deployedContracts/${environment}.json`,
    name,
    value
  );
}

export function BigNumberToFloat(value: BigNumber, decimals: number): number {
  return parseFloat(ethers.utils.formatUnits(value, decimals));
}

export function FloatToBigNumber(value: number, decimals: number): BigNumber {
  return ethers.utils.parseUnits(value.toString(), decimals);
}
