import { all, call, put } from 'typed-redux-saga'

import { BigDecimal } from '@utils/math'

import { lockDropActions } from '../lockDrop.slice'
import { LockdropDepositedTokensBalances } from '../lockDrop.types'
import { getDepositedTokensBalances } from './fetchDepositedTokensBalances.saga'
import { getParticipation } from './fetchParticipation.saga'

export function* updateLockdropDepositTokensBalances(): Generator {
  try {
    const [depositBalances, participation] = (yield* all([
      call(getDepositedTokensBalances),
      call(getParticipation),
    ])) as [LockdropDepositedTokensBalances, BigDecimal]

    yield* put(
      lockDropActions.updateLockdropDepositTokensBalancesSuccess({
        depositBalances,
        participation,
      }),
    )
  } catch {
    yield* put(lockDropActions.updateLockdropDepositTokensBalancesFailure())
  }
}
