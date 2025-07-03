import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { ContractTransaction } from '@ethersproject/contracts'
import { ERC20 } from '@hadouken-project/typechain'
import { messages } from '@store/history/history.messages'
import { historySelector } from '@store/history/history.selector'
import { historyActions } from '@store/history/history.slice'
import { IContractOperation, OperationType } from '@store/history/history.types'
import { BigDecimal } from '@utils/math'

const changeApproveOperation = (
  operations: IContractOperation[],
  approveOperationNumber: number,
  symbol: string,
  fixedAmount: string,
) => {
  const newOperations = [...operations]

  const approveOperationId = newOperations.filter(
    (operation) => operation.type === OperationType.Approve,
  )[approveOperationNumber]?.id

  const approveOperationIdx = newOperations.findIndex(
    (operation) => operation.id === approveOperationId,
  )

  newOperations[approveOperationIdx] = {
    ...newOperations[approveOperationIdx],
    description: messages.APPROVE_TOKEN_DESCRIPTION(symbol, fixedAmount),
  }

  return newOperations
}

export function* approveToken(
  token: ERC20,
  to: string,
  amount: BigDecimal,
  approveOperationNumber: number,
): Generator<StrictEffect, ContractTransaction> {
  const result = yield* call(token.approve, to, amount.toBigNumber())

  const decimals = yield* call(token.decimals)
  const symbol = yield* call(token.symbol)

  const parsedData = token.interface.parseTransaction({ data: result.data })
  const fixedAmount = formatUnits(BigNumber.from(parsedData.args[1]), decimals)

  const userApprovalAmountChange = Number(fixedAmount) !== amount.toNumber()

  if (userApprovalAmountChange) {
    const lastTransaction = yield* select(
      historySelector.currentPendingTransaction,
    )

    if (lastTransaction) {
      const newOperations = changeApproveOperation(
        lastTransaction.operations,
        approveOperationNumber,
        symbol,
        fixedAmount,
      )

      yield* put(
        historyActions.updateTransactionOperations({
          id: lastTransaction.id,
          operations: newOperations,
        }),
      )
    }
  }

  yield* call(result.wait, CONFIRMATIONS)
  return result
}
