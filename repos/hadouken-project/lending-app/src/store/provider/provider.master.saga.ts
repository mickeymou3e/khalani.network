import { all, takeLatest } from 'typed-redux-saga'

import { backstopDepositSaga } from '@store/actions/backstop/deposit'
import { backstopWithdrawSaga } from '@store/actions/backstop/withdraw'
import { blockChangeSaga } from '@store/actions/blockChange'
import { borrowSaga } from '@store/actions/borrow'
import { collateralSaga } from '@store/actions/collateral'
import { depositSaga } from '@store/actions/deposit'
import { mintSaga } from '@store/actions/mint'
import { repaySaga } from '@store/actions/repay'
import { swapBorrowModeSaga } from '@store/actions/swapBorrowMode'
import { withdrawSaga } from '@store/actions/withdraw'

import { providerActions } from './provider.slice'

export function* providerMasterSaga(): Generator {
  yield all([
    takeLatest(
      providerActions.backstopDepositRequest.type,
      backstopDepositSaga,
    ),
    takeLatest(
      providerActions.backstopWithdrawRequest.type,
      backstopWithdrawSaga,
    ),

    takeLatest(providerActions.depositRequest.type, depositSaga),
    takeLatest(providerActions.withdrawRequest.type, withdrawSaga),
    takeLatest(providerActions.borrowRequest.type, borrowSaga),
    takeLatest(providerActions.repayRequest.type, repaySaga),
    takeLatest(providerActions.swapBorrowModeRequest.type, swapBorrowModeSaga),
    takeLatest(providerActions.collateralRequest.type, collateralSaga),
    takeLatest(providerActions.mintRequest.type, mintSaga),
    takeLatest(providerActions.updateLatestBlock.type, blockChangeSaga),
  ])
}
