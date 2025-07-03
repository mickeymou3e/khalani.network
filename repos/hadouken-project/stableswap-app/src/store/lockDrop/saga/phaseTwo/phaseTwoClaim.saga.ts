import { select, call } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { contractsSelectors } from '@store/contracts/contracts.selectors'

export function* phaseTwoClaim(lockIds: number[]): Generator {
  const lockdropContract = yield* select(contractsSelectors.lockDropConnector)

  if (!lockdropContract) throw new Error('Lockdrop contract not found')

  const claimTransaction = yield* call(
    lockdropContract.multiClaimHDKTokens,
    lockIds,
  )

  const transactionResult = yield* call(claimTransaction.wait, CONFIRMATIONS)

  return transactionResult
}
