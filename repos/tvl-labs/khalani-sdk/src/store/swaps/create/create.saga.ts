import { StrictEffect } from 'redux-saga/effects'
import { call, select, put, apply } from 'typed-redux-saga'
import { providerSelector } from '@store/provider/provider.selector'
import { createIntentActions } from './create.slice'
import { handleProviderError } from '@utils/error'
import { UIIntentParams, Intent, CreateIntentResult } from './create.types'
import { signPermit2MessageSaga } from '@dataSource/permit/signPermit2Message.saga'
import { signSwapIntentSaga } from '@dataSource/signature/signSwapIntent.saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { createIntentDeadline, createPermit2Nonce } from '@intents/intent.utils'
import { buildOutcome } from '@services/outcome/outcome.service'
import { findMToken, findSpokeToken } from '@utils/token'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { mapMedusaIntent, mapToRefinementObj } from './create.mappers'
import { depositSaga } from '../deposit/deposit.saga'
import { mapToTargetFormat } from '@services/medusa/utils'
import { monitorMinting } from '@services/deposit'
import { khalaniContractsSelectors } from '@store/contracts/khalani.contracts.selectors'

export function* swapIntentSaga(
  action: PayloadAction<Intent & { destChain: number }>,
): Generator<StrictEffect, CreateIntentResult | undefined> {
  try {
    const params = mapMedusaIntent(action.payload)
    const { srcMToken, srcAmount, ttl, outcome } = params

    const permit2Nonce = createPermit2Nonce()

    const signer = yield* select(providerSelector.signer)
    const userAddress = yield* select(providerSelector.userAddress)
    if (!signer || !userAddress) {
      throw new Error('Wallet is not connected')
    }

    const network = yield* select(providerSelector.network)
    if (!network) {
      throw new Error('Network not defined')
    }

    const intentBook = yield* select(khalaniContractsSelectors.intentBook)
    if (!intentBook) {
      throw new Error('Intent book is undefined')
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
      permit2Nonce,
      ttl,
    )
    if (!permit2Signature) throw new Error('Permit2 signature is undefined')

    const intentNonce = yield* call(intentBook.getNonce, userAddress)
    if (intentNonce === undefined || intentNonce === null)
      throw new Error('Intent nonce is undefined')

    const intentPayload = {
      author: userAddress,
      ttl,
      nonce: intentNonce + 1n,
      srcMToken,
      srcAmount,
      outcome,
    }

    const signature = yield* call(signSwapIntentSaga, intentPayload)
    if (!signature) throw new Error('Swap intent signature is undefined')
    const transaction = yield* call(
      depositSaga,
      srcSpokeToken.address,
      srcAmount,
      permit2Nonce,
      ttl,
      permit2Signature,
    )

    if (!transaction) {
      throw new Error('Deposit request failed')
    }
    yield* put(createIntentActions.signed())
    yield* apply(transaction, transaction.wait, [])

    console.log('Publish intent payload', intentPayload)

    const medusaIntent = mapToTargetFormat(intentPayload)

    if (!srcSpokeToken) {
      throw new Error('Source spoke token is undefined')
    }

    const refinementIntent = mapToRefinementObj(medusaIntent)

    const depositData = {
      userAddress,
      expectedBalance: srcAmount.toString(),
      tokenAddress: srcSpokeToken.address,
      chainId: Number(srcSpokeToken.chainId),
      intent: refinementIntent,
      intentSignature: signature,
      depositTx: transaction.hash,
    }

    const monitorMintingPayload = yield* call(monitorMinting, depositData)

    const result = {
      intent: intentPayload,
      signature,
      depositId: monitorMintingPayload.depositId,
    }
    yield* put(createIntentActions.requestSuccess(result))

    return result
  } catch (error) {
    yield* put(createIntentActions.requestError(error as any))
    handleProviderError(error)
  }
}

export function* provideLiquiditySaga(
  action: PayloadAction<UIIntentParams>,
): Generator<StrictEffect, CreateIntentResult | undefined> {
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
    const intentBook = yield* select(khalaniContractsSelectors.intentBook)
    if (!intentBook) {
      throw new Error('Intent book is undefined')
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

    const permit2Nonce = createPermit2Nonce()
    const ttl = createIntentDeadline()
    const outcome = buildOutcome(params, mTokens)
    if (!params || !permit2Nonce || !ttl || !outcome) {
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
      permit2Nonce,
      ttl,
    )
    if (!permit2Signature) throw new Error('Permit2 signature is undefined')

    const intentNonce = yield* call(intentBook.getNonce, userAddress)
    if (intentNonce === undefined || intentNonce === null)
      throw new Error('Intent nonce is undefined')
    const intentPayload = {
      author: userAddress,
      ttl,
      nonce: intentNonce + 1n,
      srcMToken,
      srcAmount,
      outcome,
    }

    const signature = yield* call(signSwapIntentSaga, intentPayload)
    if (!signature) throw new Error('Swap intent signature is undefined')
    const transaction = yield* call(
      depositSaga,
      srcToken,
      srcAmount,
      permit2Nonce,
      ttl,
      permit2Signature,
    )
    if (!transaction) {
      throw new Error('Deposit request failed')
    }
    yield* put(createIntentActions.signed())
    yield* apply(transaction, transaction.wait, [])

    const medusaIntent = mapToTargetFormat(intentPayload)

    if (!srcTokenDetails) {
      throw new Error('Source token details are undefined')
    }

    const refinementIntent = mapToRefinementObj(medusaIntent)

    const depositData = {
      userAddress,
      expectedBalance: srcAmount.toString(),
      tokenAddress: srcTokenDetails.address,
      chainId: Number(srcTokenDetails.chainId),
      intent: refinementIntent,
      intentSignature: signature,
      depositTx: transaction.hash,
    }

    yield* call(monitorMinting, depositData)

    const result = {
      intent: intentPayload,
      signature,
      depositId: transaction.hash,
    }

    yield* put(createIntentActions.requestSuccess(result))
    return result
  } catch (error) {
    yield* put(createIntentActions.requestError(error as any))
    handleProviderError(error)
  }
}
