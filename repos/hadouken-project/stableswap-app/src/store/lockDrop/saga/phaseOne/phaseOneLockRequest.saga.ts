import { call, put, select } from 'typed-redux-saga'

import { waitForSubgraphToBeUpToDate } from '@dataSource/graph/subgraph'
import { ActionInProgress } from '@interfaces/action'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { contractsActions } from '@store/contracts/contracts.slice'
import { setContractError } from '@store/contracts/setError.saga'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createLockPlan } from '@store/history/plans/lockdrop/createLockPlan'
import { lockDropActions } from '@store/lockDrop/lockDrop.slice'
import { approveToken } from '@store/tokens/approve/approve.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { lockdropSelectors } from '../../lockDrop.selector'
import { phaseOneLock } from './phaseOneLock.saga'

export function* phaseOneLockRequest(): Generator {
  try {
    const amount = yield* select(lockdropSelectors.phaseOneLockAmount)

    const selectedToken = yield* select(
      lockdropSelectors.phaseOneSelectedLockToken,
    )

    const lockdropContract = yield* select(contractsSelectors.lockDropConnector)

    const userAddress = yield* select(walletSelectors.userAddress)

    if (!userAddress) throw Error('Missing user address')

    if (!selectedToken) throw new Error('Lock token is not selected')

    if (!lockdropContract) throw new Error('Lockdrop contract not found')

    yield* put(contractsActions.setActionInProgress(ActionInProgress.Lock))

    const connectToken = yield* select(contractsSelectors.tokenConnector)

    const tokenContract = connectToken(selectedToken.address)

    const { shouldApproveToken, transactionId, operationIds } = yield* call(
      createLockPlan,
      selectedToken.address,
      amount,
      lockdropContract.address,
    )

    if (shouldApproveToken) {
      yield* operationWrapper(
        transactionId,
        operationIds[0],
        call(
          approveToken,
          tokenContract,

          lockdropContract.address,
          amount,
          0,
        ),
      )
    }

    const transactionResult = yield* operationWrapper(
      transactionId,
      operationIds[shouldApproveToken ? 1 : 0],
      call(phaseOneLock),
    )

    yield* put(lockDropActions.phaseOneLockSuccess())

    yield* put(lockDropActions.phaseOneClearLockState())

    if (transactionResult) {
      yield* call(waitForSubgraphToBeUpToDate, transactionResult.blockNumber)

      yield* put(lockDropActions.updateLockdropDataRequests())
    }
  } catch (error) {
    yield* call(setContractError, error)

    yield* put(lockDropActions.phaseOneLockFailure())
  } finally {
    yield* put(contractsActions.finishActionInProgress())
  }
}
