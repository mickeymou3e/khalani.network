import { Confirmations } from '../../constants/TxParams'
import { ContractTransaction } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { apply, select } from 'typed-redux-saga'

import { contractsSelectors } from '../contracts/contracts.selectors'

import { IMintRequest } from './mint.types'

export function* mintRequestSaga(
  payload: IMintRequest,
): Generator<StrictEffect, ContractTransaction> {
  try {
    const psmContract = yield* select(contractsSelectors.psm)

    if (!psmContract) {
      throw new Error(`psmContract can't be initialized.`)
    }

    const mintTransaction = (yield* apply(psmContract, psmContract.mintKai, [
      payload.tokenIn,
      payload.amount,
    ])) as ContractTransaction

    const transactionReceipt = yield* apply(
      mintTransaction,
      mintTransaction.wait,
      [Confirmations],
    )

    if (transactionReceipt.status !== 1) {
      throw new Error(
        `Transaction has probably failed. Status is different than 1`,
      )
    }

    return mintTransaction
  } catch (error) {
    console.error(error)
    throw new Error('Mint transaction has failed')
  }
}
