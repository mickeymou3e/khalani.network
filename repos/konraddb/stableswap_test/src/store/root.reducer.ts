import { combineReducers } from '@reduxjs/toolkit'
import { depositReducer } from '@store/deposit/deposit.slice'
import { poolsHistoryReducer } from '@store/poolHistory/poolHistory.slice'
import { pricedBalancesReducer } from '@store/pricedBalances/pricedBalances.slice'
import { pricesReducer } from '@store/prices/prices.slice'
import { swapReducer } from '@store/swap/swap.slice'
import { withdrawReducer } from '@store/withdraw/withdraw.slice'

import { allowanceReducer } from './allowance/allowance.slice'
import { approveReducer } from './approve/approve.slice'
import { balancesReducer } from './balances/balances.slice'
import { chainsReducer } from './chains/chains.slice'
import { contractsReducer } from './contracts/contracts.slice'
import { crossChainDepositReducer } from './crossChainDeposit/crossChainDeposit.slice'
import { historyReducer } from './history/history.slice'
import { initializeStoreReducer } from './initializeStore/initializeStore.slice'
import { khalaBalancesReducer } from './khala/balances/balances.slice'
import { khalaTokensReducer } from './khala/tokens/tokens.slice'
import { lockReducer } from './lock/lock.slice'
import { networkReducer } from './network/network.slice'
import { poolsReducer } from './pool/pool.slice'
import { providerReducer } from './provider/provider.slice'
import { StoreKeys } from './store.keys'
import { tokensReducer } from './tokens/tokens.slice'
import { userSharesReducer } from './userShares/userShares.slice'
import { walletReducer } from './wallet/wallet.slice'

export const rootReducer = combineReducers({
  [StoreKeys.InitializeStore]: initializeStoreReducer,
  [StoreKeys.Network]: networkReducer,
  [StoreKeys.Chains]: chainsReducer,
  [StoreKeys.Provider]: providerReducer,
  [StoreKeys.Balances]: balancesReducer,
  [StoreKeys.PricedBalances]: pricedBalancesReducer,
  [StoreKeys.Wallet]: walletReducer,
  [StoreKeys.Pools]: poolsReducer,
  [StoreKeys.PoolsHistory]: poolsHistoryReducer,
  [StoreKeys.Prices]: pricesReducer,
  [StoreKeys.Tokens]: tokensReducer,
  [StoreKeys.History]: historyReducer,
  [StoreKeys.Lock]: lockReducer,
  [StoreKeys.UserShares]: userSharesReducer,
  [StoreKeys.Contracts]: contractsReducer,
  [StoreKeys.Swap]: swapReducer,
  [StoreKeys.Deposit]: depositReducer,
  [StoreKeys.Withdraw]: withdrawReducer,
  [StoreKeys.CrossChainDeposit]: crossChainDepositReducer,
  [StoreKeys.Allowance]: allowanceReducer,
  [StoreKeys.Approve]: approveReducer,
  [StoreKeys.KhalaTokens]: khalaTokensReducer,
  [StoreKeys.KhalaBalances]: khalaBalancesReducer,
})
