import { AddressTranslator } from "nervos-godwoken-integration";

import { getConfig } from "./config";
import { GodwokenNetwork } from "./types";

export const getAddressTranslator = (networkId: GodwokenNetwork) => {
  const config = getConfig(networkId)

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
  
  return addressTranslator
}
