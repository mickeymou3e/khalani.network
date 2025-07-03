import { SwapV2 } from '@hadouken-project/sdk'
import { ITradeRouteProps } from '@hadouken-project/ui'
import { IToken } from '@interfaces/token'
import { BigDecimal } from '@utils/math'

import { FundManagement, SwapType } from '../../services/trade/types'

export interface ISwapRequest {
  inToken: IToken['address']
  inTokenAmount: BigDecimal

  outToken: IToken['address']

  slippage: BigDecimal
}

export interface ISwap extends ISwapRequest {
  outTokenAmount: BigDecimal
  outTokenAmountWithSlippage: BigDecimal

  swapKind: SwapType

  sorSwaps: SwapV2[]
  swapNodes: ITradeRouteProps['routes']
  sorTokens: IToken['address'][]

  limits: string[]
  funds: FundManagement

  priceImpact: number
  fee: BigDecimal
  spotPrice: string

  isUnderPerformance: boolean
  isInsufficientLiquidity: boolean
}

export interface ISwapSliceState extends Partial<ISwap> {
  loading: boolean
  swapInProgress: boolean

  baseTokenAddress?: string
  quoteTokenAddress?: string
  baseTokenValue?: BigDecimal
  quotePrice?: string | null
  slippage: BigDecimal
}
