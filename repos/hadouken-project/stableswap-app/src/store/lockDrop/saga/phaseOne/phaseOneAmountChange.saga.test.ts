import { expectSaga } from 'redux-saga-test-plan'

import { combineReducers } from '@reduxjs/toolkit'
import {
  lockDropActions,
  lockDropReducer,
} from '@store/lockDrop/lockDrop.slice'
import { StoreKeys } from '@store/store.keys'
import { walletInitState, walletReducer } from '@store/wallet/wallet.slice'
import { BigDecimal } from '@utils/math'

import { phaseOneLockAmountChange } from './phaseOneAmountChange.saga'

describe('Lockdrop - Phase One', () => {
  describe('Amount change', () => {
    it('should change amount in store', async () => {
      await expectSaga(
        phaseOneLockAmountChange,
        lockDropActions.phaseOneLockAmountChangeRequest(BigDecimal.from(10)),
      )
        .withReducer(
          combineReducers({
            [StoreKeys.LockDrop]: lockDropReducer,
            [StoreKeys.Wallet]: walletReducer,
          }),
        )
        .withState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {
                amount: undefined,
                tokenAddress: '0x123',
              },
            },
          },
          [StoreKeys.Wallet]: walletInitState,
        })
        .hasFinalState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {
                amount: BigDecimal.from(10),
                tokenAddress: '0x123',
              },
            },
          },
          [StoreKeys.Wallet]: walletInitState,
        })
        .silentRun(1000)
    })
  })
})
