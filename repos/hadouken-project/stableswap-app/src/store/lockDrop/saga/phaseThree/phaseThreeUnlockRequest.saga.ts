import { call, put } from 'typed-redux-saga'

import { ActionInProgress } from '@interfaces/action'
import { PayloadAction } from '@reduxjs/toolkit'
import { contractsActions } from '@store/contracts/contracts.slice'
import { setContractError } from '@store/contracts/setError.saga'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createUnlockPlan } from '@store/history/plans/lockdrop/createUnlockPlan'
import { lockDropActions } from '@store/lockDrop/lockDrop.slice'

import { phaseThreeUnlock } from './phaseThreeUnlock.saga'

export function* phaseThreeUnlockRequest(
  action: PayloadAction<number>,
): Generator {
  try {
    yield* put(contractsActions.setActionInProgress(ActionInProgress.Unlock))

    const { transactionId, operationId } = yield* call(createUnlockPlan)

    yield* operationWrapper(
      transactionId,
      operationId,
      call(phaseThreeUnlock, action.payload),
    )

    yield* put(lockDropActions.phaseThreeUnlockSuccess(action.payload))
  } catch (error) {
    yield* call(setContractError, error)

    yield* put(lockDropActions.phaseThreeUnlockFailure())
  } finally {
    yield* put(contractsActions.finishActionInProgress())
  }
}
