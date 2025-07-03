import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'

import { combineReducers } from '@reduxjs/toolkit'
import { initNetworkSaga } from '@store/network/saga/init.saga'
import { StoreKeys } from '@store/store.keys'
import { checkExpectedNetwork } from '@store/wallet/connection/stages/changeNetwork/validators'
import { checkAccountConnected } from '@store/wallet/connection/validators'
import { walletActions, walletReducer } from '@store/wallet/wallet.slice'
import { WalletState } from '@store/wallet/wallet.types'

import { ConnectionStageStatus, ConnectionStageType } from '../../../types'
import { pendingStatusHandler } from './pending'

describe('Status Success of Change Network Connection Stage', () => {
  it('should change connection stage to Success', async () => {
    const expectedWalletState: Partial<WalletState> = {
      connectionStage: {
        type: ConnectionStageType.ChangeNetwork,
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
        [call.fn(initNetworkSaga), true],
        [call.fn(checkExpectedNetwork), true],
        [call.fn(checkAccountConnected), true],
      ])
      .put(
        walletActions.changeConnectionStage({
          type: ConnectionStageType.ChangeNetwork,
          status: ConnectionStageStatus.Success,
        }),
      )
      .hasFinalState({
        [StoreKeys.Wallet]: expectedWalletState,
      })
      .run()
  })

  describe('should change connection stage to Fail', () => {
    it('no initialized network', async () => {
      const expectedWalletState: Partial<WalletState> = {
        connectionStage: {
          type: ConnectionStageType.ChangeNetwork,
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
          [call.fn(initNetworkSaga), false],
          [call.fn(checkExpectedNetwork), true],
          [call.fn(checkAccountConnected), true],
        ])
        .put(
          walletActions.changeConnectionStage({
            type: ConnectionStageType.ChangeNetwork,
            status: ConnectionStageStatus.Fail,
          }),
        )
        .hasFinalState({
          [StoreKeys.Wallet]: expectedWalletState,
        })
        .run()
    })

    it('no check network', async () => {
      const expectedWalletState: Partial<WalletState> = {
        connectionStage: {
          type: ConnectionStageType.ChangeNetwork,
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
          [call.fn(initNetworkSaga), true],
          [call.fn(checkExpectedNetwork), false],
          [call.fn(checkAccountConnected), false],
        ])
        .put(
          walletActions.changeConnectionStage({
            type: ConnectionStageType.ChangeNetwork,
            status: ConnectionStageStatus.Fail,
          }),
        )
        .hasFinalState({
          [StoreKeys.Wallet]: expectedWalletState,
        })
        .run()
    })

    it('not authorized', async () => {
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
          [call.fn(initNetworkSaga), true],
          [call.fn(checkExpectedNetwork), true],
          [call.fn(checkAccountConnected), false],
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
