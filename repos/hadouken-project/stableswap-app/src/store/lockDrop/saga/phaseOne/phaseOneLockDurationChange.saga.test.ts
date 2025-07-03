import { expectSaga } from 'redux-saga-test-plan'

import { combineReducers } from '@reduxjs/toolkit'
import {
  lockDropActions,
  lockDropReducer,
} from '@store/lockDrop/lockDrop.slice'
import { LockLength } from '@store/lockDrop/lockDrop.types'
import { StoreKeys } from '@store/store.keys'

import { phaseOneLockDurationChange } from './phaseOneLockDurationChange.saga'

describe('Lockdrop - Phase One', () => {
  describe('Lock duration change', () => {
    it('should set correct lock boost for two weeks', async () => {
      await expectSaga(
        phaseOneLockDurationChange,
        lockDropActions.phaseOneLockDurationChangeRequest(
          LockLength.TwoWeeks.toString(),
        ),
      )
        .withReducer(
          combineReducers({
            [StoreKeys.LockDrop]: lockDropReducer,
          }),
        )
        .withState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {},
            },
          },
        })
        .hasFinalState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {
                lockLength: LockLength.TwoWeeks, // 2 weeks lock = 0.2 boost
                lockLengthBoost: 0.2,
              },
            },
          },
        })
        .run()
    })
    it('should set correct lock boost for one month', async () => {
      await expectSaga(
        phaseOneLockDurationChange,
        lockDropActions.phaseOneLockDurationChangeRequest(
          LockLength.OneMonth.toString(),
        ),
      )
        .withReducer(
          combineReducers({
            [StoreKeys.LockDrop]: lockDropReducer,
          }),
        )
        .withState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {},
            },
          },
        })
        .hasFinalState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {
                lockLength: LockLength.OneMonth, // 1 month lock = 0.6 boost
                lockLengthBoost: 0.6,
              },
            },
          },
        })
        .run()
    })

    it('should set correct lock boost for four months', async () => {
      await expectSaga(
        phaseOneLockDurationChange,
        lockDropActions.phaseOneLockDurationChangeRequest(
          LockLength.FourMonths.toString(),
        ),
      )
        .withReducer(
          combineReducers({
            [StoreKeys.LockDrop]: lockDropReducer,
          }),
        )
        .withState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {},
            },
          },
        })
        .hasFinalState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {
                lockLength: LockLength.FourMonths, // 4 month lock = 1 boost
                lockLengthBoost: 1,
              },
            },
          },
        })
        .run()
    })

    it('should set correct lock boost for one year', async () => {
      await expectSaga(
        phaseOneLockDurationChange,
        lockDropActions.phaseOneLockDurationChangeRequest(
          LockLength.OneYear.toString(),
        ),
      )
        .withReducer(
          combineReducers({
            [StoreKeys.LockDrop]: lockDropReducer,
          }),
        )
        .withState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {},
            },
          },
        })
        .hasFinalState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {
                lockLength: LockLength.OneYear, // one year lock = 2 boost
                lockLengthBoost: 2,
              },
            },
          },
        })
        .run()
    })
  })
})
