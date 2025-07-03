import { StrictEffect } from 'redux-saga/effects'
import { select } from 'typed-redux-saga'

import { networkSelectors } from '@store/network/network.selector'

export function* checkExpectedNetwork(): Generator<StrictEffect, boolean> {
  try {
    const isExpectedNetwork = yield* select(networkSelectors.isExpectedNetwork)

    return isExpectedNetwork
  } catch {
    return false
  }
}
