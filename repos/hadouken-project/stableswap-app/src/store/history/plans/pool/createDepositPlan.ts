import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { getChainConfig } from '@config'
import { address } from '@dataSource/graph/utils/formatters'
import { IToken } from '@interfaces/token'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { IDepositToken } from '@store/deposit/deposit.types'
import { historyActions } from '@store/history/history.slice'
import {
  IContractOperation,
  TransactionStatus,
  TransactionType,
} from '@store/history/history.types'
import {
  createApproveOperation,
  createBatchRelayerApproveOperation,
  createDepositToPoolOperation,
} from '@store/history/history.utils'
import { networkSelectors } from '@store/network/network.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'
import { getPoolFullName } from '@utils/pool'

export function* createDepositPlan(
  poolId: string,
  depositTokens: IDepositToken[],
  stakeToBackstop: boolean,
  checkBatchRelayer?: boolean,
): Generator<
  StrictEffect,
  {
    transactionId: string
    tokensAddresses: IToken['address'][]
    amounts: BigDecimal[]
    shouldApproveRelayer: boolean
    operationIds: string[]
  }
> {
  const operations: IContractOperation[] = []
  const selectPoolById = yield* select(poolSelectors.selectById)

  const connectTokenContractToAddress = yield* select(
    contractsSelectors.tokenConnector,
  )

  const batchRelayer = yield* select(contractsSelectors.batchRelayer)
  const vault = yield* select(contractsSelectors.vault)
  if (!vault) throw Error('vault not found')

  const userAddress = yield* select(walletSelectors.godwokenShortAddress)
  if (!userAddress) throw Error('userAddress  not found')

  const pool = yield* call(selectPoolById, poolId)
  if (!pool) throw Error('pool not found')

  const chainId = yield* select(networkSelectors.applicationChainId)

  let shouldApproveRelayer = false

  if (checkBatchRelayer) {
    const relayerApproved = yield* call(
      vault.hasApprovedRelayer,
      userAddress,
      batchRelayer?.address ?? '',
    )

    if (!relayerApproved) {
      shouldApproveRelayer = true
      operations.push(createBatchRelayerApproveOperation())
    }
  }

  const tokensToApprove: string[] = []
  const amountsToApprove: BigDecimal[] = []

  const config = getChainConfig(chainId)

  for (const token of depositTokens) {
    const tokenAddress = token.isLendingToken
      ? token.unwrappedAddress ?? ''
      : token.address

    if (
      config.nativeCurrency.wrapAddress &&
      address(config.nativeCurrency.wrapAddress) === address(token.address)
    ) {
      continue
    }

    const amount = BigDecimal.from(
      token.amount ?? BigNumber.from(0),
      token.decimals,
    )

    const tokenContract = connectTokenContractToAddress?.(tokenAddress)
    if (!tokenContract) throw Error('Token contract not found')

    const allowance = yield* call(
      tokenContract.allowance,
      userAddress,
      vault.address,
    )

    if (amount.gt(BigDecimal.from(allowance, token.decimals))) {
      tokensToApprove.push(address(tokenAddress))
      amountsToApprove.push(amount)
      operations.push(
        createApproveOperation(token.displayName, amount.toString()),
      )
    }
  }

  const amountsIn = depositTokens.map((token) =>
    BigDecimal.from(token.amount ?? BigNumber.from(0), token.decimals),
  )

  operations.push(
    createDepositToPoolOperation(
      depositTokens,
      amountsIn,
      getPoolFullName(pool),
      stakeToBackstop,
    ),
  )

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Deposit,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    shouldApproveRelayer,
    transactionId: transactionId,
    tokensAddresses: tokensToApprove,
    amounts: amountsToApprove,
    operationIds: operations.map((operation) => operation.id),
  }
}
