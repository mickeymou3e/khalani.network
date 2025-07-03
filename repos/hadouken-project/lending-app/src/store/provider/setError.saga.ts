import { StrictEffect } from 'redux-saga/effects'
import { put } from 'typed-redux-saga'

import { getErrorMessageFromContracts } from '@utils/errors'

import { providerActions } from '../provider/provider.slice'

export function* setContractError(error: {
  message: string
}): Generator<StrictEffect> {
  const revertMsg = error?.message?.split("reverted with reason string '")
  const revertCode = revertMsg[1]?.split("'")
  if (revertMsg && revertCode && revertCode?.length >= 2) {
    const errorCode = Number(revertCode[0])
    const errorMessage = getErrorMessageFromContracts(errorCode)

    yield* put(providerActions.setError(errorMessage))
  }
}
