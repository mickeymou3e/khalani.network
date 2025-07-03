import { StrictEffect } from 'redux-saga/effects'
import { select } from 'typed-redux-saga'

import { chainsSelectors } from '@store/chains/chains.selector'
import { networkSelectors } from '@store/network/network.selector'

export function* checkExpectedNetwork(): Generator<StrictEffect, boolean> {
  try {
    const isExpectedNetwork = yield* select(networkSelectors.isExpectedNetwork)

    return isExpectedNetwork
  } catch {
    return false
  }
}

export function* checkSupportedNetwork(): Generator<
  StrictEffect,
  boolean | null
> {
  try {
    const supportedNetworks = yield* select(chainsSelectors.chainsIds)
    const currentNetwork = yield* select(networkSelectors.network)

    return currentNetwork ? supportedNetworks.includes(currentNetwork) : null
  } catch {
    return false
  }
}

export function* checkReloadedNetwork(): Generator<
  StrictEffect,
  boolean | null
> {
  try {
    const isReloadedNetwork = yield* select(networkSelectors.isReloaded)

    return isReloadedNetwork
  } catch {
    return false
  }
}
