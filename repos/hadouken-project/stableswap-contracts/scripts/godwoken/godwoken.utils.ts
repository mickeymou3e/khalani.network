import { AddressTranslator } from "nervos-godwoken-integration";
import config from "../../config.json";

function getAddressTranslator() {
  const addressTranslator = new AddressTranslator({
    CKB_URL: config.nervos.ckb.url,
    INDEXER_URL: config.nervos.indexer.url,
    RPC_URL: config.nervos.godwoken.rpcUrl,
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

export const addressTranslator = getAddressTranslator()
