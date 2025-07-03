import { BigNumber } from 'ethers'

export const ZERO = BigNumber.from(0)
export const GODWOKEN_TESTNET_CHAIN_ID = '0x116e9'
export const ZKSYNC_TESTNET_CHAIN_ID = '0x118'
export const GODWOKEN_MAINNET_CHAIN_ID = '0x116ea'
export const ZKSYNC_MAINNET_CHAIN_ID = '0x144'
export const MANTLE_TESTNET_CHAIN_ID = '0x1389'
export const MANTLE_MAINNET_CHAIN_ID = '0x1388'

export const CHAIN_EXPLORER = {
  [GODWOKEN_MAINNET_CHAIN_ID]: 'https://www.gwscan.com',
  [GODWOKEN_TESTNET_CHAIN_ID]: 'https://v1.testnet.gwscan.com',
  [ZKSYNC_MAINNET_CHAIN_ID]: 'https://explorer.zksync.io',
  [ZKSYNC_TESTNET_CHAIN_ID]: 'https://goerli.explorer.zksync.io',
  [MANTLE_MAINNET_CHAIN_ID]: 'https://explorer.mantle.xyz',
  [MANTLE_TESTNET_CHAIN_ID]: 'https://explorer.testnet.mantle.xyz',
}
