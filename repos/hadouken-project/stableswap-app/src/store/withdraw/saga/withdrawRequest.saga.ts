import { BigNumber } from 'ethers'
import { all, apply, call, put, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { waitForSubgraphToBeUpToDate } from '@dataSource/graph/subgraph'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { ContractTransaction } from '@ethersproject/contracts'
import { ActionInProgress } from '@interfaces/action'
import { PoolType } from '@interfaces/pool'
import { StrictEffect } from '@redux-saga/types'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { contractsActions } from '@store/contracts/contracts.slice'
import { setContractError } from '@store/contracts/setError.saga'
import { waitForUserShareBeFetched } from '@store/deposit/saga/editor/utils'
import { setBatchRelayerApproveSaga } from '@store/deposit/saga/setBatchRelayerApprove.saga'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createWithdrawPlan } from '@store/history/plans/pool/createWithdrawPlan'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { approveToken } from '@store/tokens/approve/approve.saga'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import { withdrawSelectors } from '@store/withdraw/withdraw.selector'
import { IWithdraw, IWithdrawType } from '@store/withdraw/withdraw.types'
import { BigDecimal } from '@utils/math'

import { metricsSelectors } from '../../metrics/metrics.selectors'
import { withdrawActions } from '../withdraw.slice'
import { getComposablePoolAmountsIn } from './calculateWithdrawPreview.saga'
import { initializeWithdrawSaga } from './withdrawInitialize.saga'

export function* withdrawRequestSaga(
  withdraw: IWithdraw,
): Generator<StrictEffect, ContractTransaction> {
  const userAddress = yield* select(walletSelectors.userAddress)

  if (!userAddress) throw Error('User not found')

  const selectPoolBalancesUSD = yield* select(
    metricsSelectors.selectPoolBalancesUSD,
  )

  const selectPoolById = yield* select(poolSelectors.selectById)
  const poolModelSelector = yield* select(poolsModelsSelector.selectById)
  const poolServiceProvider = yield* select(
    servicesSelectors.poolServiceProvider,
  )
  const allPools = yield* select(poolSelectors.selectAll)
  const pool = selectPoolById(withdraw.poolId)
  const poolModel = poolModelSelector(withdraw.poolId)
  const slippage = withdraw.slippage

  if (!poolModel) throw Error('Pool model not found')
  if (!pool) throw Error('Pool not found')
  if (!withdraw?.inTokenAmount) throw Error('In token amount not defined')
  if (!poolServiceProvider) throw Error('pool service provider not found')

  const poolService = yield* apply(
    poolServiceProvider,
    poolServiceProvider.provide,
    [pool],
  )

  const allTokens = yield* select(tokenSelectors.selectAllTokens)

  const balances = selectPoolBalancesUSD(poolModel.id)

  if (!poolService) throw Error('Pool service not found')

  if (withdraw.type === IWithdrawType.ExactOut) {
    const chainId = yield* select(networkSelectors.applicationChainId)

    const withdrawTransaction: TransactionResponse = yield* apply(
      poolService,
      poolService.exitTokensOut,
      [
        {
          account: userAddress,
          pool,
          allPools,
          allTokens,
          tokenInAddress: withdraw.inToken,
          amountsOut: withdraw.outTokensAmounts.map((amount) =>
            amount.toBigNumber(),
          ),
          tokensOutAddresses: withdraw.outTokens,
          fullUserLpTokenBalance: withdraw.inTokenAmount.toBigNumber(),
          isMaxAmount: withdraw.isMaxAmount,
          tokenIndex: withdraw.tokenIndex,
          slippage: slippage.toBigNumber(),
          chainId,
        },
      ],
    )
    yield* call(
      (withdrawTransaction as ContractTransaction).wait,
      CONFIRMATIONS,
    )

    return withdrawTransaction as ContractTransaction
  }

  if (pool.poolType === PoolType.ComposableStable) {
    const amountsIn = yield* call(
      getComposablePoolAmountsIn,
      poolModel,
      withdraw.inTokenAmount,
    )

    const sum = amountsIn.reduce(
      (sum, amount) => sum.add(amount),
      BigDecimal.from(0),
    )

    const factor = withdraw.inTokenAmount.div(sum)

    const scaledFactor = BigDecimal.from(
      factor.decimals > 18
        ? factor.toBigNumber().div(BigNumber.from(10).pow(factor.decimals - 18))
        : factor
            .toBigNumber()
            .mul(BigNumber.from(10).pow(18 - factor.decimals)),
      18,
    )

    const chainId = yield* select(networkSelectors.applicationChainId)

    const withdrawTransaction: TransactionResponse = yield* apply(
      poolService,
      poolService.exitTokenIn,
      [
        {
          account: userAddress,
          pool,
          allPools,
          allTokens,
          amountsIn: amountsIn.map((amount) =>
            amount.mul(scaledFactor).toBigNumber(),
          ),
          tokenInAddress: withdraw.inToken,
          tokensOutAddresses: withdraw.outTokens,
          chainId,
        },
      ],
    )

    yield* call(
      (withdrawTransaction as ContractTransaction).wait,
      CONFIRMATIONS,
    )

    return withdrawTransaction as ContractTransaction
  } else {
    const chainId = yield* select(networkSelectors.applicationChainId)

    const withdrawTransaction: TransactionResponse = yield* apply(
      poolService,
      poolService.exitTokenIn,
      [
        {
          account: userAddress,
          pool: pool,
          allPools,
          allTokens,
          amountsIn: [
            withdraw?.inTokenAmount.toBigNumber() ?? BigNumber.from(0),
          ],
          tokenInAddress: withdraw.inToken,
          tokensOutAddresses: withdraw.outTokens,
          balances: balances,
          chainId,
        },
      ],
    )

    yield* call(
      (withdrawTransaction as ContractTransaction).wait,
      CONFIRMATIONS,
    )

    return withdrawTransaction as ContractTransaction
  }
}

