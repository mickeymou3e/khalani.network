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
  createWithdrawFromPoolOperation,
} from '@store/history/history.utils'
// import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

export function* createWithdrawPlan(
  inTokenAddress: IToken['address'],
  inAmount: BigDecimal,
  outTokensAddresses: IToken['address'][],
  outTokensAmounts: BigDecimal[],
): Generator<
  StrictEffect,
  {
    transactionId: string
    tokensAddresses: IToken['address'][]
    amounts: BigDecimal[]
  }
> {
  const connectTokenContractToAddress = yield* select(
    contractsSelectors.tokenConnector,
  )
  // const selectPoolById = yield* select(poolSelectors.selectById)
  const selectManyTokensById = yield* select(tokenSelectors.selectMany)
  const selectTokenById = yield* select(tokenSelectors.selectById)

  const outTokens = yield* call(selectManyTokensById, outTokensAddresses)
  // const pool = yield* call(selectPoolById, poolId)

  const inToken = yield* call(selectTokenById, inTokenAddress)

  if (!inToken) throw Error('In token not found')

  const poolTokenContract = connectTokenContractToAddress?.(inToken.address)

  if (!poolTokenContract) throw Error('Pool token contract not found')

  const userAddress = yield* select(walletSelectors.godwokenShortAddress)

  if (!userAddress) throw Error('userAddress not found')

  const vault = yield* select(contractsSelectors.vault)
  if (!vault) throw Error('vault not found')

  const poolAllowance = yield* call(
    poolTokenContract.allowance,
    userAddress,
    vault.address,
  )

  const operations: IContractOperation[] = []

  const tokensAddressesToApprove: IToken['address'][] = []
  const amountsToApprove: BigDecimal[] = []

  if (BigDecimal.from(poolAllowance, inToken.decimals).lt(inAmount)) {
    tokensAddressesToApprove.push(inToken.address)
    amountsToApprove.push(inAmount)

    operations.push(
      createApproveOperation(inToken.symbol, inAmount.toString(), inToken.name),
    )
  }

  operations.push(
    createWithdrawFromPoolOperation(
      inToken,
      inAmount,
      outTokens,
      outTokensAmounts,
    ),
  )

  operations.push(createBlockConfirmation())

  const transactionId = uuid()

  yield* put(
    historyActions.addTransaction({
      id: transactionId,
      type: TransactionType.Withdraw,
      operations: operations,
      status: TransactionStatus.Pending,
    }),
  )

  return {
    transactionId: transactionId,
    tokensAddresses: tokensAddressesToApprove,
    amounts: amountsToApprove,
  }
}
