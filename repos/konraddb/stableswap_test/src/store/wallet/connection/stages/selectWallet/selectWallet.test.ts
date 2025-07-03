import { expectSaga } from 'redux-saga-test-plan'

import { walletActions } from '@store/wallet/wallet.slice'

import {
  ConnectionStage,
  ConnectionStageStatus,
  ConnectionStageType,
} from '../../types'
import { selectWalletConnectionStageHandler } from './selectWallet'
import { pendingStatusHandler, successStatusHandler } from './status'

describe('Select Wallet Connection Stage', () => {
  describe('Fail Status', () => {
    const connectionStage: ConnectionStage = {
      type: ConnectionStageType.SelectWallet,
      status: ConnectionStageStatus.Fail,
    }

    it('should not handle Pending status', async () => {
      await expectSaga(selectWalletConnectionStageHandler, connectionStage)
        .not.call(pendingStatusHandler)
        .run()
    })

    it('should not handle Success status', async () => {
      await expectSaga(selectWalletConnectionStageHandler, connectionStage)
        .not.call(successStatusHandler)
        .run()
    })

    it('should not dispatch stage change action', async () => {
      await expectSaga(selectWalletConnectionStageHandler, connectionStage)
        .not.put.actionType(walletActions.changeConnectionStage.type)
        .run()
    })
  })

  describe('Pending Status', () => {
    const connectionStage: ConnectionStage = {
      type: ConnectionStageType.SelectWallet,
      status: ConnectionStageStatus.Pending,
      payload: undefined,
    }

    it('should handle Pending status', async () => {
      await expectSaga(selectWalletConnectionStageHandler, connectionStage)
        .call(pendingStatusHandler, undefined)
        .run()
    })

    it('should not handle Success status', async () => {
      await expectSaga(selectWalletConnectionStageHandler, connectionStage)
        .not.call(successStatusHandler)
        .run()
    })
  })

  describe('Success Status', () => {
    const connectionStage: ConnectionStage = {
      type: ConnectionStageType.SelectWallet,
      status: ConnectionStageStatus.Success,
      payload: undefined,
    }

    it('should not handle Pending status', async () => {
      await expectSaga(selectWalletConnectionStageHandler, connectionStage)
        .not.call(pendingStatusHandler, undefined)
        .run()
    })

    it('should handle Success status', async () => {
      await expectSaga(selectWalletConnectionStageHandler, connectionStage)
        .call(successStatusHandler)
        .run()
    })
  })
})
