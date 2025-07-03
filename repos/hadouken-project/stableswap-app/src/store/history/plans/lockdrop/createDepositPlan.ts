import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

import { getChainConfig } from '@config'
import { Network } from '@constants/Networks'
import { address } from '@dataSource/graph/utils/formatters'
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
  createDepositToPoolOperation,
} from '@store/history/history.utils'
import { networkSelectors } from '@store/network/network.selector'
import { BigDecimal } from '@utils/math'

export function* createDepositLockdropPlan(
  lockdropAddress: string,
  userAddress: string,
  depositTokens: IDepositToken[],
  depositTokensAmount: Record<string, BigDecimal | undefined> | undefined,
): Generator<
  StrictEffect,
  {
    transactionId: string
    tokensToApprove: string[]
    amountsToApprove: BigDecimal[]
    operationIds: string[]
  }
> {
  const chainId = yield* select(networkSelectors.applicationChainId)

  const poolName =
    chainId === Network.GodwokenMainnet || chainId === Network.GodwokenTestnet
      ? 'HDK-CKB Pool'
      : 'HDK-ETH Pool'

  const operations: IContractOperation[] = []

  const connectTokenContractToAddress = yield* select(
    contractsSelectors.tokenConnector,
  )

  const tokensToApprove: string[] = []
  const amountsToApprove: BigDecimal[] = []

  const config = getChainConfig(chainId)

  for (const token of depositTokens) {
    if (
      config.nativeCurrency.wrapAddress &&
      address(config.nativeCurrency.wrapAddress) === address(token.address)
    ) {
      continue
    }

    const tokenContract = connectTokenContractToAddress?.(token.address)
    if (!tokenContract) throw Error('Token contract not found')

    const amount =
      depositTokensAmount?.[address(token.address)] ?? BigDecimal.from(0)

    const allowance = yield* call(
      tokenContract.allowance,
      userAddress,
      lockdropAddress,
    )

    if (amount.gt(BigDecimal.from(allowance, token.decimals))) {
      tokensToApprove.push(address(token.address))
      amountsToApprove.push(amount)
      operations.push(
        createApproveOperation(
          token.displayName ?? token.symbol,
          amount.toString(),
        ),
      )
    }
  }

  const amountsIn = depositTokens.map(
    (token) =>
      depositTokensAmount?.[address(token.address)] ?? BigDecimal.from(0),
  )

  operations.push(
    createDepositToPoolOperation(depositTokens, amountsIn, poolName, false),
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
    transactionId: transactionId,
    tokensToApprove,
    amountsToApprove,
    operationIds: operations.map((operation) => operation.id),
  }
}
