import { BigNumber } from 'ethers'
import { apply, call, put, select } from 'typed-redux-saga'

import { CONFIRMATIONS, MaxUint256 } from '@constants/Networks'
import { waitForSubgraphToBeUpToDate } from '@dataSource/graph/subgraph'
import { ContractTransaction } from '@ethersproject/contracts'
import { ActionInProgress } from '@interfaces/action'
import { StrictEffect } from '@redux-saga/types'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { contractsActions } from '@store/contracts/contracts.slice'
import { setContractError } from '@store/contracts/setError.saga'
import { operationWrapper } from '@store/history/operationWrapper.saga'
import { createSwapPlan } from '@store/history/plans/pool/createSwapPlan'
import { networkSelectors } from '@store/network/network.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { approveToken } from '@store/tokens/approve/approve.saga'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'

import { SLIPPAGE_DEFAULT_VALUE } from '../../../containers/pools/constants'
import { toChainedReference } from '../../../utils/math'
import { addSlippageToValue } from '../../../utils/token'
import { setBatchRelayerApproveSaga } from '../../deposit/saga/setBatchRelayerApprove.saga'
import { lendingSelectors } from '../../lending/lending.selector'
import { swapSelectors } from '../swap.selector'
import { swapActions } from '../swap.slice'
import { ISwap } from '../swap.types'

export function* swapRequestSaga(
  swap: ISwap,
): Generator<StrictEffect, ContractTransaction> {
  const { sorTokens, sorSwaps, limits, funds, swapKind } = swap
  const chainId = yield* select(networkSelectors.applicationChainId)
  const reserveSelector = yield* select(
    lendingSelectors.selectReserveByWrappedId,
  )
  const tradeService = yield* select(servicesSelectors.tradeService)

  if (!tradeService) throw Error('trade service not found')

  const lendingOutToken = reserveSelector(swap.outToken)
  const lendingInToken = reserveSelector(swap.inToken)

  if (!lendingInToken && !lendingOutToken) {
    const swapTransaction = yield* apply(tradeService, tradeService.batchSwap, [
      sorTokens,
      sorSwaps,
      limits,
      swapKind,
      funds,
      chainId,
    ])
    yield* call(swapTransaction.wait, CONFIRMATIONS)

    return swapTransaction
  }

  const batchRelayer = yield* select(servicesSelectors.batchRelayerService)
  const userAddress = yield* select(walletSelectors.userAddress)
  const calls: string[] = []
  if (!batchRelayer) throw "Couldn't initialize batch relayer!"
  if (!userAddress) throw 'Wallet not initialized'

  const aTokenConnector = yield* select(
    contractsSelectors.staticATokenConnector,
  )

  if (lendingInToken) {
    const wrappedInHToken = aTokenConnector(lendingInToken.wrappedATokenAddress)
    const wrappedInHTokenAmount = yield* call(
      wrappedInHToken.dynamicToStaticAmount,
      swap.inTokenAmount.toBigNumber(),
    )

    calls.push(
      batchRelayer.encodeDepositAaveToken({
        staticToken: lendingInToken.wrappedATokenAddress,
        sender: userAddress,
        recipient: batchRelayer._balancerRelayer.address,
        fromUnderlying: false,
        amount: swap.inTokenAmount.toBigNumber(),
        outputReference: BigNumber.from(0),
      }),
    )
    calls.push(
      batchRelayer.encodeApproveToken(
        lendingInToken.wrappedATokenAddress,
        addSlippageToValue(
          wrappedInHTokenAmount,
          SLIPPAGE_DEFAULT_VALUE.toNumber(),
        ),
      ),
    )
  }
  calls.push(
    batchRelayer.encodeBatchSwap({
      swapType: swapKind,
      assets: sorTokens,
      swaps: sorSwaps,
      funds: {
        sender: lendingInToken
          ? batchRelayer._balancerRelayer.address
          : userAddress,
        recipient: lendingOutToken
          ? batchRelayer._balancerRelayer.address
          : userAddress,
        fromInternalBalance: false,
        toInternalBalance: false,
      },
      deadline: MaxUint256,
      limits,
      outputReferences: sorTokens.map((_asset, index) => ({
        index,
        key: toChainedReference(index),
      })),
      value: BigNumber.from(0),
    }),
  )
  if (lendingOutToken) {
    const tokenOutIndex = sorTokens.findIndex(
      (address) => address === lendingOutToken.wrappedATokenAddress,
    )
    const referenceIndex = toChainedReference(tokenOutIndex)

    calls.push(
      batchRelayer.encodeWithdrawAaveToken({
        staticToken: lendingOutToken.wrappedATokenAddress,
        sender: batchRelayer._balancerRelayer.address,
        recipient: userAddress,
        toUnderlying: false,
        amount: swap.outTokenAmount.toBigNumber(),
        outputReference: referenceIndex,
      }),
    )
  }

  const swapTransaction = yield* apply(batchRelayer, batchRelayer.multicall, [
    calls,
  ])
  yield* call(swapTransaction.wait, CONFIRMATIONS)

  return swapTransaction
}

