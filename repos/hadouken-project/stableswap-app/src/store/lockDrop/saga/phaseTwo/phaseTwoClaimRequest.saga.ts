import { call, put, select } from 'typed-redux-saga'

import { ActionInProgress } from '@interfaces/action'
import { contractsActions } from '@store/contracts/contracts.slice'
import { setContractError } from '@store/contracts/setError.saga'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createClaimPlan } from '@store/history/plans/lockdrop/createClaimPlan'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { lockDropActions } from '@store/lockDrop/lockDrop.slice'

import { phaseTwoClaim } from './phaseTwoClaim.saga'

export function* phaseTwoClaimRequest(): Generator {
  try {
    const userLocks = yield* select(lockdropSelectors.userLocksTransactions)

    const userLocksIds = userLocks.reduce<number[]>((lockIds, lock) => {
      if (!lock.isClaimed) {
        lockIds.push(Number(lock.lockId))
      }

      return lockIds
    }, [])

    if (userLocksIds.length === 0) throw new Error('No locks')

    const { transactionId, operationId } = yield* call(createClaimPlan)

    yield* put(contractsActions.setActionInProgress(ActionInProgress.Claim))

    yield* operationWrapper(
      transactionId,
      operationId,
      call(phaseTwoClaim, userLocksIds),
    )

    yield* put(lockDropActions.claimHDKSuccess(userLocksIds))
  } catch (error) {
    yield* call(setContractError, error)

    yield* put(lockDropActions.claimHDKFailure())
  } finally {
    yield* put(contractsActions.finishActionInProgress())
  }
}
