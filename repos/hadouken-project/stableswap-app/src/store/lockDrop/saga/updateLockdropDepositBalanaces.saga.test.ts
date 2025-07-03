import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'

import { combineReducers } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { BigDecimal } from '@utils/math'

import { lockDropReducer } from '../lockDrop.slice'
import { getDepositedTokensBalances } from './fetchDepositedTokensBalances.saga'
import { getParticipation } from './fetchParticipation.saga'
import { updateLockdropDepositTokensBalances } from './updateLockdropDepositBalances.saga'

describe('Update lockdrop user details ', () => {
  it('should update deposit balances in phase two', async () => {
    const depositBalances = {
      totalEthDepositAmount: BigDecimal.from(100),
      totalHdkDepositAmount: BigDecimal.from(100),
      userEthDepositAmount: BigDecimal.from(50),
      userHdkDepositAmount: BigDecimal.from(50),
    }
    await expectSaga(updateLockdropDepositTokensBalances)
      .withReducer(
        combineReducers({
          [StoreKeys.LockDrop]: lockDropReducer,
        }),
      )
      .withState({
        [StoreKeys.LockDrop]: {
          phaseTwo: {},
        },
      })
      .provide([
        [call.fn(getDepositedTokensBalances), depositBalances],
        [call.fn(getParticipation), BigDecimal.from('6724', 2)],
      ])

      .hasFinalState({
        [StoreKeys.LockDrop]: {
          phaseTwo: {
            lockdropDepositBalances: depositBalances,
            participationOnChain: BigDecimal.from('6724', 2),
          },
        },
      })
      .run()
  })
})
