import { Overrides, providers, Wallet } from "ethers";

import { AddressTranslator } from "nervos-godwoken-integration";

import {
  PolyjuiceJsonRpcProvider,
  PolyjuiceWallet,
} from "@polyjuice-provider/ethers";
import { PolyjuiceHttpProvider } from "@polyjuice-provider/web3";

import Config from "../../config.json";
import { getNetworkName } from "../../src/utils";
import { Config as IConfig } from "../../src/types";

if (!process.env.DEPLOYER_PRIVATE_KEY) {
  throw new Error("Set env variable DEPLOYER_PRIVATE_KEY");
}

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

const polyjuiceConfig = {
  rollupTypeHash: Config.nervos.rollupTypeHash,
  ethAccountLockCodeHash: Config.nervos.ethAccountLockCodeHash,
  web3Url: Config.nervos.godwoken.rpcUrl,
};

export const providerPolyjuiceEthers = new PolyjuiceJsonRpcProvider(
  polyjuiceConfig,
  Config.nervos.godwoken.rpcUrl
);

const httpProvider = new PolyjuiceHttpProvider(
  Config.nervos.godwoken.rpcUrl,
  polyjuiceConfig
);
const web3Provider = new providers.Web3Provider(httpProvider);

export const GAS_PRICE = 0;
export const GAS_LIMIT = 12000000;

export const transactionOverrides: Overrides = {
  gasPrice: GAS_PRICE,
  gasLimit: GAS_LIMIT,
};

export const provider = providerPolyjuiceEthers;

export const addressTranslator = new AddressTranslator({
  CKB_URL: Config.nervos.ckb.url,
  RPC_URL: Config.nervos.godwoken.rpcUrl,
  INDEXER_URL: Config.nervos.indexer.url,
  deposit_lock_script_type_hash: Config.nervos.depositLockScriptTypeHash,
  eth_account_lock_script_type_hash: Config.nervos.ethAccountLockCodeHash,
  rollup_type_script: {
    code_hash: Config.nervos.rollupTypeScript.codeHash,
    hash_type: Config.nervos.rollupTypeScript.hashType,
    args: Config.nervos.rollupTypeScript.args,
  },
  rollup_type_hash: Config.nervos.rollupTypeHash,
  portal_wallet_lock_hash: Config.nervos.portalWalletLockHash,
});
// TODO: Possible source of bug's. Promise not awaited. Make problem in case of creating L2 Account
// addressTranslator.init()

export const translateAddress = (address: string) =>
  addressTranslator.ethAddressToGodwokenShortAddress(address);

export const deployer = new PolyjuiceWallet(
  DEPLOYER_PRIVATE_KEY,
  polyjuiceConfig,
  provider
);

const ethereumProvider = new providers.InfuraProvider(
  getNetworkName(Config.ethereum.networkId),
  Config.ethereum.fallback.infura.apiKey
);

export const connectEthereumRPC = (
  privateKey: string,
  config: typeof Config
) => {
  const ethereumProvider = new providers.InfuraProvider(
    getNetworkName(config.ethereum.networkId),
    config.ethereum.fallback.infura.apiKey
  );
  return {
    deployer: new Wallet(privateKey, ethereumProvider),
    provider: ethereumProvider,
    translateAddress: (address: string) => address,
  };
};

export const connectRPC = async (privateKey: string, config: IConfig) => {
  const polyjuiceConfig = {
    rollupTypeHash: config.nervos.rollupTypeHash,
    ethAccountLockCodeHash: config.nervos.ethAccountLockCodeHash,
    web3Url: config.nervos.godwoken.rpcUrl,
  };

  const providerPolyjuiceEthers = new PolyjuiceJsonRpcProvider(
    polyjuiceConfig,
    config.nervos.godwoken.rpcUrl
  );

  const httpProvider = new PolyjuiceHttpProvider(
    config.nervos.godwoken.rpcUrl,
    polyjuiceConfig
  );
  const web3Provider = new providers.Web3Provider(httpProvider);

  const provider = providerPolyjuiceEthers;

  const addressTranslator = new AddressTranslator({
    CKB_URL: config.nervos.ckb.url,
    RPC_URL: Config.nervos.godwoken.rpcUrl,
    INDEXER_URL: config.nervos.indexer.url,
    deposit_lock_script_type_hash: config.nervos.depositLockScriptTypeHash,
    eth_account_lock_script_type_hash: config.nervos.ethAccountLockCodeHash,
    rollup_type_script: {
      code_hash: config.nervos.rollupTypeScript.codeHash,
      hash_type: config.nervos.rollupTypeScript.hashType,
      args: config.nervos.rollupTypeScript.args,
    },
    rollup_type_hash: config.nervos.rollupTypeHash,
    portal_wallet_lock_hash: config.nervos.portalWalletLockHash,
  });
  // await addressTranslator.init()

  console.log(Config)
  const translateAddress = (address: string) =>
    addressTranslator.ethAddressToGodwokenShortAddress(address);

  const deployer = new PolyjuiceWallet(privateKey, polyjuiceConfig, provider);

  return {
    deployer,
    provider,
    translateAddress,
  };
};
