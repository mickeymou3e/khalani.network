import { StrictEffect } from 'redux-saga/effects'
import { put } from 'typed-redux-saga'

import { getContractErrorMessage } from '@utils/errors'

import { contractsActions } from './contracts.slice'

export function* setContractError(error: {
  message: string
}): Generator<StrictEffect> {
  const revertMsg = error?.message?.split('BAL#')
  const revertCode = revertMsg[1]?.split("'")
  if (revertMsg && revertCode && revertCode?.length >= 2) {
    const errorCode = Number(revertCode[0])
    const errorMessage = getContractErrorMessage(errorCode)

    yield* put(contractsActions.setError(errorMessage))
  }
}
