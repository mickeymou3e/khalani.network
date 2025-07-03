import { initializeProvider } from '../provider/provider.initialize'
import { StrictEffect } from 'redux-saga/effects'
import { call, put } from 'typed-redux-saga'
import { sdkActions } from './sdk.slice'
import { providers } from 'ethers'

export function* initializeSDK(
  provider: providers.Web3Provider,
): Generator<StrictEffect, void> {
  yield* put(sdkActions.initializeSDKRequest())
  try {
    yield* call(initializeProvider, provider)
    yield* put(sdkActions.initializeSDKSuccess())
  } catch (error) {
    console.error(error)
    yield* put(sdkActions.initializeSDKFailure())
  }
}
