import { all, fork } from 'typed-redux-saga'

import { balancesMasterSaga } from './balances/balances.master.saga'
import { initializeStoreSaga } from './initializeStore/initializeStore.saga'
import { liquidationsMasterSaga } from './liquidation/liquidation.master.saga'
import { reservesMasterSaga } from './reserves/reserves.master.saga'
import { tokensMasterSaga } from './tokens/tokens.master.saga'
import { usersMasterSaga } from './users/users.master.saga'

export function* rootSaga(): Generator {
  yield all([
    fork(initializeStoreSaga),
    fork(tokensMasterSaga),
    fork(reservesMasterSaga),
    fork(usersMasterSaga),
    fork(liquidationsMasterSaga),
    fork(balancesMasterSaga),
  ])
}
