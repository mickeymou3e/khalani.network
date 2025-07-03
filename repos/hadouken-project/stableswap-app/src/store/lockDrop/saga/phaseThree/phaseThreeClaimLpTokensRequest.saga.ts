import { call, put } from 'typed-redux-saga'

import { ActionInProgress } from '@interfaces/action'
import { contractsActions } from '@store/contracts/contracts.slice'
import { setContractError } from '@store/contracts/setError.saga'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createClaimPlan } from '@store/history/plans/lockdrop/createClaimPlan'
import { lockDropActions } from '@store/lockDrop/lockDrop.slice'

import { phaseThreeClaimLpTokens } from './phaseThreeClaimLpTokens.saga'

export function* phaseThreeClaimLpTokensRequest(): Generator {
  try {
    yield* put(contractsActions.setActionInProgress(ActionInProgress.Claim))

    const { transactionId, operationId } = yield* call(createClaimPlan)

    yield* operationWrapper(
      transactionId,
      operationId,
      call(phaseThreeClaimLpTokens),
    )

    yield* put(lockDropActions.phaseThreeClaimLpTokensSuccess())

    yield* put(lockDropActions.updateLockdropUserClaimedLpTokensRequest())
  } catch (error) {
    yield* call(setContractError, error)

    yield* put(lockDropActions.phaseThreeClaimLpTokensFailure())
  } finally {
    yield* put(contractsActions.finishActionInProgress())
  }
}
