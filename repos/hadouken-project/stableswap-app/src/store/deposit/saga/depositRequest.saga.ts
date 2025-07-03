import { all, call, put, select } from 'typed-redux-saga'

import { waitForSubgraphToBeUpToDate } from '@dataSource/graph/subgraph'
import { ActionInProgress } from '@interfaces/action'
import { PoolType } from '@interfaces/pool'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { contractsActions } from '@store/contracts/contracts.slice'
import { setContractError } from '@store/contracts/setError.saga'
import { depositSelectors } from '@store/deposit/deposit.selector'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createDepositPlan } from '@store/history/plans/pool/createDepositPlan'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { approveToken } from '@store/tokens/approve/approve.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'

import { depositActions } from '../deposit.slice'
import { depositToPoolSaga } from './depositToPool.saga'
import { initializeDepositSaga } from './editor/initializeDepositSaga'
import { setBatchRelayerApproveSaga } from './setBatchRelayerApprove.saga'

export function* depositRequestSaga(): Generator {
  try {
    yield* put(contractsActions.setActionInProgress(ActionInProgress.Deposit))

    const poolSelector = yield* select(poolSelectors.selectById)
    const batchRelayer = yield* select(contractsSelectors.batchRelayer)

    const { poolId, depositTokens, stakeToBackstop } = yield* select(
      depositSelectors.depositEditor,
    )
    const connectTokenContractToAddress = yield* select(
      contractsSelectors.tokenConnector,
    )

    if (!poolId) {
      throw Error('pool id not found')
    }

    const pool = poolSelector(poolId)
    if (!pool) throw Error('pool not found')
    if (!connectTokenContractToAddress) throw Error('token selector not found')

    const {
      transactionId,
      tokensAddresses: tokensAddressesToApprove,
      amounts: amountsToApprove,
      shouldApproveRelayer,
      operationIds,
    } = yield* call(
      createDepositPlan,
      poolId,
      depositTokens,
      stakeToBackstop,
      pool.poolType === PoolType.WeightedBoosted ||
        pool.poolType === PoolType.ComposableStable,
    )

    const userAddress = yield* select(walletSelectors.userAddress)
    if (!userAddress) throw Error('userAddress not found')

    const vault = yield* select(contractsSelectors.vault)
    if (!vault) throw Error('Vault not defined')

    if (shouldApproveRelayer) {
      yield* operationWrapper(
        transactionId,
        operationIds[0],
        call(
          setBatchRelayerApproveSaga,
          vault,
          userAddress,
          batchRelayer?.address ?? '',
          true,
        ),
      )
    }

    const transactionsToApprove = []
    for (let index = 0; index < tokensAddressesToApprove.length; ++index) {
      const tokenAddressToApprove = tokensAddressesToApprove[index]
      const amountToApprove = amountsToApprove[index]
      const tokenContract = yield* call(
        connectTokenContractToAddress,
        tokenAddressToApprove,
      )
      const transactionToApprove = operationWrapper(
        transactionId,
        operationIds[shouldApproveRelayer ? index + 1 : index],
        call(
          approveToken,
          tokenContract,
          vault.address,
          amountToApprove,
          index,
        ),
      )
      transactionsToApprove.push(transactionToApprove)
    }

    yield* all(transactionsToApprove)

    const transactionResult = yield* operationWrapper(
      transactionId,
      operationIds[operationIds.length - 1],
      call(depositToPoolSaga),
    )

    if (!transactionResult) {
      throw Error('Failed to deposit tokens')
    }

    yield* put(walletActions.setLastTx(transactionResult.hash))

    yield* call(waitForSubgraphToBeUpToDate, transactionResult.blockNumber)

    yield* put(depositActions.depositRequestSuccess())
    yield* put(depositActions.depositPreviewModalChange(false))
    yield* call(
      initializeDepositSaga,
      depositActions.initializeDepositRequest(pool.id),
    )
  } catch (error) {
    yield* put(depositActions.depositPreviewModalChange(false))

    yield* put(depositActions.depositRequestError())

    yield* call(setContractError, error)

    console.error(error)
  } finally {
    yield* put(contractsActions.finishActionInProgress())
  }
}
