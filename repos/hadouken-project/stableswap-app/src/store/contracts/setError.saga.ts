import { StrictEffect } from 'redux-saga/effects'
import { put } from 'typed-redux-saga'

import { getBalancerError } from '@utils/errors'
import { getLendingError } from '@utils/errors/lending-errors'

import { contractsActions } from './contracts.slice'

export function* setContractError(error: {
  message?: string
}): Generator<StrictEffect> {
  if (error && error.message) {
    const balancerError = getBalancerError(error.message)
    const lendingError = getLendingError(error.message)

    if (balancerError) {
      yield* put(contractsActions.setError(balancerError))
    } else if (lendingError) {
      yield* put(contractsActions.setError(lendingError))
    }
  }
}
