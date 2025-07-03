import { providerSelector } from '@store/provider/provider.selector'
import { call, put, select } from 'typed-redux-saga'
import { logger } from '@utils/logger'
import { withdrawMTokenActions } from './withdrawMToken.slice'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { WithdrawMTokenParams } from './withdrawMToken.types'
import { withdrawMTokens } from '@services/medusa'
import { WithdrawMtokensPayload } from '@services/bcs/bcs'
import { toU256Bytes, addressToBytes } from '@services/bcs/utils'
import { ethers } from 'ethers'

/**
 * Worker saga: handles withdraw of MTokens via BCS signing + JSON-RPC, using random nonce
 */
export function* withdrawMTokenSaga(
  action: PayloadAction<WithdrawMTokenParams>,
): Generator {
  try {
    const { mToken, amount } = action.payload
    const userAddress = yield* select(providerSelector.userAddress)
    if (!userAddress) throw new Error('Wallet not connected')

    const signer = yield* select(providerSelector.signer)
    if (!signer) throw new Error('Signer not available')

    const networkHex = yield* select(providerSelector.network)
    if (!networkHex) throw new Error('Network not connected')
    const chain_id = parseInt(networkHex, 16)

    // match pure SDK: generate random nonce
    const nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

    // build BCS payload exactly as in reference
    const bcsPayload = WithdrawMtokensPayload.serialize({
      chain_id,
      address: addressToBytes(userAddress),
      mtoken: addressToBytes(mToken),
      amount: toU256Bytes(amount),
      nonce: toU256Bytes(nonce),
    })

    // sign BCS bytes directly
    const signature = yield* call(() =>
      signer.signMessage(bcsPayload.toBytes()),
    )
    if (!signature) throw new Error('Failed to sign message')

    const splitSignature = ethers.utils.splitSignature(signature)
    const sig = {
      r: splitSignature.r,
      s: splitSignature.s,
      yParity: splitSignature.v - 27,
    }

    yield* put(withdrawMTokenActions.signed())

    // submit RPC via fetch as pure SDK does
    const txHash = yield* call(() =>
      withdrawMTokens(mToken, userAddress, amount, chain_id, nonce, sig),
    )
    yield* put(withdrawMTokenActions.withdrawMTokenSuccess())
  } catch (err) {
    yield* put(withdrawMTokenActions.withdrawMTokenFailure(err as string))
    logger.error(err)
  }
}
