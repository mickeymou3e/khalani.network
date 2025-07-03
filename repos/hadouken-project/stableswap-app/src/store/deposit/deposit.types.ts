import { BigNumber } from 'ethers'

import { PoolType } from '@interfaces/pool'
import { BigDecimal, ONE_PERCENT } from '@utils/math'

import { ITokenWithWeight } from '../pool/selectors/models/types'

export interface IDepositToken extends ITokenWithWeight {
  amount?: BigNumber
}

export type DepositTokenAmount = {
  address: string
  amount: BigNumber
  decimals: number
}

export class DepositEditorState {
  public isLoadingPreview = false
  public depositInProgress = false
  public isFetchingTokens = true
  public showDepositPreviewModal = false

  public showLowLiquidityBanner = false
  public buttonDisabled = false
  public stakeToBackstop = false
  public showWrappedCheckbox = false
  public showWrappedTokens = false

  public poolId: string | null = null
  public poolType: PoolType | null = null
  public depositTokens: IDepositToken[] = []
  public totalDepositValueUSD: BigDecimal = BigDecimal.from(0)
  public minBptTokensOut: BigDecimal = BigDecimal.from(0)
  public slippage: BigDecimal = BigDecimal.from(ONE_PERCENT)
  public priceImpact = '0.00%'
  public proportionalCalculationForToken: string | null = null
}

export interface IDepositSliceState {
  depositEditor: DepositEditorState
}

export type InitializeDepositSuccessPayload = {
  poolId: string
  poolType: PoolType
  depositTokens: IDepositToken[]
  showLowLiquidityBanner: boolean
  showWrappedCheckbox: boolean
}

export type AmountChangeRequestPayload = {
  amount?: BigNumber
  tokenAddress: string
}

export type AmountChangeSuccessPayload = {
  priceImpact: string
  totalDepositValueUSD: BigDecimal
  buttonDisabled: boolean
  proportionalCalculationForToken: string | null
  depositTokens: IDepositToken[]
}

export type WrappedTokenChangeSuccessPayload = {
  depositTokens: IDepositToken[]
  totalDepositValueUSD: BigDecimal
  buttonDisabled: boolean
  showWrappedTokens: boolean
}

export type ProportionalSuggestionSuccessPayload = {
  depositTokens: IDepositToken[]
  priceImpact: string
}
