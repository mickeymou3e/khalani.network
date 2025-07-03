import { BigNumber, ContractTransaction } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { contractsSelectors } from '@store/contracts/contracts.selectors'

export function* mintTokenAction(
  tokenAddress: string,
  amount: BigNumber,
  recipient: string,
): Generator<StrictEffect, ContractTransaction | null> {
  const lendingContracts = yield* select(contractsSelectors.lendingContracts)

  const token = lendingContracts?.mintToken(tokenAddress)

  if (token) {
    const transaction = yield* call(token.mint, recipient, amount)

    yield* call(transaction.wait, CONFIRMATIONS)

    return transaction
  }

  return null
}
