import { expectSaga } from 'redux-saga-test-plan'

import { walletActions } from '@store/wallet/wallet.slice'

import {
  ConnectionStage,
  ConnectionStageStatus,
  ConnectionStageType,
} from '../../types'
import { idleConnectionStageHandler } from './idle'
import { pendingStatusHandler } from './status'

describe('Select Wallet Connection Stage', () => {
  describe('Fail Status', () => {
    const connectionStage: ConnectionStage = {
      type: ConnectionStageType.Idle,
      status: ConnectionStageStatus.Fail,
      payload: undefined,
    }

    it('should not handle Pending status', async () => {
      await expectSaga(idleConnectionStageHandler, connectionStage)
        .not.call(pendingStatusHandler, undefined)
        .run()
    })

    it('should not dispatch stage change action', async () => {
      await expectSaga(idleConnectionStageHandler, connectionStage)
        .not.put.actionType(walletActions.changeConnectionStage.type)
        .run()
    })
  })

  describe('Pending Status', () => {
    const connectionStage: ConnectionStage = {
      type: ConnectionStageType.Idle,
      status: ConnectionStageStatus.Pending,
      payload: undefined,
    }

    it('should handle Pending status', async () => {
      await expectSaga(idleConnectionStageHandler, connectionStage)
        .call(pendingStatusHandler)
        .run()
    })
  })

  describe('Success Status', () => {
    const connectionStage: ConnectionStage = {
      type: ConnectionStageType.Idle,
      status: ConnectionStageStatus.Success,
      payload: undefined,
    }
    it('should not handle Pending status', async () => {
      await expectSaga(idleConnectionStageHandler, connectionStage)
        .not.call(pendingStatusHandler, undefined)
        .run()
    })
    it('should not dispatch stage change action', async () => {
      await expectSaga(idleConnectionStageHandler, connectionStage)
        .not.put.actionType(walletActions.changeConnectionStage.type)
        .run()
    })
  })
})
