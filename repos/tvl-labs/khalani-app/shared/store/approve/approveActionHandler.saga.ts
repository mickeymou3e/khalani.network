import { call, put, select } from 'typed-redux-saga'

import {
  approveRequestSaga,
  approveSelectors,
  approveActions,
} from '@tvl-labs/sdk'

import { createApprovePlan } from '../history'
import { historyActions } from '../history/history.slice'
import { operationWrapper } from '../history/operationWrapper.saga'
import { waitForLatestBlockToBeUpdated } from '../wallet'

export function* approveRequestActionHandler(): Generator {
  let approveTransactionId
  try {
    const tokens = yield* select(approveSelectors.approvalTokens)
    const { transactionId } = yield* call(createApprovePlan, tokens)
    approveTransactionId = transactionId

    // yield* put(notificationActions.setPendingStatus())
    const transactionResult = yield* operationWrapper(
      transactionId,
      call(approveRequestSaga, tokens),
    )

    yield* operationWrapper(
      transactionId,
      call(waitForLatestBlockToBeUpdated, transactionResult.blockNumber),
    )
    yield* put(approveActions.approveRequestSuccess())
    // yield* put(notificationActions.setCompletedStatus())
  } catch (error) {
    if (approveTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: approveTransactionId,
        }),
      )
    }
    yield* put(approveActions.approveRequestError(error))
    // yield* put(notificationActions.resetNotificationFlow())
  }
}
