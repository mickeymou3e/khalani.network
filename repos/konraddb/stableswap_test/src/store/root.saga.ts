import { History } from 'history'
import { all, fork } from 'typed-redux-saga'

import { poolsHistoryMasterSaga } from '@store/poolHistory/poolHistory.master.saga'
import { pricedBalancesMasterSaga } from '@store/pricedBalances/pricedBalances.master.saga'
import { pricesMasterSaga } from '@store/prices/prices.master.saga'

import { approveMasterSaga } from './approve/approve.master.saga'
import { balancesMasterSaga } from './balances/balances.master.saga'
import { crossChainDepositMasterSaga } from './crossChainDeposit/crossChainDeposit.master.saga'
import { depositMasterSaga } from './deposit/deposit.master.saga'
import { historyMasterSaga } from './history/history.master.saga'
import { initializeStoreMasterSaga } from './initializeStore/initializeStore.master.saga'
import { lockMasterSaga } from './lock/lock.master.saga'
import { networkMasterSaga } from './network/network.master.saga'
import { poolsMasterSaga } from './pool/pool.master.saga'
import { routerSaga } from './router/router.master.saga'
import { swapMasterSaga } from './swap/swap.master.saga'
import { tokensMasterSaga } from './tokens/tokens.master.saga'
import { userSharesMasterSaga } from './userShares/userShares.master.saga'
import { walletMasterSaga } from './wallet/wallet.master.saga'
import { withdrawMasterSaga } from './withdraw/withdraw.master.saga'

export function* rootSaga(historyProvider: History): Generator {
  yield all([
    fork(routerSaga, historyProvider),
    fork(initializeStoreMasterSaga),
    fork(networkMasterSaga),
    fork(walletMasterSaga),
    fork(tokensMasterSaga),
    fork(poolsMasterSaga),
    fork(poolsHistoryMasterSaga),
    fork(pricesMasterSaga),
    fork(historyMasterSaga),
    fork(balancesMasterSaga),
    fork(pricedBalancesMasterSaga),
    fork(userSharesMasterSaga),
    fork(swapMasterSaga),
    fork(depositMasterSaga),
    fork(withdrawMasterSaga),
    fork(lockMasterSaga),
    fork(crossChainDepositMasterSaga),
    fork(approveMasterSaga),
  ])
}
