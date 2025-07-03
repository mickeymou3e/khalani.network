import { IToken } from '@interfaces/token'
import { IChain } from '@store/chains/chains.types'
import { ITokenModelBalanceWithChain } from '@store/khala/tokens/tokens.types'
import { Address } from '@tvl-labs/swap-v2-sdk'
import { BigDecimal } from '@utils/math'

export interface ILiquidityList {
  id: string
  token: IToken
  chain: IChain
  tvl: BigDecimal
  volume: BigDecimal
}

export interface ILiquidityHook {
  liquidityList: ILiquidityList[]
  userTVLList: IUserTVLList[]
}

export interface IUserTVLResponse {
  id: number
  tokenAddress: Address
  amount: number
}

export interface IUserTVLList {
  id: number
  token: ITokenModelBalanceWithChain
  chain: IChain
  amount: number
}
