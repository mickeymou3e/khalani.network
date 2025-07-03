import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'

import { combineReducers } from '@reduxjs/toolkit'
import { initializeProviderSaga } from '@store/provider/provider.initialize.saga'
import { StoreKeys } from '@store/store.keys'
import { walletActions, walletReducer } from '@store/wallet/wallet.slice'
import { WalletState } from '@store/wallet/wallet.types'
import {
  connectMetamaskWallet,
  detectMetamask,
} from '@store/wallet/wallet.utils'

import {
  ConnectionStageStatus,
  ConnectionStageType,
  SelectWalletPendingPayload,
  WalletType,
} from '../../../types'
import { pendingStatusHandler } from './pending'

describe('Status Pending of Select Wallet Connection Stage', () => {
  describe('Select Wallet Connection Stage no Payload', () => {
    it('should change connection stage status to Fail on no payload', async () => {
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
        .provide([[call.fn(detectMetamask), {}]])
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

  describe('Select Wallet Connection Stage with Payload', () => {
    const metamaskMock = {}
    const providerMock = {}
    describe('Select Metamask wallet', () => {
      const selectMetamaskWalletPayload: SelectWalletPendingPayload = {
        type: WalletType.MetaMask,
      }

      it('should change connection stage status to Success on no payload', async () => {
        const expectedWalletState: Partial<WalletState> = {
          connectionStage: {
            type: ConnectionStageType.SelectWallet,
            status: ConnectionStageStatus.Success,
            payload: undefined,
          },
        }
        await expectSaga(pendingStatusHandler, selectMetamaskWalletPayload)
          .withReducer(
            combineReducers({
              [StoreKeys.Wallet]: walletReducer,
            }),
          )
          .withState({
            [StoreKeys.Wallet]: {},
          })
          .provide([
            [call.fn(detectMetamask), metamaskMock],
            [call.fn(initializeProviderSaga), providerMock],
            [call.fn(connectMetamaskWallet), undefined],
          ])
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

      it('should change connection stage to InstallWallet Fail on no metamask', async () => {
        const expectedWalletState: Partial<WalletState> = {
          connectionStage: {
            type: ConnectionStageType.InstallWallet,
            status: ConnectionStageStatus.Fail,
            payload: undefined,
          },
        }
        await expectSaga(pendingStatusHandler, selectMetamaskWalletPayload)
          .withReducer(
            combineReducers({
              [StoreKeys.Wallet]: walletReducer,
            }),
          )
          .withState({
            [StoreKeys.Wallet]: {},
          })
          .provide([[call.fn(detectMetamask), undefined]])
          .put(
            walletActions.changeConnectionStage({
              type: ConnectionStageType.InstallWallet,
              status: ConnectionStageStatus.Fail,
            }),
          )
          .hasFinalState({
            [StoreKeys.Wallet]: expectedWalletState,
          })
          .run()
      })

      it('should change connection stage to InstallWallet Fail on no metamask', async () => {
        const expectedWalletState: Partial<WalletState> = {
          connectionStage: {
            type: ConnectionStageType.ConnectWallet,
            status: ConnectionStageStatus.Fail,
            payload: undefined,
          },
        }

        await expectSaga(pendingStatusHandler, selectMetamaskWalletPayload)
          .withReducer(
            combineReducers({
              [StoreKeys.Wallet]: walletReducer,
            }),
          )
          .withState({
            [StoreKeys.Wallet]: {},
          })
          .provide([
            [call.fn(detectMetamask), metamaskMock],
            [call.fn(initializeProviderSaga), providerMock],
            [
              call.fn(connectMetamaskWallet),
              throwError(new Error('Mock Error')),
            ],
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
})
