import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { getChainConfig } from '@config'
import { address } from '@dataSource/graph/utils/formatters'
import { IToken } from '@interfaces/token'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { historyActions } from '@store/history/history.slice'
import {
  IContractOperation,
  TransactionStatus,
  TransactionType,
} from '@store/history/history.types'
import {
  createApproveOperation,
  createBatchRelayerApproveOperation,
  createSwapOperation,
} from '@store/history/history.utils'
import { networkSelectors } from '@store/network/network.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

import { lendingSelectors } from '../../../lending/lending.selector'
import { servicesSelectors } from '../../../services/services.selector'

export function* createSwapPlan(
  inTokenAddress: IToken['address'],
  inTokenAmount: BigDecimal,
  outTokenAddress: IToken['address'],
): Generator<
  StrictEffect,
  {
    transactionId: string
    operationIds: string[]
    shouldAskForBaseTokenApprove: boolean
  }
> {
  const operations: IContractOperation[] = []

  const vaultContract = yield* select(contractsSelectors.vault)
  if (!vaultContract) throw Error('vaultContract not defined')

  const selectTokenById = yield* select(tokenSelectors.selectById)
  const tokenConnector = yield* select(contractsSelectors.tokenConnector)
  const userAddress = yield* select(walletSelectors.godwokenShortAddress)
  const reserveSelector = yield* select(
    lendingSelectors.selectReserveByHTokenId,
  )
  const lendingInToken = reserveSelector(inTokenAddress)
  const lendingOutToken = reserveSelector(outTokenAddress)

  if (!userAddress) throw Error('User address not found')

  const chainId = yield* select(networkSelectors.applicationChainId)
  const config = getChainConfig(chainId)

  const tokenContract = tokenConnector?.(inTokenAddress)
  if (!tokenContract) throw Error('Token contract not found')

  const inToken = selectTokenById(inTokenAddress)

  if (!inToken) throw Error('In token not found')

  const outToken = lendingOutToken
    ? selectTokenById(lendingOutToken.aTokenAddress)
    : selectTokenById(outTokenAddress)

  if (!outToken) throw Error('Out token not found')

  const batchRelayer = yield* select(servicesSelectors.batchRelayerService)

  if (lendingInToken || lendingOutToken) {
    if (!batchRelayer) throw 'Batch relayer is not initialized!'
    const relayerApproved = yield* call(
      vaultContract.hasApprovedRelayer,
      userAddress,
      batchRelayer._balancerRelayer.address,
    )

    if (!relayerApproved) {
      operations.push(createBatchRelayerApproveOperation())
    }
  }

  const approveAddress = vaultContract.address

  let shouldAskForBaseTokenApprove = false
  if (
    !config.nativeCurrency.wrapAddress ||
    address(config.nativeCurrency.wrapAddress) !== address(inTokenAddress)
  ) {
    const allowanceValue = yield* call(
      tokenContract.allowance,
      userAddress,
      approveAddress,
    )

    shouldAskForBaseTokenApprove = BigDecimal.from(
      allowanceValue,
      inToken.decimals,
    ).lt(inTokenAmount)
  }

  if (shouldAskForBaseTokenApprove) {
    operations.push(
      createApproveOperation(inToken.symbol, inTokenAmount.toString()),
    )
  }

  operations.push(
    createSwapOperation(
      inToken.displayName,
      outToken.displayName,
      inTokenAmount.toString(),
    ),
  )

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Swap,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    transactionId: transactionId,
    shouldAskForBaseTokenApprove: shouldAskForBaseTokenApprove,
    operationIds: operations.map((operation) => operation.id),
  }
}
