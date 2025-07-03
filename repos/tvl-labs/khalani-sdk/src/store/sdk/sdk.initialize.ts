import { StrictEffect } from 'redux-saga/effects'
import { put } from 'typed-redux-saga'
import { sdkActions } from './sdk.slice'
import { ProviderSliceState } from '@store/provider/provider.types';
import { providerActions } from '@store/provider/provider.slice';
import { logger } from '@utils/logger';

export function* initializeSDK(
  providerState: ProviderSliceState
): Generator<StrictEffect, void> {
  yield* put(sdkActions.initializeSDKRequest())
  try {
    yield* put(providerActions.update(providerState))
    yield* put(sdkActions.initializeSDKSuccess())
  } catch (error) {
    logger.error(error)
    yield* put(sdkActions.initializeSDKFailure())
  }
}
