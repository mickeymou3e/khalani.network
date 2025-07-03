import { call, put, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { waitForSubgraphToBeUpToDate } from '@dataSource/graph/subgraph'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { historyActions } from '@store/history/history.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createLockPlan } from '@store/history/plans/pool/createLockPlan'
import { approveToken } from '@store/tokens/approve/approve.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'

import { lockSelectors } from '../lock.selector'
import { lockActions } from '../lock.slice'
import { ILockRequest } from '../lock.types'

export function* lockRequestSaga(lock: ILockRequest): Generator {
  // const { user, token, amount, destinationChain } = lock

  // contract execute here (temporary mocked)

  yield console.log('lock')

  return lock
}

export function* lockRequestActionHandler(): Generator {
  const lock = yield* select(lockSelectors.lock)
  let lockPlanTransactionId
  try {
    const vaultContract = yield* select(contractsSelectors.vault)
    const accountAddress = yield* select(walletSelectors.godwokenShortAddress)
    const tokenConnector = yield* select(contractsSelectors.tokenConnector)
    const erc20Contract = tokenConnector
      ? yield* call(tokenConnector, lock.token)
      : null

    const { transactionId, shouldAskForBaseTokenApprove } = yield* call(
      createLockPlan,
      lock.token,
      lock.amount,
    )

    lockPlanTransactionId = transactionId

    if (!vaultContract) throw Error('Vault contract not found')
    if (!erc20Contract) throw Error('Token contract not found')
    if (!accountAddress) throw Error('Acount address not found')
    if (!lock.amount) throw Error('Lock amount not found')

    if (shouldAskForBaseTokenApprove) {
      const approveTransaction = yield* operationWrapper(
        transactionId,
        call(approveToken, erc20Contract, vaultContract.address, lock.amount),
      )

      yield* call(approveTransaction.wait, CONFIRMATIONS)
    }

    const transactionResult = yield* operationWrapper(
      transactionId,
      call(lockRequestSaga, lock),
    )
    yield* put(lockActions.lockPreviewReset())

    yield* put(walletActions.setLastTx(transactionResult.hash))

    yield* operationWrapper(
      transactionId,
      call(waitForSubgraphToBeUpToDate, transactionResult.blockNumber),
    )
  } catch (error) {
    if (lockPlanTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: lockPlanTransactionId,
        }),
      )
    }
    yield* put(lockActions.lockRequestError(error))
    console.error(error)
  }
}
