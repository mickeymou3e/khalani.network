import { expectSaga } from 'redux-saga-test-plan'

import { combineReducers } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { walletActions, walletReducer } from '@store/wallet/wallet.slice'
import { WalletState } from '@store/wallet/wallet.types'

import { ConnectionStageStatus, ConnectionStageType } from '../../../types'
import { successStatusHandler } from './success'

describe('Status Success of Select Wallet Connection Stage', () => {
  it('should change connection stage', async () => {
    const expectedWalletState: Partial<WalletState> = {
      connectionStage: {
        type: ConnectionStageType.ConnectWallet,
        status: ConnectionStageStatus.Pending,
        payload: undefined,
      },
    }
    await expectSaga(successStatusHandler)
      .withReducer(
        combineReducers({
          [StoreKeys.Wallet]: walletReducer,
        }),
      )
      .withState({
        [StoreKeys.Wallet]: {},
      })
      .put(
        walletActions.changeConnectionStage({
          type: ConnectionStageType.ConnectWallet,
          status: ConnectionStageStatus.Pending,
        }),
      )
      .hasFinalState({
        [StoreKeys.Wallet]: expectedWalletState,
      })
      .run()
  })
})
