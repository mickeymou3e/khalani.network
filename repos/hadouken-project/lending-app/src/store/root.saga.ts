import { all, fork } from 'typed-redux-saga'

import { backstopMasterSaga } from './backstop/backstop.master.saga'
import { balancesMasterSaga } from './balances/balances.master.saga'
import { pricesMasterSaga } from './prices/prices.master.saga'
import { providerMasterSaga } from './provider/provider.master.saga'
import { reservesMasterSaga } from './reserves/reserves.master.saga'
import { tokensMasterSaga } from './tokens/tokens.master.saga'
import { walletMasterSaga } from './wallet/wallet.master.saga'

export function* rootSaga(): Generator {
  yield all([
    fork(walletMasterSaga),
    fork(tokensMasterSaga),
    fork(providerMasterSaga),
    fork(balancesMasterSaga),
    fork(reservesMasterSaga),
    fork(pricesMasterSaga),
    fork(backstopMasterSaga),
  ])
}
