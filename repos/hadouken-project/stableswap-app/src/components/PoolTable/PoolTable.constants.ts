export const DEFAULT_SORTING_COLUMN = 'tvl'
export const BOOSTED_POOLS_SYMBOL_LOWER_CASE = [
  'hdk-b-2pool',
  'hdk-boosted-usd',
  'hdk-hckb-ckb',
  'hdk-heth-eth',
  'hdk-husdt-usdt',
  'hdk-husdc-usdc',
  'hdk-hwbtc-wbtc',
]
export const isTriCrypto = (symbol: string): boolean =>
  symbol.toLowerCase() === 'hdk-boosted-ckb-eth-usd' ||
  symbol.toLowerCase() === 'hdk-boosted-wbtc-eth-usd'
