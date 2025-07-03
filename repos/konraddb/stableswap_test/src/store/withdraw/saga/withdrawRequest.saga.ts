import { BigNumber } from 'ethers'
import { all, apply, call, put, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { waitForSubgraphToBeUpToDate } from '@dataSource/graph/subgraph'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { ContractTransaction } from '@ethersproject/contracts'
import { StrictEffect } from '@redux-saga/types'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { historyActions } from '@store/history/history.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createWithdrawPlan } from '@store/history/plans/pool/createWithdrawPlan'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { approveToken } from '@store/tokens/approve/approve.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import { withdrawSelectors } from '@store/withdraw/withdraw.selector'
import { IWithdraw } from '@store/withdraw/withdraw.types'

export function* withdrawRequestSaga(
  withdraw: IWithdraw,
): Generator<StrictEffect, ContractTransaction | null> {
  try {
    const userAddress = yield* select(walletSelectors.userAddress)

    if (!userAddress) throw Error('User not found')

    const selectPoolById = yield* select(poolSelectors.selectById)

    const poolServiceProvider = yield* select(
      servicesSelectors.poolServiceProvider,
    )

    const pool = selectPoolById(withdraw.poolId)

    if (!pool) throw Error('Pool not found')
    if (!withdraw?.inTokenAmount) throw Error('In token amount not defined')
    if (!poolServiceProvider) throw Error('pool service provider not found')

    const poolService = yield* apply(
      poolServiceProvider,
      poolServiceProvider.provide,
      [pool],
    )

    if (!poolService) throw Error('Pool service not found')

    const depositTransaction: TransactionResponse = yield* apply(
      poolService,
      poolService.exitTokenIn,
      [
        {
          account: userAddress,
          pool: pool,
          amountIn: withdraw?.inTokenAmount.toBigNumber() ?? BigNumber.from(0),
          tokenInAddress: withdraw.inToken,
          tokensOutAddresses: withdraw.outTokens,
        },
      ],
    )

    yield* call((depositTransaction as ContractTransaction).wait, CONFIRMATIONS)

    return depositTransaction as ContractTransaction
  } catch (error) {
    console.error(error)
  }

  return null
}

export function* withdrawRequestActionHandler(): Generator {
  let depositPlanTransactionId
  try {
    const withdraw = yield* select(withdrawSelectors.withdraw)
    const connectTokenContractToAddress = yield* select(
      contractsSelectors.tokenConnector,
    )

    const inToken = withdraw.inToken
    const inTokenAmount = withdraw.inTokenAmount

    const outTokens = withdraw.outTokens
    const outTokensAmounts = withdraw.outTokensAmounts

    const {
      transactionId,
      tokensAddresses: tokensAddressesToApprove,
      amounts: amountsToApprove,
    } = yield* call(
      createWithdrawPlan,
      inToken,
      inTokenAmount,
      outTokens,
      outTokensAmounts,
    )

    const userAddress = yield* select(walletSelectors.userAddress)

    if (!userAddress) throw Error('User not found')

    const vault = yield* select(contractsSelectors.vault)
    if (!vault) throw Error('vault not found')

    const approvedTransactions = []
    for (let i = 0; i < tokensAddressesToApprove.length; ++i) {
      const tokenAddress = tokensAddressesToApprove[i]
      const tokenAmount = amountsToApprove[i]
      const tokenContract =
        connectTokenContractToAddress &&
        (yield* call(connectTokenContractToAddress, tokenAddress))

      if (!tokenContract) throw Error('Token contract not found')

      const approveTransaction = yield* operationWrapper(
        transactionId,
        call(approveToken, tokenContract, vault.address, tokenAmount),
      )
      approvedTransactions.push(approveTransaction)
    }
    yield* all(
      approvedTransactions.map((transaction) =>
        transaction.wait(CONFIRMATIONS),
      ),
    )

    const transactionResult = yield* operationWrapper(
      transactionId,
      call(withdrawRequestSaga, withdraw),
    )

    yield* put(walletActions.setLastTx(transactionResult.hash))

    yield* operationWrapper(
      transactionId,
      call(waitForSubgraphToBeUpToDate, transactionResult.blockNumber),
    )
  } catch (error) {
    if (depositPlanTransactionId) {
      yield* put(
        historyActions.setOperationFailure({
          transactionId: depositPlanTransactionId,
        }),
      )
    }
    console.error(error)
  }
}
