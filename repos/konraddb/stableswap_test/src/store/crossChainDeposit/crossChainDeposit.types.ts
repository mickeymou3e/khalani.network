import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { ITokenOnlyAddressAndChain } from '@store/khala/tokens/tokens.types'
import { BigDecimal } from '@utils/math'

export interface ICrossChainDepositRequest {
  poolId: IPool['id']

  inTokens: ITokenOnlyAddressAndChain[]
  inTokensAmounts: BigDecimal[]

  slippage: number
}

export interface ICrossChainDeposit extends ICrossChainDepositRequest {
  outToken: IToken['address']
  outTokenAmounts: BigDecimal
}

export interface ICrossChainDepositSliceState
  extends Partial<ICrossChainDeposit> {
  loading: boolean

  error?: string
}
