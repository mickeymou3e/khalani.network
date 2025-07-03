export enum ChainId {
  GW_DEVNET = 1024777,
  GW_TESTNET = 71401,
  GW_MAINNET = 71402,
}

// exports for external consumption
export type BigintIsh = bigint | string

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export const MINIMUM_LIQUIDITY = BigInt(1000)

// exports for internal consumption
export const ZERO = BigInt(0)
export const ONE = BigInt(1)
export const TWO = BigInt(2)
export const THREE = BigInt(3)
export const FIVE = BigInt(5)
export const TEN = BigInt(10)
export const _100 = BigInt(100)
export const FEES_NUMERATOR = BigInt(9975)
export const FEES_DENOMINATOR = BigInt(10000)
