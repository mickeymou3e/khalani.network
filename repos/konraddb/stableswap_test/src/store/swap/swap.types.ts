import { IToken } from '@interfaces/token'
import { SwapV2 } from '@tvl-labs/swap-v2-sdk'
import { BigDecimal } from '@utils/math'

import { FundManagement, SwapType } from '../../services/trade/types'

export interface ISwapRequest {
  inToken: IToken['address']
  inTokenAmount: BigDecimal

  outToken: IToken['address']

  slippage: number
}

export interface ISwap extends ISwapRequest {
  outTokenAmount: BigDecimal

  swapKind: SwapType

  sorSwaps: SwapV2[]
  sorTokens: IToken['address'][]

  limits: string[]
  funds: FundManagement

  fee: BigDecimal
}

export interface ISwapSliceState extends Partial<ISwap> {
  loading: boolean

  error?: string
}
