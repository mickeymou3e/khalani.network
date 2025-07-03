import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'
import { select } from 'redux-saga/effects'

import { combineReducers } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { lockdropSelectors } from '../lockDrop.selector'
import { lockDropReducer } from '../lockDrop.slice'
import { LockdropPhase } from '../lockDrop.types'
import { getCurrentDate, updateLockDropTimer } from './updateLockDropTimer.saga'

describe('update lockdrop timer', () => {
  it('should update the timer with days, hours, and minutes', () => {
    return expectSaga(updateLockDropTimer)
      .withReducer(
        combineReducers({
          [StoreKeys.LockDrop]: lockDropReducer,
        }),
      )
      .withState({
        [StoreKeys.LockDrop]: {},
      })
      .provide([
        [select(lockdropSelectors.lockdropPhaseEndTime), 1698656492],
        [call.fn(getCurrentDate), 1698403813937],
      ])
      .hasFinalState({
        [StoreKeys.LockDrop]: {
          timer: {
            days: 2,
            hours: 22,
            minutes: 11,
            seconds: 18,
          },
        },
      })
      .run()
  })

  it('should set timer to 0 if timeDifference is <= 0', () => {
    return expectSaga(updateLockDropTimer)
      .withReducer(
        combineReducers({
          [StoreKeys.LockDrop]: lockDropReducer,
        }),
      )
      .withState({
        [StoreKeys.LockDrop]: {},
      })
      .provide([
        [select(lockdropSelectors.lockdropPhaseEndTime), 1698403813],
        [call.fn(getCurrentDate), 1698403813000],
      ])
      .hasFinalState({
        [StoreKeys.LockDrop]: {
          timer: {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          },
        },
      })
      .run()
  })
  it('should set correctly day boost in phase one', () => {
    return expectSaga(updateLockDropTimer)
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
          currentPhase: LockdropPhase.One,
        },
      })
      .provide([
        [select(lockdropSelectors.lockdropPhaseEndTime), 1698656492],
        [call.fn(getCurrentDate), 1698403813937],
      ])
      .hasFinalState({
        [StoreKeys.LockDrop]: {
          timer: {
            days: 2,
            hours: 22,
            minutes: 11,
            seconds: 18,
          },
          phaseOne: {
            lock: { dayBoost: 2 },
          },
          currentPhase: LockdropPhase.One,
        },
      })
      .run()
  })
})
