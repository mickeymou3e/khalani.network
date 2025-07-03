import { StrictEffect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { getConnectedAccount } from '../../wallet.utils'

export function* checkAccountConnected(): Generator<StrictEffect, boolean> {
  try {
    const connectedAccount = yield* call(getConnectedAccount)

    if (connectedAccount) {
      return true
    } else {
      return false
    }
  } catch {
    return false
  }
}
