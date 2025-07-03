import { call, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { PayloadAction } from '@reduxjs/toolkit'
import { BackstopWithdrawRequestPayload } from '@store/backstop/backstop.types'
import { contractsSelectors } from '@store/contracts/contracts.selectors'

export function* backstopWithdrawSaga(
  action: PayloadAction<BackstopWithdrawRequestPayload>,
): Generator {
  const { amount } = action.payload
  const backstopContracts = yield* select(contractsSelectors.backstopContracts)
  const backstop = backstopContracts?.backstop

  if (!backstop) throw Error('backstop is undefined')

  const withdrawTransaction = yield* call(
    backstop.withdraw,
    amount.toBigNumber(),
  )

  yield* call(withdrawTransaction.wait, CONFIRMATIONS)

  return withdrawTransaction
}
