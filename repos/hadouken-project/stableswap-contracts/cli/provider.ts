import { Overrides, providers, Signer } from "ethers";

import { AddressTranslator } from "nervos-godwoken-integration";

import {
  PolyjuiceJsonRpcProvider,
  PolyjuiceWallet,
} from "@polyjuice-provider/ethers";

import { Config } from "../src/types";

export const GAS_PRICE = 0;
export const GAS_LIMIT = 12000000;

export const transactionOverrides: Overrides = {
  gasPrice: GAS_PRICE,
  gasLimit: GAS_LIMIT,
};

export const setupProvider = async (config: Config) => {
  const polyjuiceConfig = {
    rollupTypeHash: config.nervos.rollupTypeHash,
    ethAccountLockCodeHash: config.nervos.ethAccountLockCodeHash,
    web3Url: config.nervos.godwoken.rpcUrl,
  };

  const providerPolyjuiceEthers = new PolyjuiceJsonRpcProvider(
    polyjuiceConfig,
    config.nervos.godwoken.rpcUrl
  );

  return providerPolyjuiceEthers;
};


export const setupWallet = async (privateKey: string, provider: providers.JsonRpcProvider, config: Config)=> {
    const polyjuiceConfig = {
      rollupTypeHash: config.nervos.rollupTypeHash,
      ethAccountLockCodeHash: config.nervos.ethAccountLockCodeHash,
      web3Url: config.nervos.godwoken.rpcUrl,
    };
  
    const wallet = new PolyjuiceWallet(privateKey, polyjuiceConfig, provider);
  
    const walletOnChainAddress = await getOnChainAddress(wallet, config)

    return {wallet, address: walletOnChainAddress };
  };


export const getOnChainAddress = async (wallet: Signer, config: Config)=> {
  const walletAddress = await wallet.getAddress()
  const addressTranslator = new AddressTranslator({
    CKB_URL: config.nervos.ckb.url,
    RPC_URL: config.nervos.godwoken.rpcUrl,
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
  })

  const onChainWalletAddress = addressTranslator.ethAddressToGodwokenShortAddress(walletAddress)

  return onChainWalletAddress;
};