import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'

import { combineReducers } from '@reduxjs/toolkit'
import { initializeProviderSaga } from '@store/provider/provider.initialize.saga'
import { StoreKeys } from '@store/store.keys'
import { checkAccountConnected } from '@store/wallet/connection/validators'
import { initializeWalletSaga } from '@store/wallet/wallet.initialize.saga'
import { walletActions, walletReducer } from '@store/wallet/wallet.slice'
import { WalletState } from '@store/wallet/wallet.types'
import { detectMetamask } from '@store/wallet/wallet.utils'

import { ConnectionStageStatus, ConnectionStageType } from '../../../types'
import { pendingStatusHandler } from './pending'

describe('Status Success of Connect Wallet Connection Stage', () => {
  it('should change connection stage to ConnectWallet Success', async () => {
    const expectedWalletState: Partial<WalletState> = {
      connectionStage: {
        type: ConnectionStageType.ConnectWallet,
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
      .provide([
        [call.fn(detectMetamask), {}],
        [call.fn(initializeProviderSaga), {}],
        [call.fn(checkAccountConnected), true],
        [call.fn(initializeWalletSaga), true],
      ])
      .put(
        walletActions.changeConnectionStage({
          type: ConnectionStageType.ConnectWallet,
          status: ConnectionStageStatus.Success,
        }),
      )
      .hasFinalState({
        [StoreKeys.Wallet]: expectedWalletState,
      })
      .run()
  })

  describe('should change connection stage to ConnectWallet Fail', () => {
    it('no provider', async () => {
      const expectedWalletState: Partial<WalletState> = {
        connectionStage: {
          type: ConnectionStageType.ConnectWallet,
          status: ConnectionStageStatus.Fail,
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
        .provide([
          [call.fn(detectMetamask), undefined],
          [call.fn(initializeProviderSaga), null],
          [call.fn(checkAccountConnected), true],
          [call.fn(initializeWalletSaga), true],
        ])
        .put(
          walletActions.changeConnectionStage({
            type: ConnectionStageType.ConnectWallet,
            status: ConnectionStageStatus.Fail,
          }),
        )
        .hasFinalState({
          [StoreKeys.Wallet]: expectedWalletState,
        })
        .run()
    })

    it('no authentication', async () => {
      const expectedWalletState: Partial<WalletState> = {
        connectionStage: {
          type: ConnectionStageType.ConnectWallet,
          status: ConnectionStageStatus.Fail,
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
        .provide([
          [call.fn(detectMetamask), {}],
          [call.fn(initializeProviderSaga), {}],
          [call.fn(checkAccountConnected), false],
          [call.fn(initializeWalletSaga), true],
        ])
        .put(
          walletActions.changeConnectionStage({
            type: ConnectionStageType.ConnectWallet,
            status: ConnectionStageStatus.Fail,
          }),
        )
        .hasFinalState({
          [StoreKeys.Wallet]: expectedWalletState,
        })
        .run()
    })

    it('no address translator', async () => {
      const expectedWalletState: Partial<WalletState> = {
        connectionStage: {
          type: ConnectionStageType.ConnectWallet,
          status: ConnectionStageStatus.Fail,
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
        .provide([
          [call.fn(detectMetamask), {}],
          [call.fn(initializeProviderSaga), {}],
          [call.fn(checkAccountConnected), true],
          [call.fn(initializeWalletSaga), true],
        ])
        .put(
          walletActions.changeConnectionStage({
            type: ConnectionStageType.ConnectWallet,
            status: ConnectionStageStatus.Fail,
          }),
        )
        .hasFinalState({
          [StoreKeys.Wallet]: expectedWalletState,
        })
        .run()
    })

    it('no initialized wallet', async () => {
      const expectedWalletState: Partial<WalletState> = {
        connectionStage: {
          type: ConnectionStageType.ConnectWallet,
          status: ConnectionStageStatus.Fail,
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
        .provide([
          [call.fn(detectMetamask), {}],
          [call.fn(initializeProviderSaga), {}],
          [call.fn(checkAccountConnected), true],
          [call.fn(initializeWalletSaga), false],
        ])
        .put(
          walletActions.changeConnectionStage({
            type: ConnectionStageType.ConnectWallet,
            status: ConnectionStageStatus.Fail,
          }),
        )
        .hasFinalState({
          [StoreKeys.Wallet]: expectedWalletState,
        })
        .run()
    })
  })
})
