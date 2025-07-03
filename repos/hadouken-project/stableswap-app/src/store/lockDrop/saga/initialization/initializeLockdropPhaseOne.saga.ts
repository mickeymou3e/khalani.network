import { StrictEffect } from 'redux-saga/effects'
import { select } from 'typed-redux-saga'

import { LOCK_DURATION_BOOST } from '@pages/Lockdrop/Lockdrop.constants'
import { LockLength, LockdropPhaseOne } from '@store/lockDrop/lockDrop.types'
import { networkSelectors } from '@store/network/network.selector'
import { BigDecimal } from '@utils/math'
import { config } from '@utils/network'

export function* initializeLockdropPhaseOne(): Generator<
  StrictEffect,
  { phaseOne: LockdropPhaseOne }
> {
  const chainId = yield* select(networkSelectors.applicationChainId)

  const lockdropToken = config.lockDropTokens[chainId].BoostedUSD

  const lock = {
    amount: BigDecimal.from(0),
    tokenAddress: lockdropToken,
    isInProgress: false,
    lockLength: LockLength.FourMonths,
    lockLengthBoost: LOCK_DURATION_BOOST[LockLength.FourMonths],
    estimatedReward: BigDecimal.from(0),
    isCalculatingReward: false,
  }

  return {
    phaseOne: {
      lock,
    },
  }
}
