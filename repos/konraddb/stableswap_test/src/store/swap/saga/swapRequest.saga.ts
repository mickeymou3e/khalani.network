import { apply, call, put, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { waitForSubgraphToBeUpToDate } from '@dataSource/graph/subgraph'
import { ContractTransaction } from '@ethersproject/contracts'
import { StrictEffect } from '@redux-saga/types'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { historyActions } from '@store/history/history.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createSwapPlan } from '@store/history/plans/pool/createSwapPlan'
import { servicesSelectors } from '@store/services/services.selector'
import { approveToken } from '@store/tokens/approve/approve.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'

import { swapSelectors } from '../swap.selector'
import { swapActions } from '../swap.slice'
import { ISwap } from '../swap.types'

export function* swapRequestSaga(
  swap: ISwap,
): Generator<StrictEffect, ContractTransaction> {
  const { sorTokens, sorSwaps, limits, funds, swapKind } = swap
  const tradeService = yield* select(servicesSelectors.tradeService)
  if (!tradeService) throw Error('trade service not found')

  const swapTransaction = yield* apply(tradeService, tradeService.batchSwap, [
    sorTokens,
    sorSwaps,
    limits,
    swapKind,
    funds,
  ])
  yield* call(swapTransaction.wait, CONFIRMATIONS)

  return swapTransaction
}

export function* swapRequestActionHandler(): Generator {
  const swap = yield* select(swapSelectors.swap)

  let swapPlanTransactionId
  try {
    const vaultContract = yield* select(contractsSelectors.vault)
    if (!vaultContract) throw Error('vault not found')
    const accountAddress = yield* select(walletSelectors.godwokenShortAddress)

    if (!accountAddress) throw Error('userAddress not found')

    const tokenConnector = yield* select(contractsSelectors.tokenConnector)

    const erc20Contract = tokenConnector
      ? yield* call(tokenConnector, swap.inToken)
      : null

    if (!erc20Contract) throw Error('Token contract not found')

    const { transactionId, shouldAskForBaseTokenApprove } = yield* call(
      createSwapPlan,
      swap.inToken,
      swap.inTokenAmount,
      swap.outToken,
    )

    swapPlanTransactionId = transactionId

    if (shouldAskForBaseTokenApprove) {
      const approveTransaction = yield* operationWrapper(
        transactionId,
        call(
          approveToken,
          erc20Contract,
          vaultContract.address,
          swap.inTokenAmount,
        ),
      )

      yield* call(approveTransaction.wait, CONFIRMATIONS)
    }

    const transactionResult = yield* operationWrapper(
      transactionId,
      call(swapRequestSaga, swap),
    )

    yield* put(walletActions.setLastTx(transactionResult.hash))

    yield* operationWrapper(
      transactionId,
      call(waitForSubgraphToBeUpToDate, transactionResult.blockNumber),
    )

    yield* put(swapActions.swapRequestSuccess())
  } catch (error) {
    if (swapPlanTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: swapPlanTransactionId,
        }),
      )
    }
    yield* put(swapActions.swapRequestError(error))
    console.error(error)
  }
}
