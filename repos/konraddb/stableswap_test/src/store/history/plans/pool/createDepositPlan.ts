import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'
import { v4 as uuid } from 'uuid'

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
  createBlockConfirmation,
  createDepositToPoolOperation,
} from '@store/history/history.utils'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

export function* createDepositPlan(
  poolId: string,
  tokensInAddresses: IToken['address'][],
  amountsIn: BigDecimal[],
): Generator<
  StrictEffect,
  {
    transactionId: string
    tokensAddresses: IToken['address'][]
    amounts: BigDecimal[]
  }
> {
  const operations: IContractOperation[] = []
  const selectPoolById = yield* select(poolSelectors.selectById)
  const selectManyTokens = yield* select(tokenSelectors.selectMany)
  const connectTokenContractToAddress = yield* select(
    contractsSelectors.tokenConnector,
  )
  const vault = yield* select(contractsSelectors.vault)
  if (!vault) throw Error('vault not found')

  const userAddress = yield* select(walletSelectors.godwokenShortAddress)
  if (!userAddress) throw Error('userAddress  not found')
  const tokens = yield* call(selectManyTokens, tokensInAddresses)

  const pool = yield* call(selectPoolById, poolId)
  if (!pool) throw Error('pool not found')

  const tokensToApprove: IToken[] = []
  const amountsToApprove: BigDecimal[] = []

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    const amount = amountsIn[index]

    const tokenContract = connectTokenContractToAddress?.(token.address)
    if (!tokenContract) throw Error('Token contract not found')

    const allowance = yield* call(
      tokenContract.allowance,
      userAddress,
      vault.address,
    )

    if (amount.gt(BigDecimal.from(allowance, token.decimals))) {
      tokensToApprove.push(token)
      amountsToApprove.push(amount)
      operations.push(
        createApproveOperation(token.symbol, amount.toString(), pool.name),
      )
    }
  }

  operations.push(
    createDepositToPoolOperation(tokensToApprove, amountsToApprove, pool.name),
  )
  operations.push(createBlockConfirmation())

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
    tokensAddresses: tokensToApprove.map(({ address }) => address),
    amounts: amountsToApprove,
  }
}
