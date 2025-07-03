import { all, fork, takeLatest } from 'typed-redux-saga'

import { pollBalancesSaga } from '../balances/pollBalancesSaga'
import { pollPricesSaga } from '../prices/pollPricesSaga'
import { pollIntentsHistorySaga } from '../transactionHistory/pollIntentsHistorySaga'
import { updateSdkWalletSaga } from '../wallet'
import { walletActions } from './wallet.slice'

export function* walletMasterSaga(): Generator {
  yield all([
    takeLatest(walletActions.update.type, updateSdkWalletSaga),
    fork(pollBalancesSaga),
    fork(pollIntentsHistorySaga),
    fork(pollPricesSaga),
  ])
}
