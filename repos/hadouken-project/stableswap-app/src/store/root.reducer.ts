import { combineReducers } from '@reduxjs/toolkit'
import { depositReducer } from '@store/deposit/deposit.slice'
import { poolsHistoryReducer } from '@store/poolHistory/poolHistory.slice'
import { pricedBalancesReducer } from '@store/pricedBalances/pricedBalances.slice'
import { pricesReducer } from '@store/prices/prices.slice'
import { swapReducer } from '@store/swap/swap.slice'
import { withdrawReducer } from '@store/withdraw/withdraw.slice'

import { backstopReducer } from './backstop/backstop.slice'
import { balancesReducer } from './balances/balances.slice'
import { contractsReducer } from './contracts/contracts.slice'
import { historyReducer } from './history/history.slice'
import { initializeStoreReducer } from './initializeStore/initializeStore.slice'
import { lendingReducer } from './lending/lending.slice'
import { lockDropReducer } from './lockDrop/lockDrop.slice'
import { networkReducer } from './network/network.slice'
import { poolsReducer } from './pool/pool.slice'
import { poolJoinsExitsReducer } from './poolJoinExists/poolJoinsExits.slice'
import { poolSwapsReducer } from './poolSwaps/poolSwaps.slice'
import { providerReducer } from './provider/provider.slice'
import { StoreKeys } from './store.keys'
import { tokensReducer } from './tokens/tokens.slice'
import { userSharesReducer } from './userShares/userShares.slice'
import { walletReducer } from './wallet/wallet.slice'

export const rootReducer = combineReducers({
  [StoreKeys.InitializeStore]: initializeStoreReducer,
  [StoreKeys.Backstop]: backstopReducer,
  [StoreKeys.Network]: networkReducer,
  [StoreKeys.Provider]: providerReducer,
  [StoreKeys.Balances]: balancesReducer,
  [StoreKeys.PricedBalances]: pricedBalancesReducer,
  [StoreKeys.Wallet]: walletReducer,
  [StoreKeys.Pools]: poolsReducer,
  [StoreKeys.PoolsHistory]: poolsHistoryReducer,
  [StoreKeys.Prices]: pricesReducer,
  [StoreKeys.Tokens]: tokensReducer,
  [StoreKeys.History]: historyReducer,
  [StoreKeys.UserShares]: userSharesReducer,
  [StoreKeys.Contracts]: contractsReducer,
  [StoreKeys.Swap]: swapReducer,
  [StoreKeys.Deposit]: depositReducer,
  [StoreKeys.Withdraw]: withdrawReducer,
  [StoreKeys.Lending]: lendingReducer,
  [StoreKeys.PoolJoinsExits]: poolJoinsExitsReducer,
  [StoreKeys.PoolSwaps]: poolSwapsReducer,
  [StoreKeys.LockDrop]: lockDropReducer,
})
