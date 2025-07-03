import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { BigDecimal } from '@utils/math'

export interface IDepositRequest {
  poolId: IPool['id']

  inTokens: IToken['address'][]
  inTokensAmounts: BigDecimal[]

  slippage: number
}

export interface IDeposit extends IDepositRequest {
  outToken: IToken['address']
  outTokenAmounts: BigDecimal
}

export interface IDepositSliceState extends Partial<IDeposit> {
  loading: boolean

  error?: string
}
