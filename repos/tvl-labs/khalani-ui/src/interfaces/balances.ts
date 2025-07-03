import { ENetwork } from '@interfaces/core'

export interface ITokenBalancesAcrossChains {
  tokenId: string
  tokenSymbol: string
  tokenDecimals: number
  balances: {
    chainId: ENetwork
    value: bigint
  }[]
  summedBalance?: bigint
  summedBalanceUSD?: bigint
}
