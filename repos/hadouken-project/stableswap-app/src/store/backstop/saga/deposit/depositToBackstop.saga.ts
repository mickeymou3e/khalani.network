import { call, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { PayloadAction } from '@reduxjs/toolkit'
import { BackstopDepositRequestPayload } from '@store/backstop/backstop.types'
import { contractsSelectors } from '@store/contracts/contracts.selectors'

export function* depositToBackstopSaga(
  action: PayloadAction<BackstopDepositRequestPayload>,
): Generator {
  const { amount } = action.payload
  const backstopContracts = yield* select(contractsSelectors.backstopContracts)
  const backstop = backstopContracts?.backstop

  if (!backstop) throw Error('backstop is undefined')

  const depositTransaction = yield* call(backstop.deposit, amount.toBigNumber())

  yield* call(depositTransaction.wait, CONFIRMATIONS)

  return depositTransaction
}
