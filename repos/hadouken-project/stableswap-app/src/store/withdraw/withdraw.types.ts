import { BigNumber } from 'ethers'

import { SLIPPAGE_DEFAULT_VALUE } from '@containers/pools/constants'
import { TokenModelBalanceWithIcon } from '@hadouken-project/ui'
import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { ITokenWithWeight } from '@store/pool/selectors/models/types'
import { TokenBalances } from '@store/userShares/userShares.types'
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

  slippage: BigDecimal
  isMaxAmount?: boolean
  tokenIndex?: number | null
}

export interface InitializeWithdrawSuccess {
  poolId: string
  buttonDisabled: boolean
  userMaxLpTokenBalance: BigDecimal
  isUserShareGreaterThanMaximumShare: boolean
  isInitialized: boolean
}

export interface InitializeWithdrawRequest {
  poolId: string
}

export type IWithdraw = IWithdrawRequest

export class WithdrawState {
  public poolId: IPool['id'] | undefined = undefined
  public inToken: IToken['address'] | undefined = undefined
  public inTokenAmount: BigDecimal | undefined = undefined
  public loading = false
  public withdrawInProgress = false
  public outTokens: IToken['address'][] = []
  public outTokensAmounts: BigDecimal[] = []

  public draggingSlider = false
  public isFetchingComposableProportions = false
  public composablePoolProportionalBalances: TokenBalances = {}
  public displayImbalanceComposablePoolWithSignificantUserHoldingBanner = false

  public openModal = false
  public selectedToken: TokenModelBalanceWithIcon | undefined = undefined
  public percentage = 30
  public priceImpact = '0.00%'
  public slippage: BigDecimal = SLIPPAGE_DEFAULT_VALUE
  public withdrawAmount: BigDecimal = BigDecimal.from(0)
  public tokensMaxBalance: { [id: string]: BigNumber } | undefined = undefined
  public tokenIndex: number | null | undefined = undefined
  public isMaxAmount = false
  public type: IWithdrawType | undefined = undefined

  public isUserShareGreaterThanMaximumShare = false
  public userMaxLpTokenBalance = BigDecimal.from(0)
  public buttonDisabled = true
  public isInitialized = false
  public showWrappedCheckbox = false
  public showWrappedTokens = false
  public wrappedTokensBalance: TokenBalances = {}
  public withdrawTokens: ITokenWithWeight[] = []
  public proportionalToken: TokenModelBalanceWithIcon | undefined = undefined
}

export interface IWithdrawSingleTokenMax {
  poolId: string
  outTokens: string[]
  tokenInAddress: string
  tokenInAmount: BigDecimal
}

export interface IWithdrawTokensMaxBalance {
  [id: string]: BigNumber
}

export type CalculateComposablePoolProportionalWithdrawPayload = {
  poolId: string
  percentage: number
}
