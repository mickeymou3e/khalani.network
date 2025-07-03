import { call, put } from 'typed-redux-saga'

import { BigDecimal } from '@utils/math'

import { lockDropActions } from '../lockDrop.slice'
import { fetchUserLockdropLpTokens } from './fetchUserLockdropLpTokens.saga'

export function* updateLockdropUserClaimedLpTokens(): Generator {
  try {
    const { currentAvailableLpTokens, userLpClaimed } = yield* call(
      fetchUserLockdropLpTokens,
    )

    yield* put(
      lockDropActions.updateLockdropUserClaimedLpTokensSuccess({
        currentAvailableLpTokens: BigDecimal.from(currentAvailableLpTokens),
        userLpClaimed: BigDecimal.from(userLpClaimed),
      }),
    )
  } catch {
    yield* put(lockDropActions.updateLockdropUserClaimedLpTokensFailure())
  }
}