export function* swapRequestActionHandler(): Generator {
  const swap = yield* select(swapSelectors.swap)

  try {
    yield* put(contractsActions.setActionInProgress(ActionInProgress.Swap))
    const vaultContract = yield* select(contractsSelectors.vault)
    const accountAddress = yield* select(walletSelectors.godwokenShortAddress)
    const tokenConnector = yield* select(contractsSelectors.tokenConnector)
    const reserveSelector = yield* select(
      lendingSelectors.selectReserveByWrappedId,
    )

    if (!vaultContract) throw Error('vault not found')
    if (!accountAddress) throw Error('userAddress not found')

    const lendingOutToken = reserveSelector(swap.outToken)
    const lendingInToken = reserveSelector(swap.inToken)

    const erc20Contract = tokenConnector
      ? yield* call(
          tokenConnector,
          lendingInToken ? lendingInToken.aTokenAddress : swap.inToken,
        )
      : null

    if (!erc20Contract) throw Error('Token contract not found')

    const {
      transactionId,
      shouldAskForBaseTokenApprove,
      operationIds,
    } = yield* call(
      createSwapPlan,
      erc20Contract.address,
      swap.inTokenAmount,
      lendingOutToken ? lendingOutToken.aTokenAddress : swap.outToken,
    )

    const batchRelayer = yield* select(servicesSelectors.batchRelayerService)
    const relayerApproved = yield* call(
      vaultContract.hasApprovedRelayer,
      accountAddress,
      batchRelayer?._balancerRelayer.address ?? '',
    )

    if (lendingInToken || lendingOutToken) {
      if (!relayerApproved) {
        yield* operationWrapper(
          transactionId,
          operationIds[0],
          call(
            setBatchRelayerApproveSaga,
            vaultContract,
            accountAddress,
            batchRelayer?._balancerRelayer.address ?? '',
            true,
          ),
        )
      }
    }

    if (shouldAskForBaseTokenApprove) {
      yield* operationWrapper(
        transactionId,
        operationIds[!relayerApproved ? 1 : 0],
        call(
          approveToken,
          erc20Contract,
          vaultContract.address,
          swap.inTokenAmount,
          0,
        ),
      )
    }

    const transactionResult = yield* operationWrapper(
      transactionId,
      operationIds[operationIds.length - 1],
      call(swapRequestSaga, swap),
    )

    if (!transactionResult) {
      throw Error('Failed to swap tokens')
    }

    yield* put(walletActions.setLastTx(transactionResult.hash))

    yield* call(waitForSubgraphToBeUpToDate, transactionResult.blockNumber)

    yield* put(swapActions.swapRequestSuccess())
  } catch (error) {
    yield* put(swapActions.swapRequestError())

    yield* call(setContractError, error)

    console.error(error)
  } finally {
    yield* put(contractsActions.finishActionInProgress())
  }
}
