import { address } from '@dataSource/graph/utils/formatters'
import {
  DAY_BOOST,
  LOCK_DURATION_BOOST,
} from '@pages/Lockdrop/Lockdrop.constants'
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { BigDecimal } from '@utils/math'

import { StoreKeys } from '../store.keys'
import {
  LockDrop,
  LockLength,
  PhaseOneDays,
  LockdropDetails,
  LockDropReduxState,
  LockdropInitializeInitializeSuccessPayload,
  LockdropPhase,
  LockdropTVL,
  Timer,
  LockdropDepositedTokensBalances,
} from './lockDrop.types'

export const lockdropAdapter = createEntityAdapter<LockDrop>()

const initialState: LockDropReduxState = {
  totalUserHdkToClaim: BigDecimal.from(0),
  totalUserValueLocked: BigDecimal.from(0),
  totalHdkTokens: BigDecimal.from(0),

  lockDrops: lockdropAdapter.getInitialState(),
  lockdropTvl: {},
}

export const lockDropSlice = createSlice({
  initialState,
  name: StoreKeys.LockDrop,
  reducers: {
    initializeLockdropRequest: (state) => {
      state = {
        ...initialState,
      }

      return state
    },
    initializeLockdropSuccess: (
      state,
      action: PayloadAction<LockdropInitializeInitializeSuccessPayload>,
    ) => {
      state.currentPhase = action.payload.currentPhase
      state.phaseEndTime = action.payload.phaseEndTime

      lockdropAdapter.setAll(state.lockDrops, action.payload.lockDrops)

      state.lockdropTvl = action.payload.lockdropTvl

      state.phaseOneStartTime = action.payload.phaseOneStartTime

      state.totalUserHdkToClaim = action.payload.totalUserHdkToClaim
      state.totalUserValueLocked = action.payload.totalUserValueLocked

      state.totalHdkTokens = action.payload.totalHdkTokens

      state.phaseOne = action.payload.phaseOne

      state.phaseTwo = action.payload.phaseTwo
      state.phaseThree = action.payload.phaseThree

      return state
    },
    initializeLockdropFailure: (state) => state,

    phaseOneSetLockToken: (state, action: PayloadAction<string>) => {
      if (state.phaseOne) {
        state.phaseOne.lock.tokenAddress = action.payload
        state.phaseOne.lock.estimatedReward = BigDecimal.from(0)
      }

      return state
    },

    phaseOneLockAmountChangeRequest: (
      state,
      action: PayloadAction<BigDecimal | undefined>,
    ) => {
      if (state.phaseOne) {
        if (action.payload?.gt(BigDecimal.from(0))) {
          state.phaseOne.lock.isCalculatingReward = true
        } else {
          state.phaseOne.lock.isCalculatingReward = false
          state.phaseOne.lock.estimatedReward = BigDecimal.from(0)
        }
      }

      return state
    },
    phaseOneLockAmountChangeSuccess: (
      state,
      action: PayloadAction<BigDecimal | undefined>,
    ) => {
      if (state.phaseOne) {
        state.phaseOne.lock.amount = action.payload

        if (!action.payload?.gt(BigDecimal.from(0))) {
          state.phaseOne.lock.estimatedReward = BigDecimal.from(0)
        }
      }

      return state
    },

    phaseOneLockDurationChangeRequest: (
      state,
      _action: PayloadAction<string>,
    ) => state,

    phaseOneLockLockDurationChangeSuccess: (
      state,
      action: PayloadAction<number>,
    ) => {
      if (state.phaseOne) {
        state.phaseOne.lock.lockLength = action.payload
        state.phaseOne.lock.lockLengthBoost =
          LOCK_DURATION_BOOST[Number(action.payload) as LockLength]
      }

      return state
    },

    phaseOneLockRequest: (state) => {
      if (state.phaseOne) {
        state.phaseOne.lock.isInProgress = true
      }

      return state
    },
    phaseOneLockSuccess: (state) => {
      if (state.phaseOne) {
        state.phaseOne.lock.isInProgress = false
      }

      return state
    },
    phaseOneLockFailure: (state) => {
      if (state.phaseOne) {
        state.phaseOne.lock.isInProgress = false
      }
      return state
    },
    phaseOneClearLockState: (state) => {
      if (state.phaseOne) {
        state.phaseOne.lock = {
          isInProgress: false,
          amount: undefined,
          lockLength: LockLength.FourMonths,
          tokenAddress: state.phaseOne.lock.tokenAddress,
          lockLengthBoost: LOCK_DURATION_BOOST[LockLength.FourMonths],
          dayBoost: state.phaseOne.lock.dayBoost,
          estimatedReward: BigDecimal.from(0),
        }
      }
      return state
    },
    phaseOneCalculateEstimatedRewardRequest: (state) => state,

    phaseOneCalculateEstimatedRewardSuccess: (
      state,
      action: PayloadAction<BigDecimal>,
    ) => {
      if (state.phaseOne) {
        state.phaseOne.lock.estimatedReward = action.payload

        state.phaseOne.lock.isCalculatingReward = false
      }
      return state
    },
    phaseOneCalculateEstimatedRewardFailure: (state) => state,

    phaseTwoDepositTokenAmountChange: (
      state,
      action: PayloadAction<{
        amount: BigDecimal | undefined
        tokenAddress: string
      }>,
    ) => {
      const { amount, tokenAddress } = action.payload

      if (state.phaseTwo) {
        if (state.phaseTwo.deposit.tokensAmount) {
          state.phaseTwo.deposit.tokensAmount[address(tokenAddress)] = amount

          return state
        }
      }
    },

    phaseTwoDepositRequest: (state) => {
      if (state.phaseTwo) {
        state.phaseTwo.deposit.isInProgress = true
      }
      return state
    },
    phaseTwoDepositSuccess: (state) => {
      if (state.phaseTwo) {
        state.phaseTwo.deposit.isInProgress = false
      }

      return state
    },

    phaseTwoDepositFailure: (state) => {
      if (state.phaseTwo) {
        state.phaseTwo.deposit.isInProgress = false
      }

      return state
    },

    phaseTwoDepositClear: (state) => {
      if (state.phaseTwo) {
        state.phaseTwo.deposit.tokensAmount = {}
      }
      return state
    },

    phaseThreeUnlockRequest: (state, action: PayloadAction<number>) => {
      if (state.phaseThree) {
        state.phaseThree.unlock.isInProgress = true
        state.phaseThree.unlock.currentIdForUnlock = action.payload
      }

      return state
    },

    phaseThreeUnlockSuccess: (state, action: PayloadAction<number>) => {
      if (state.phaseThree) {
        state.phaseThree.unlock.isInProgress = false
        state.phaseThree.unlock.currentIdForUnlock = undefined
      }

      const lockId = '0x' + action.payload.toString(16)

      lockdropAdapter.updateOne(state.lockDrops, {
        id: lockId,
        changes: {
          isLocked: false,
        },
      })

      return state
    },

    phaseThreeUnlockFailure: (state) => {
      if (state.phaseThree) {
        state.phaseThree.unlock.isInProgress = false
        state.phaseThree.unlock.currentIdForUnlock = undefined
      }

      return state
    },
    phaseThreeClaimLpTokensRequest: (state) => {
      if (state.phaseThree) {
        state.phaseThree.claimLps.isInProgress = true
      }

      return state
    },
    phaseThreeClaimLpTokensSuccess: (state) => {
      if (state.phaseThree) {
        state.phaseThree.claimLps.isInProgress = false
      }

      return state
    },
    phaseThreeClaimLpTokensFailure: (state) => {
      if (state.phaseThree) {
        state.phaseThree.claimLps.isInProgress = false
      }

      return state
    },

    claimHDKRequest: (state) => {
      state.isClaimHDKInProgress = true

      return state
    },
    claimHDKSuccess: (state, action: PayloadAction<number[]>) => {
      state.isClaimHDKInProgress = false
      state.claimSuccessful = true

      const locksToUpdate = action.payload.map((id) => {
        const lockId = '0x' + id.toString(16)

        return {
          id: lockId,
          changes: {
            isClaimed: true,
          },
        }
      })

      lockdropAdapter.updateMany(state.lockDrops, locksToUpdate)

      return state
    },
    claimHDKFailure: (state) => {
      state.isClaimHDKInProgress = false

      return state
    },

    clearClaimSuccessfulFlag: (state) => {
      state.claimSuccessful = false
    },

    updateLockdropDataRequests: (state) => state,

    updateLockdropDataSuccess: (
      state,
      action: PayloadAction<{
        lockdropDetails: LockdropDetails
        lockdropTvl: LockdropTVL
      }>,
    ) => {
      lockdropAdapter.upsertMany(
        state.lockDrops,
        action.payload.lockdropDetails.lockdrops,
      )

      state.totalUserHdkToClaim =
        action.payload.lockdropDetails.totalUserHdkToClaim

      state.totalUserValueLocked =
        action.payload.lockdropDetails.totalUserValueLocked

      state.lockdropTvl = action.payload.lockdropTvl

      return state
    },
    updateLockdropDataFailure: (state) => state,

    updateTimerRequest: (state) => state,

    updateTimerSuccess: (state, action: PayloadAction<Timer>) => {
      state.timer = action.payload

      if (state.phaseOne) {
        if (state.currentPhase === LockdropPhase.One) {
          switch (action.payload.days) {
            //  remaining days so if 2 days left we add first day boost
            case 2:
              state.phaseOne.lock.dayBoost = DAY_BOOST[PhaseOneDays.First]
              break
            case 1:
              state.phaseOne.lock.dayBoost = DAY_BOOST[PhaseOneDays.Second]
              break
            case 0:
              state.phaseOne.lock.dayBoost = DAY_BOOST[PhaseOneDays.Third]
          }
        }
      }

      const isPhaseEnd =
        action.payload.days === 0 &&
        action.payload.hours === 0 &&
        action.payload.minutes === 0 &&
        action.payload.seconds === 0

      if (state.currentPhase === LockdropPhase.One && isPhaseEnd) {
        state.currentPhase = LockdropPhase.InterludiumOne
      } else if (state.currentPhase === LockdropPhase.Two && isPhaseEnd) {
        state.currentPhase = LockdropPhase.InterludiumTwo
      }

      return state
    },

    updateLockdropUserClaimedLpTokensRequest: (state) => state,
    updateLockdropUserClaimedLpTokensSuccess: (
      state,
      action: PayloadAction<{
        currentAvailableLpTokens: BigDecimal
        userLpClaimed: BigDecimal
      }>,
    ) => {
      if (state.phaseThree) {
        state.phaseThree.claimLps.currentAvailableLpTokens =
          action.payload.currentAvailableLpTokens

        state.phaseThree.claimLps.userLpClaimed = action.payload.userLpClaimed
      }

      return state
    },
    updateLockdropUserClaimedLpTokensFailure: (state) => state,

    updateLockdropDepositTokensBalancesRequest: (state) => state,
    updateLockdropDepositTokensBalancesSuccess: (
      state,
      action: PayloadAction<{
        depositBalances: LockdropDepositedTokensBalances
        participation: BigDecimal
      }>,
    ) => {
      if (state.phaseTwo) {
        state.phaseTwo.lockdropDepositBalances = action.payload.depositBalances
        state.phaseTwo.participationOnChain = action.payload.participation
      }

      return state
    },
    updateLockdropDepositTokensBalancesFailure: (state) => state,
  },
})

export const lockDropActions = lockDropSlice.actions
export const lockDropReducer = lockDropSlice.reducer
