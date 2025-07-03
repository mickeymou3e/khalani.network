import {
  GODWOKEN_MAINNET_CHAIN_ID,
  GODWOKEN_TESTNET_CHAIN_ID,
  MANTLE_MAINNET_CHAIN_ID,
  MANTLE_TESTNET_CHAIN_ID,
  ZKSYNC_MAINNET_CHAIN_ID,
  ZKSYNC_TESTNET_CHAIN_ID,
} from '../liquidation-fetcher/liquidation-fetcher.constants'
import { tokens as godwokenTestnetTokens } from '@config/tokens-godwoken-testnet.json'
import { tokens as godwokenMainnetTokens } from '@config/tokens.json'
import { tokens as zkSyncTestnetTokens } from '@config/tokens-zksync-testnet.json'
import { tokens as zkSyncMainnetTokens } from '@config/tokens-zksync-mainnet.json'
import { tokens as mantleTestnetTokens } from '@config/tokens-mantle-testnet.json'
import { tokens as mantleMainnetTokens } from '@config/tokens-mantle-mainnet.json'

export const TOKENS_BY_CHAIN = {
  [GODWOKEN_MAINNET_CHAIN_ID]: godwokenMainnetTokens,
  [GODWOKEN_TESTNET_CHAIN_ID]: godwokenTestnetTokens,

  [ZKSYNC_MAINNET_CHAIN_ID]: zkSyncMainnetTokens,
  [ZKSYNC_TESTNET_CHAIN_ID]: zkSyncTestnetTokens,

  [MANTLE_MAINNET_CHAIN_ID]: mantleMainnetTokens,
  [MANTLE_TESTNET_CHAIN_ID]: mantleTestnetTokens,
}
