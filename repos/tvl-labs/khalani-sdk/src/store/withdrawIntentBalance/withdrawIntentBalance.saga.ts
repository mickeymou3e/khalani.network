import { providerSelector } from '@store/provider/provider.selector'
import { call, put, select } from 'typed-redux-saga'
import { logger } from '@utils/logger'
import { withdrawIntentBalanceActions } from './withdrawIntentBalance.slice'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { WithdrawIntentBalanceParams } from './withdrawIntentBalance.types'
import { cancelIntent } from '@services/medusa/cancel.service'
import { CancelIntentPayload } from '@services/bcs/bcs'
import { fromHex } from '@mysten/bcs'
import { toU256Bytes } from '@services/bcs/utils'
import { ethers } from 'ethers'

/**
 * Saga to withdraw intent balance by cancelling the intent via BCS + RPC
 */
export function* withdrawIntentBalanceSaga(
  action: PayloadAction<WithdrawIntentBalanceParams>,
): Generator {
  try {
    const { intentId } = action.payload
    const signer = yield* select(providerSelector.signer)
    if (!signer) throw new Error('Signer not connected')

    const networkHex = yield* select(providerSelector.network)
    if (!networkHex) throw new Error('Network not connected')
    const chain_id = parseInt(networkHex, 16)

    // random nonce as in pure SDK
    const nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

    // BCS payload exactly as in reference
    const cleanHexId = intentId.startsWith('0x') ? intentId.slice(2) : intentId
    const intentIdBytes = Array.from(fromHex(cleanHexId))

    const bcsPayload = CancelIntentPayload.serialize({
      chain_id,
      intent_id: intentIdBytes,
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

    yield* put(withdrawIntentBalanceActions.signed())

    const txHash: string = yield* call(() =>
      cancelIntent(intentId, chain_id, nonce, sig),
    )
    yield* put(withdrawIntentBalanceActions.withdrawIntentBalanceSuccess())
  } catch (error) {
    yield* put(
      withdrawIntentBalanceActions.withdrawIntentBalanceFailure(
        error as string,
      ),
    )
    logger.error(error)
  }
}
