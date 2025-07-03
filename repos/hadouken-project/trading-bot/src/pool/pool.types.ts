import { BigNumber } from 'ethers'

export interface Decimal {
  value: BigNumber
  decimals: number
}

export type PairIds =
  | 'yokaiUsdcWckb'
  | 'yokaiEthWckb'
  | 'yokaiWbtcWckb'
  | 'hadoukenUsdcWckb'
  | 'hadoukenEthWckb'
  | 'hadoukenWbtcWckb'

export type PoolHadoukenData = {
  tokenInfo: Map<
    string,
    {
      address: string
      amount: BigNumber
      weight: BigNumber
      symbol: string
      decimals: number
    }
  >
  swapFee: BigNumber
}

export type PoolYokaiData = {
  tokenInfo: Map<
    string,
    {
      address: string
      amount: BigNumber
      symbol: string
      decimals: number
    }
  >
}
