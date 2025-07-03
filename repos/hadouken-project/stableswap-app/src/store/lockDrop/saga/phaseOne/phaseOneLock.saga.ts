import { call, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'

export function* phaseOneLock(): Generator {
  const lockLength = yield* select(lockdropSelectors.phaseOneLockLength)
  const amount = yield* select(lockdropSelectors.phaseOneLockAmount)
  const selectedToken = yield* select(
    lockdropSelectors.phaseOneSelectedLockToken,
  )

  if (!selectedToken) throw new Error('Lockdrop token not selected')

  const lockdropContract = yield* select(contractsSelectors.lockDropConnector)

  if (!lockdropContract) throw new Error('Lockdrop contract not found')

  const lockTransaction = yield* call(
    lockdropContract.lock,
    selectedToken.address,
    amount.toBigNumber(),
    lockLength,
  )

  const transactionResult = yield* call(lockTransaction.wait, CONFIRMATIONS)

  return transactionResult
}