export function* withdrawRequestActionHandler(): Generator {
  try {
    yield* put(contractsActions.setActionInProgress(ActionInProgress.Withdraw))
    const poolSelector = yield* select(poolSelectors.selectById)
    const withdraw = yield* select(withdrawSelectors.withdraw)
    const connectTokenContractToAddress = yield* select(
      contractsSelectors.tokenConnector,
    )

    const batchRelayer = yield* select(contractsSelectors.batchRelayer)
    const inToken = withdraw.inToken
    const inTokenAmount = withdraw.inTokenAmount

    const outTokens = withdraw.outTokens
    const outTokensAmounts = withdraw.outTokensAmounts

    const pool = poolSelector(withdraw.poolId)
    if (!pool) throw Error('pool not found')

    const {
      transactionId,
      tokensAddresses: tokensAddressesToApprove,
      amounts: amountsToApprove,
      shouldApproveRelayer,
      operationIds,
    } = yield* call(
      createWithdrawPlan,
      inToken,
      inTokenAmount,
      outTokens,
      outTokensAmounts,
      pool.poolType === PoolType.WeightedBoosted ||
        pool.poolType === PoolType.ComposableStable,
    )

    const userAddress = yield* select(walletSelectors.userAddress)

    if (!userAddress) throw Error('User not found')

    const vault = yield* select(contractsSelectors.vault)
    if (!vault) throw Error('vault not found')

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
      const tokenAddress = tokensAddressesToApprove[index]
      const tokenAmount = amountsToApprove[index]
      const tokenContract =
        connectTokenContractToAddress &&
        (yield* call(connectTokenContractToAddress, tokenAddress))

      if (!tokenContract) throw Error('Token contract not found')

      const transactionToApprove = operationWrapper(
        transactionId,
        operationIds[shouldApproveRelayer ? index + 1 : index],
        call(approveToken, tokenContract, vault.address, tokenAmount, index),
      )
      transactionsToApprove.push(transactionToApprove)
    }
    yield* all(transactionsToApprove)

    const transactionResult = yield* operationWrapper(
      transactionId,
      operationIds[operationIds.length - 1],
      call(withdrawRequestSaga, withdraw),
    )

    if (!transactionResult) {
      throw Error('Failed to withdraw tokens')
    }

    yield* put(walletActions.setLastTx(transactionResult.hash))

    yield* call(waitForSubgraphToBeUpToDate, transactionResult.blockNumber)

    yield* put(withdrawActions.withdrawRequestSuccess())

    yield* put(withdrawActions.openModal(false))

    yield* call(waitForUserShareBeFetched)

    yield* put(withdrawActions.resetWithdrawState())

    yield* call(
      initializeWithdrawSaga,
      withdrawActions.withdrawInitializeRequest({ poolId: withdraw.poolId }),
    )
  } catch (error) {
    yield* put(withdrawActions.openModal(false))
    yield* put(withdrawActions.withdrawRequestError(error))

    yield* call(setContractError, error)

    console.error(error)
  } finally {
    yield* put(contractsActions.finishActionInProgress())
  }
}
