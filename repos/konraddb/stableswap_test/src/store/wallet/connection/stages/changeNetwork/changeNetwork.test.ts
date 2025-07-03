import { expectSaga } from 'redux-saga-test-plan'

import { walletActions } from '@store/wallet/wallet.slice'

import {
  ConnectionStage,
  ConnectionStageStatus,
  ConnectionStageType,
} from '../../types'
import { changeNetworkConnectionStageHandler } from './changeNetwork'
import { pendingStatusHandler, successStatusHandler } from './status'

describe('Connect Wallet Connection Stage', () => {
  describe('Fail Status', () => {
    const connectionStage: ConnectionStage = {
      type: ConnectionStageType.ConnectWallet,
      status: ConnectionStageStatus.Fail,
    }

    it('should not handle Pending status', async () => {
      await expectSaga(changeNetworkConnectionStageHandler, connectionStage)
        .not.call(pendingStatusHandler)
        .run()
    })

    it('should not handle Success status', async () => {
      await expectSaga(changeNetworkConnectionStageHandler, connectionStage)
        .not.call(successStatusHandler)
        .run()
    })

    it('should not dispatch stage change action', async () => {
      await expectSaga(changeNetworkConnectionStageHandler, connectionStage)
        .not.put.actionType(walletActions.changeConnectionStage.type)
        .run()
    })
  })

  describe('Pending Status', () => {
    const connectionStage: ConnectionStage = {
      type: ConnectionStageType.ConnectWallet,
      status: ConnectionStageStatus.Pending,
    }

    it('should handle Pending status', async () => {
      await expectSaga(changeNetworkConnectionStageHandler, connectionStage)
        .call(pendingStatusHandler)
        .run()
    })

    it('should not handle Success status', async () => {
      await expectSaga(changeNetworkConnectionStageHandler, connectionStage)
        .not.call(successStatusHandler)
        .run()
    })
  })

  describe('Success Status', () => {
    const connectionStage: ConnectionStage = {
      type: ConnectionStageType.ConnectWallet,
      status: ConnectionStageStatus.Success,
    }

    it('should not handle Pending status', async () => {
      await expectSaga(changeNetworkConnectionStageHandler, connectionStage)
        .not.call(pendingStatusHandler)
        .run()
    })

    it('should handle Success status', async () => {
      await expectSaga(changeNetworkConnectionStageHandler, connectionStage)
        .call(successStatusHandler)
        .run()
    })
  })
})
