import { StrictEffect } from 'redux-saga/effects'
import { call, select, put, apply } from 'typed-redux-saga'
import { providerSelector } from '@store/provider/provider.selector'
import { depositActions } from './deposit.slice'
import { handleProviderError } from '@utils/error'
import { DepositParams } from './deposit.types'
import { signPermit2MessageSaga } from '@dataSource/permit/signPermit2Message.saga'
import { PayloadAction } from '@reduxjs/toolkit'
import {
  createPermit2Deadline,
  createPermit2Nonce,
} from '@intents/intent.utils'
import { depositSaga } from '@store/swaps/deposit/deposit.saga'

export function* depositTokensSaga(
  action: PayloadAction<DepositParams>,
): Generator<StrictEffect, void> {
  try {
    const params = action.payload
    const { srcAddress, srcAmount } = params

    const signer = yield* select(providerSelector.signer)
    const userAddress = yield* select(providerSelector.userAddress)
    if (!signer || !userAddress) {
      throw new Error('Wallet is not connected')
    }

    const network = yield* select(providerSelector.network)
    if (!network) {
      throw new Error('Network not defined')
    }

    const nonce = yield* call(createPermit2Nonce)
    const ttl = yield* call(createPermit2Deadline)

    const permit2Signature = yield* call(
      signPermit2MessageSaga,
      srcAddress,
      srcAmount,
      nonce,
      ttl,
    )
    if (!permit2Signature) throw new Error('Permit2 signature is undefined')

    const transaction = yield* call(
      depositSaga,
      srcAddress,
      srcAmount,
      nonce,
      ttl,
      permit2Signature,
    )

    if (!transaction) {
      throw new Error('Deposit request failed')
    }
    yield* apply(transaction, transaction.wait, [])

    yield* put(depositActions.requestSuccess())
  } catch (error) {
    yield* put(depositActions.requestError(error as any))
    handleProviderError(error)
  }
}
