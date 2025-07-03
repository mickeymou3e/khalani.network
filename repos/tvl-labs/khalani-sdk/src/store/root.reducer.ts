import { combineReducers } from '@reduxjs/toolkit'

import { StoreKeys } from './store.keys'
import { providerReducer } from './provider/provider.slice'
import { sdkReducer } from './sdk/sdk.slice'
import { tokensReducer } from './tokens/tokens.slice'
import { allowanceReducer } from './allowance/allowance.slice'
import { balancesReducer } from './balances/balances.slice'
import { chainsReducer } from './chains/chains.slice'
import { pricesReducer } from './prices/prices.slice'
import { nativeBalancesReducer } from './nativeBalances/nativeBalances.slice'
import { approveReducer } from './approve/approve.slice'
import { safeReducer } from './safe/safe.slice'
import { transactionHistoryReducer } from './transactionHistory/transactionHistory.slice'
import { createIntentReducer } from './swaps/create/create.slice'

import { createRefineReducer } from './refine/create/create.slice'
import { queryRefineReducer } from './refine/query/query.slice'
import { mTokenBalancesReducer } from './mTokenBalances/balances.slice'
import { bridgeHistoryReducer } from './history/bridge/bridge.slice'
import { liquidityHistoryReducer } from './history/liquidity/liquidity.slice'
import { intentsReducer } from './intents/intents.slice'
import { intentBalancesReducer } from './intentBalances/intentBalances.slice'
import { withdrawMTokenReducer } from './withdrawMToken/withdrawMToken.slice'
import { withdrawIntentBalanceReducer } from './withdrawIntentBalance/withdrawIntentBalance.slice'
import { depositReducer } from './deposit/deposit.slice'
import { depositHistoryReducer } from './depositHistory/depositHistory.slice'

export const reducers = {
  [StoreKeys.Provider]: providerReducer,
  [StoreKeys.SDK]: sdkReducer,
  [StoreKeys.Tokens]: tokensReducer,
  [StoreKeys.Allowance]: allowanceReducer,
  [StoreKeys.Balances]: balancesReducer,
  [StoreKeys.Chains]: chainsReducer,
  [StoreKeys.Prices]: pricesReducer,
  [StoreKeys.NativeBalances]: nativeBalancesReducer,
  [StoreKeys.Approve]: approveReducer,
  [StoreKeys.Safe]: safeReducer,
  [StoreKeys.TransactionHistory]: transactionHistoryReducer,
  [StoreKeys.CreateIntent]: createIntentReducer,
  [StoreKeys.CreateRefine]: createRefineReducer,
  [StoreKeys.QueryRefine]: queryRefineReducer,
  [StoreKeys.BridgeHistory]: bridgeHistoryReducer,
  [StoreKeys.LiquidityHistory]: liquidityHistoryReducer,
  [StoreKeys.MTokenBalances]: mTokenBalancesReducer,
  [StoreKeys.IntentBalances]: intentBalancesReducer,
  [StoreKeys.Intents]: intentsReducer,
  [StoreKeys.WithdrawMToken]: withdrawMTokenReducer,
  [StoreKeys.WithdrawIntentBalance]: withdrawIntentBalanceReducer,
  [StoreKeys.Deposit]: depositReducer,
  [StoreKeys.DepositHistory]: depositHistoryReducer,
}

export const rootReducer = combineReducers(reducers)
