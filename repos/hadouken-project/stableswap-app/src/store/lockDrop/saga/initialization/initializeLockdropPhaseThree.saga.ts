import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { LockdropPhaseThree } from '@store/lockDrop/lockDrop.types'
import { DAY } from '@utils/date'
import { BigDecimal } from '@utils/math'

import { fetchUserLockdropLpTokens } from '../fetchUserLockdropLpTokens.saga'

export function* initializeLockdropPhaseThree(): Generator<
  StrictEffect,
  { phaseThree: LockdropPhaseThree }
> {
  const lockdropContract = yield* select(contractsSelectors.lockDropConnector)

  if (!lockdropContract) throw new Error('Lockdrop not defined')

  const {
    currentAvailableLpTokens,
    totalUserLpTokensAvailableToClaim,
    userLpClaimed,
  } = yield* call(fetchUserLockdropLpTokens)

  const withdrawLpDurationTimeEnd = yield* call(
    lockdropContract.WITHDRAW_LP_DURATION_TIME,
  )

  const withdrawLpDurationTimeMilliseconds =
    withdrawLpDurationTimeEnd.toNumber() * 1000

  const now = Date.now()

  const witdrawDurationEnd = withdrawLpDurationTimeMilliseconds + now

  const timeDifference = witdrawDurationEnd - now

  const days = Math.floor(timeDifference / (DAY * 1000))

  return {
    phaseThree: {
      unlock: {},
      claimLps: {
        totalUserLpTokensAvailableToClaim: BigDecimal.from(
          totalUserLpTokensAvailableToClaim,
        ),
        userLpClaimed: BigDecimal.from(userLpClaimed),
        daysLeft: days,
        currentAvailableLpTokens: BigDecimal.from(currentAvailableLpTokens),
        isInProgress: false,
      },
    },
  }
}
