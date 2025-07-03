import { StrictEffect, call, put } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { logger } from '@utils/logger'
import { createRefineActions } from './create.slice'
import { createRefinementRequest } from '@services/index'
import { CreateRefineSagaParams, CreateRefineResult } from './create.types'
import { buildOutcome } from '@services/outcome/outcome.service'
import { createIntentDeadline, createIntentNonce } from '@intents/intent.utils'
import { findMToken } from '@utils/token'
import { select } from 'typed-redux-saga'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { providerSelector } from '@store/provider/provider.selector'
import { Network } from '@constants/Networks'

export function* createRefineSaga(
  action: PayloadAction<CreateRefineSagaParams>,
  customProxyUrl?: string,
): Generator<StrictEffect, CreateRefineResult | void> {
  try {
    const params = action.payload
    const { srcAmount, srcToken, selectedChain, destTokens, destChains } =
      params

    const selectTokenByNetwork = yield* select(
      tokenSelectors.selectByAddressAndNetwork,
    )

    if (!selectedChain) {
      throw new Error('Selected chain is undefined')
    }

    const srcTokenDetails = selectTokenByNetwork(srcToken, selectedChain)
    const srcMToken = findMToken(
      srcTokenDetails?.symbol ?? '',
      srcTokenDetails?.chainId ?? '',
    )?.address
    if (!srcMToken) {
      throw new Error('Source mToken is undefined')
    }

    const mTokens = destTokens?.map((token, index) => {
      const destChain = `0x${destChains?.[index].toString(16)}` as Network
      if (!destChain) return ''
      const tokenDetails = selectTokenByNetwork(token, destChain)
      return (
        findMToken(tokenDetails?.symbol ?? '', tokenDetails?.chainId ?? '')
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
    const author = yield* select(providerSelector.userAddress)

    if (!author) {
      throw new Error('Author is null')
    }

    const result = {
      author,
      ttl,
      nonce,
      srcMToken,
      srcAmount,
      outcome,
    }

    const response = (yield call(
      createRefinementRequest,
      result,
      customProxyUrl,
    )) as CreateRefineResult
    yield put(createRefineActions.requestSuccess(response))

    return response
  } catch (error) {
    yield put(createRefineActions.requestError((error as Error).toString()))
    logger.error(error)
  }
}
