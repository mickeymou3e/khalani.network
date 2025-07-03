import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { BigDecimal } from '@utils/math'

export enum IWithdrawType {
  ExactIn,
  ExactOut,
}

export interface IWithdrawExactInRequest {
  inTokenAmount: BigDecimal
}

export interface IWithdrawExactOutRequest {
  outTokensAmounts: BigDecimal[]
}

export interface IWithdrawRequest
  extends IWithdrawExactInRequest,
    IWithdrawExactOutRequest {
  poolId: IPool['id']

  inToken: IToken['address']
  outTokens: IToken['address'][]

  type: IWithdrawType

  slippage: number
}

export type IWithdraw = IWithdrawRequest

export interface IWithdrawSliceState extends Partial<IWithdraw> {
  loading: boolean

  error?: string
}
