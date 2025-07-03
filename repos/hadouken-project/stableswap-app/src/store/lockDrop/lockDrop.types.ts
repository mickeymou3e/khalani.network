import { EntityState } from '@reduxjs/toolkit'
import { IDepositToken } from '@store/deposit/deposit.types'
import { BigDecimal } from '@utils/math'

export type LockDropReduxState = {
  phaseOne?: LockdropPhaseOne
  phaseTwo?: LockdropPhaseTwo
  phaseThree?: LockdropPhaseThree

  currentPhase?: LockdropPhase
  phaseEndTime?: number

  totalUserHdkToClaim: BigDecimal
  totalUserValueLocked: BigDecimal
  totalHdkTokens: BigDecimal

  isClaimHDKInProgress?: boolean
  claimSuccessful?: boolean

  timer?: Timer
  lockDrops: EntityState<LockDrop>
  lockdropTvl: LockdropTVL
  phaseOneStartTime?: number
}

export type LockdropPhaseOne = {
  lock: {
    amount?: BigDecimal
    tokenAddress?: string
    lockLength?: number
    isInProgress?: boolean
    lockLengthBoost?: number
    dayBoost?: number
    estimatedReward?: BigDecimal
    isCalculatingReward?: boolean
  }
}

export type LockdropPhaseTwo = {
  deposit: {
    tokens?: IDepositToken[]
    tokensAmount?: Record<string, BigDecimal | undefined>
    isInProgress?: boolean
  }
  totalHDKTokensOnChain?: BigDecimal
  participationOnChain?: BigDecimal
  lockdropDepositBalances?: LockdropDepositedTokensBalances
}

export type LockdropPhaseThree = {
  unlock: {
    isInProgress?: boolean
    currentIdForUnlock?: number
  }
  claimLps: {
    totalUserLpTokensAvailableToClaim?: BigDecimal
    userLpClaimed?: BigDecimal
    daysLeft?: number
    currentAvailableLpTokens?: BigDecimal
    isInProgress?: boolean
  }
}

export type LockdropTVLResponse = {
  totalValueLocked: string
  totalValueLockedWithWeights: string
}

export type LockdropTVL = {
  totalValueLocked?: BigDecimal
  totalValueLockedWithWeights?: BigDecimal
}

export enum LockdropPhase {
  PreludiumOne,
  One,
  InterludiumOne,
  Two,
  InterludiumTwo,
  Three,
}

export type Timer = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export type LockdropInitializeInitializeSuccessPayload = Pick<
  LockDropReduxState,
  | 'currentPhase'
  | 'phaseEndTime'
  | 'phaseOne'
  | 'phaseTwo'
  | 'phaseThree'
  | 'lockdropTvl'
  | 'totalUserHdkToClaim'
  | 'totalUserValueLocked'
  | 'totalHdkTokens'
  | 'phaseOneStartTime'
> & {
  lockDrops: LockDrop[]
}

export enum LockLength {
  TwoWeeks,
  OneMonth,
  FourMonths,
  OneYear,
}

export enum PhaseOneDays {
  First = 1,
  Second,
  Third,
}

export type LockDropQueryResult = {
  id: string
  tokenAddress: string
  timestamp: string
  owner: string
  lockId: string
  amount: string
  lockLength: LockLength
  weight: string
  isLocked: boolean
  transaction: string
  reward: string
  lockInUSD: string
  isClaimed: boolean
}
export type LockDrop = Omit<
  LockDropQueryResult,
  'amount' | 'timestamp' | 'weight' | 'reward' | 'lockInUSD'
> & {
  amount: BigDecimal
  creationDate: Date
  weight: BigDecimal
  reward: BigDecimal
  lockInUSD: BigDecimal
}

export type LockDropQueryResultData = {
  list: LockDropQueryResult[]
  totalUserHdkToClaim: string
  totalUserValueLocked: string
  totalValueLockedWeighted: string
  totalHdkTokens: string
}

export type LockdropDetails = {
  lockdrops: LockDrop[]
  totalUserHdkToClaim: BigDecimal
  totalUserValueLocked: BigDecimal
  totalHdkTokens: BigDecimal
}

export type LockdropDepositedTokensBalancesResponse = {
  totalHdkDepositAmount: string
  totalPriceTokenDepositAmount: string

  userPriceTokenDepositAmount: string
  userHdkDepositAmount: string
}

export type LockdropDepositedTokensBalances = {
  totalHdkDepositAmount: BigDecimal
  totalPriceTokenDepositAmount: BigDecimal

  userPriceTokenDepositAmount: BigDecimal
  userHdkDepositAmount: BigDecimal
}
