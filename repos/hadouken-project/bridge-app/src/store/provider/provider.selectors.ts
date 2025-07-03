import { AddressTranslator } from 'nervos-godwoken-integration'

import config from '@config'
import { createSelector } from '@reduxjs/toolkit'
import {
  getEthereumWeb3Provider,
  getGodwokenWebsocketProvider,
} from '@store/wallet/wallet.utils'

const provider = createSelector([], () => getEthereumWeb3Provider())

const wsGodwokenProvider = createSelector([], () =>
  getGodwokenWebsocketProvider(),
)

const addressTranslator = createSelector([provider], (provider) => {
  const env = (() => {
    if (process.env.CONFIG === 'mainnet') {
      const env = 'mainnet'
      return env
    } else if (process.env.CONFIG === 'testnet') {
      const env = 'testnet'
      return env
    }
  })()

  if (provider) {
    return new AddressTranslator(env, {
      CKB_URL: config.ckb.ckb.url,
      RPC_URL: config.godwoken.rpcReadOnlyUrl,
      INDEXER_URL: config.ckb.indexer.url,
      deposit_lock_script_type_hash: config.ckb.depositLockScriptTypeHash,
      eth_account_lock_script_type_hash: config.ckb.ethAccountLockCodeHash,
      rollup_type_script: {
        code_hash: config.ckb.rollupTypeScript.codeHash,
        hash_type: config.ckb.rollupTypeScript.hashType,
        args: config.ckb.rollupTypeScript.args,
      },
      rollup_type_hash: config.ckb.rollupTypeHash,
      rc_lock_script_type_hash: config.ckb.rcLockScriptTypeHash,
    })
  }
  return null
})

export const providerSelectors = {
  provider,
  addressTranslator,
  wsGodwokenProvider,
}
