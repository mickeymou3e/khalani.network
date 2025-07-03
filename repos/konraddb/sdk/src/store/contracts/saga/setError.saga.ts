import { StrictEffect } from 'redux-saga/effects'
import { put } from 'typed-redux-saga'

import { contractsActions } from '../contracts.slice'

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

const getContractErrorMessage = (value: number): string => {
  switch (value) {
    case 304:
      return 'Amounts swapped may not be larger than 30% of total balance.'
    default:
      return 'Unknown contracts occurred'
  }
}
