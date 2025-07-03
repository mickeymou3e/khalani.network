import { select, call } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { contractsSelectors } from '@store/contracts/contracts.selectors'

export function* phaseThreeUnlock(lockId: number): Generator {
  const lockdropContract = yield* select(contractsSelectors.lockDropConnector)

  if (!lockdropContract) throw new Error('Lockdrop contract not found')

  const unlockTransaction = yield* call(lockdropContract.unlock, lockId)

  const transactionResult = yield* call(unlockTransaction.wait, CONFIRMATIONS)

  return transactionResult
}
