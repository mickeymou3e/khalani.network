/* Godwoken V1 TEMP Stub */
import { StrictEffect } from 'redux-saga/effects'
import { call, put } from 'typed-redux-saga'

import { updateLatestBlock } from '@store/network/saga/updateLatestBlock.saga'
import { updateNetwork } from '@store/network/saga/updateNetwork.saga'

import { networkActions } from '../network.slice'

export function* initNetworkSaga(): Generator<StrictEffect, boolean> {
  try {
    yield* call(updateNetwork)
    yield* call(updateLatestBlock)

    yield* put(networkActions.initializeNetworkSuccess())
  } catch (error) {
    console.error(error)
    yield* put(networkActions.initializeNetworkFailure())
    return false
  }

  return true
}
