import { all, apply, call, put, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { waitForSubgraphToBeUpToDate } from '@dataSource/graph/subgraph'
import { ContractTransaction } from '@ethersproject/contracts'
import { StrictEffect } from '@redux-saga/types'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { depositSelectors } from '@store/deposit/deposit.selector'
import { IDeposit } from '@store/deposit/deposit.types'
import { historyActions } from '@store/history/history.slice'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createDepositPlan } from '@store/history/plans/pool/createDepositPlan'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { approveToken } from '@store/tokens/approve/approve.saga'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'

export function* depositRequestSaga(
  deposit: IDeposit,
): Generator<StrictEffect, ContractTransaction> {
  const userAddress = yield* select(walletSelectors.userAddress)
  if (!userAddress) throw Error('userAddress not found')
  const selectPoolById = yield* select(poolSelectors.selectById)
  const selectTokensByAddresses = yield* select(tokenSelectors.selectMany)

  const poolServiceProvider = yield* select(
    servicesSelectors.poolServiceProvider,
  )

  const inTokens = selectTokensByAddresses(deposit.inTokens)
  const inTokensAmounts = deposit.inTokensAmounts

  const pool = selectPoolById(deposit.poolId)
  if (!pool) throw Error('pool not found')

  if (!poolServiceProvider) throw Error('pool service provider not found')

  const poolService = yield* apply(
    poolServiceProvider,
    poolServiceProvider.provide,
    [pool],
  )

  if (!poolService) throw Error('pool service not found')

  const depositTransaction = yield* apply(poolService, poolService.join, [
    {
      account: userAddress,
      pool: pool,
      amountsIn: inTokensAmounts.map((amount) => amount.toBigNumber()),
      tokensIn: inTokens,
    },
  ])

  yield* call(depositTransaction.wait, CONFIRMATIONS)

  return depositTransaction
}

export function* depositRequestActionHandler(): Generator {
  let depositPlanTransactionId
  try {
    const deposit = yield* select(depositSelectors.deposit)
    const connectTokenContractToAddress = yield* select(
      contractsSelectors.tokenConnector,
    )

    if (!connectTokenContractToAddress) throw Error('token selector not found')

    const inTokens = deposit.inTokens
    const inTokensAmounts = deposit.inTokensAmounts

    const {
      transactionId,
      tokensAddresses: tokensAddressesToApprove,
      amounts: amountsToApprove,
    } = yield* call(
      createDepositPlan,
      deposit.poolId,
      inTokens,
      inTokensAmounts,
    )

    const userAddress = yield* select(walletSelectors.userAddress)
    if (!userAddress) throw Error('userAddress not found')

    const vault = yield* select(contractsSelectors.vault)
    if (!vault) throw Error('Vault not defined')
    const approvedTransactions = []
    for (let i = 0; i < tokensAddressesToApprove.length; ++i) {
      const tokenAddressToApprove = tokensAddressesToApprove[i]
      const amountToApprove = amountsToApprove[i]
      const tokenContract = yield* call(
        connectTokenContractToAddress,
        tokenAddressToApprove,
      )
      const approveTransaction = yield* operationWrapper(
        transactionId,
        call(approveToken, tokenContract, vault.address, amountToApprove),
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
      call(depositRequestSaga, deposit),
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
