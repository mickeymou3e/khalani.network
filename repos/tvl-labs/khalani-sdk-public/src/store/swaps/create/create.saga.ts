import { StrictEffect } from 'redux-saga/effects'
import { call, select, put, apply } from 'typed-redux-saga'
import { providerSelector } from '@store/provider/provider.selector'
import { createIntentActions } from './create.slice'
import { handleProviderError } from '@utils/error'
import { UIIntentParams, Intent } from './create.types'
import { signPermit2MessageSaga } from '@dataSource/permit/signPermit2Message.saga'
import { signSwapIntentSaga } from '@dataSource/signature/signSwapIntent.saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { createIntentDeadline, createIntentNonce } from '@intents/intent.utils'
import { buildOutcome } from '@services/outcome/outcome.service'
import { findMToken, findSpokeToken } from '@utils/token'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { placeIntentRequest } from '@services/medusa/place.service'
import { mapMedusaIntent } from './create.mappers'
import { depositSaga } from '../deposit/deposit.saga'
import { waitForMinting } from '@services/mTokens/waitForMinting'

export function* swapIntentSaga(
  action: PayloadAction<Intent & { destChain: number }>,
  customProxyUrl?: string,
): Generator<StrictEffect, Intent | undefined> {
  try {
    const params = mapMedusaIntent(action.payload)
    const { srcMToken, srcAmount, nonce, ttl, outcome } = params

    const signer = yield* select(providerSelector.signer)
    const userAddress = yield* select(providerSelector.userAddress)
    if (!signer || !userAddress) {
      throw new Error('Wallet is not connected')
    }

    const network = yield* select(providerSelector.network)
    if (!network) {
      throw new Error('Network not defined')
    }

    const selectToken = yield* select(tokenSelectors.selectByAddress)
    const mTokenDetails = selectToken(srcMToken)
    const srcSpokeToken = findSpokeToken(
      mTokenDetails?.symbol ?? '',
      mTokenDetails?.sourceChainId ?? '',
    )
    if (!srcSpokeToken) {
      throw new Error('Source spoke token is undefined')
    }

    const permit2Signature = yield* call(
      signPermit2MessageSaga,
      srcSpokeToken.address,
      srcAmount,
      nonce,
      ttl,
    )
    if (!permit2Signature) throw new Error('Permit2 signature is undefined')

    const result = {
      author: userAddress,
      ttl,
      nonce,
      srcMToken,
      srcAmount,
      outcome,
    }

    const signature = yield* call(signSwapIntentSaga, result)
    if (!signature) throw new Error('Swap intent signature is undefined')
    const transaction = yield* call(
      depositSaga,
      srcSpokeToken.address,
      srcAmount,
      nonce,
      ttl,
      permit2Signature,
    )

    if (!transaction) {
      throw new Error('Deposit request failed')
    }
    yield* put(createIntentActions.signed())
    yield* apply(transaction, transaction.wait, [])

    console.log('Publish intent payload', result)

    yield* call(
      waitForMinting,
      {
        symbol: srcSpokeToken?.symbol ?? '',
        chainId: srcSpokeToken?.chainId ?? '',
      },
      srcAmount,
      userAddress,
      async () => {
        await placeIntentRequest(
          {
            intent: result,
            signature,
          },
          customProxyUrl,
        )
      },
    )

    yield* put(createIntentActions.requestSuccess(result))
    return result
  } catch (error) {
    yield* put(createIntentActions.requestError(error as any))
    handleProviderError(error)
  }
}

export function* provideLiquiditySaga(
  action: PayloadAction<UIIntentParams>,
  customProxyUrl?: string,
): Generator<StrictEffect, Intent | undefined> {
  try {
    const params = action.payload
    const { srcAmount, srcToken, destChains } = params

    if (!destChains) {
      throw new Error('Destination chains not defined')
    }

    const network = yield* select(providerSelector.network)

    if (!network) {
      throw new Error('Network not defined')
    }

    const selectToken = yield* select(tokenSelectors.selectByAddressAndNetwork)
    const srcTokenDetails = selectToken(srcToken, network)
    const srcMToken = findMToken(
      srcTokenDetails?.symbol ?? '',
      srcTokenDetails?.chainId ?? '',
    )?.address
    if (!srcMToken) {
      throw new Error('Source mToken is undefined')
    }

    const mTokens = destChains?.map((chain) => {
      return (
        findMToken(srcTokenDetails?.symbol ?? '', `0x${chain.toString(16)}`)
          ?.address ?? ''
      )
    })
    if (!mTokens) {
      throw new Error('Destination mTokens not found')
    }

    const nonce = createIntentNonce()
    const ttl = createIntentDeadline()
    const outcome = buildOutcome(params, mTokens)
    if (!params || !nonce || !ttl || !outcome) {
      throw new Error('Params object, nonce, ttl or outcome is empty')
    }
    const signer = yield* select(providerSelector.signer)
    const userAddress = yield* select(providerSelector.userAddress)
    if (!signer || !userAddress) {
      throw new Error('Wallet is not connected')
    }

    const permit2Signature = yield* call(
      signPermit2MessageSaga,
      srcToken,
      srcAmount,
      nonce,
      ttl,
    )
    if (!permit2Signature) throw new Error('Permit2 signature is undefined')

    const result = {
      author: userAddress,
      ttl,
      nonce,
      srcMToken,
      srcAmount,
      outcome,
    }

    const signature = yield* call(signSwapIntentSaga, result)
    if (!signature) throw new Error('Swap intent signature is undefined')
    const transaction = yield* call(
      depositSaga,
      srcToken,
      srcAmount,
      nonce,
      ttl,
      permit2Signature,
    )
    if (!transaction) {
      throw new Error('Deposit request failed')
    }
    yield* put(createIntentActions.signed())
    yield* apply(transaction, transaction.wait, [])

    yield* call(
      waitForMinting,
      {
        symbol: srcTokenDetails?.symbol ?? '',
        chainId: srcTokenDetails?.chainId ?? '',
      },
      srcAmount,
      userAddress,
      async () => {
        await placeIntentRequest(
          {
            intent: result,
            signature,
          },
          customProxyUrl,
        )
      },
    )

    yield* put(createIntentActions.requestSuccess(result))
    return result
  } catch (error) {
    yield* put(createIntentActions.requestError(error as any))
    handleProviderError(error)
  }
}
