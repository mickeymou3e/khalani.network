import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'

import { combineReducers } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { checkAccountConnected } from '@store/wallet/connection/validators'
import { walletActions, walletReducer } from '@store/wallet/wallet.slice'
import { WalletState } from '@store/wallet/wallet.types'

import { ConnectionStageStatus, ConnectionStageType } from '../../../types'
import { pendingStatusHandler } from './pending'

describe('Status Success of Select Wallet Connection Stage', () => {
  it('should change connection stage to SelectWallet Success', async () => {
    const expectedWalletState: Partial<WalletState> = {
      connectionStage: {
        type: ConnectionStageType.SelectWallet,
        status: ConnectionStageStatus.Success,
        payload: undefined,
      },
    }

    await expectSaga(pendingStatusHandler)
      .withReducer(
        combineReducers({
          [StoreKeys.Wallet]: walletReducer,
        }),
      )
      .withState({
        [StoreKeys.Wallet]: {},
      })
      .provide([[call.fn(checkAccountConnected), true]])
      .put(
        walletActions.changeConnectionStage({
          type: ConnectionStageType.SelectWallet,
          status: ConnectionStageStatus.Success,
        }),
      )
      .hasFinalState({
        [StoreKeys.Wallet]: expectedWalletState,
      })
      .run()
  })

  it('should change connection stage to SelectWallet Pending', async () => {
    const expectedWalletState: Partial<WalletState> = {
      connectionStage: {
        type: ConnectionStageType.SelectWallet,
        status: ConnectionStageStatus.Pending,
        payload: undefined,
      },
    }

    await expectSaga(pendingStatusHandler)
      .withReducer(
        combineReducers({
          [StoreKeys.Wallet]: walletReducer,
        }),
      )
      .withState({
        [StoreKeys.Wallet]: {},
      })
      .provide([[call.fn(checkAccountConnected), false]])
      .put(
        walletActions.changeConnectionStage({
          type: ConnectionStageType.SelectWallet,
          status: ConnectionStageStatus.Pending,
        }),
      )
      .hasFinalState({
        [StoreKeys.Wallet]: expectedWalletState,
      })
      .run()
  })
})
