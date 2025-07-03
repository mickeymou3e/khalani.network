import { all, fork } from 'typed-redux-saga'

import { poolsHistoryMasterSaga } from '@store/poolHistory/poolHistory.master.saga'
import { pricedBalancesMasterSaga } from '@store/pricedBalances/pricedBalances.master.saga'
import { pricesMasterSaga } from '@store/prices/prices.master.saga'

import { backstopMasterSaga } from './backstop/backstop.master.saga'
import { balancesMasterSaga } from './balances/balances.master.saga'
import { depositMasterSaga } from './deposit/deposit.master.saga'
import { historyMasterSaga } from './history/history.master.saga'
import { initializeStoreSaga } from './initializeStore/initializeStore.saga'
import { lendingMasterSaga } from './lending/lending.master.saga'
import { lockDropMasterSaga } from './lockDrop/lockDrop.master.saga'
import { networkMasterSaga } from './network/network.master.saga'
import { poolsMasterSaga } from './pool/pool.master.saga'
import { poolJoinsExitsMasterSaga } from './poolJoinExists/poolJoinsExits.master.saga'
import { poolSwapsMasterSaga } from './poolSwaps/poolSwaps.master.saga'
import { swapMasterSaga } from './swap/swap.master.saga'
import { tokensMasterSaga } from './tokens/tokens.master.saga'
import { userSharesMasterSaga } from './userShares/userShares.master.saga'
import { walletMasterSaga } from './wallet/wallet.master.saga'
import { withdrawMasterSaga } from './withdraw/withdraw.master.saga'

export function* rootSaga(): Generator {
  yield all([
    fork(initializeStoreSaga),
    fork(backstopMasterSaga),
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
    fork(lendingMasterSaga),
    fork(poolJoinsExitsMasterSaga),
    fork(poolSwapsMasterSaga),
    fork(lockDropMasterSaga),
  ])
}
