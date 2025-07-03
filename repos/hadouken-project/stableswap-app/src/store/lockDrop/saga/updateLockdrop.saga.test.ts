import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'

import { Network } from '@constants/Networks'
import { combineReducers } from '@reduxjs/toolkit'
import { networkReducer } from '@store/network/network.slice'
import { StoreKeys } from '@store/store.keys'
import { walletReducer } from '@store/wallet/wallet.slice'
import { BigDecimal } from '@utils/math'

import { lockDropReducer } from '../lockDrop.slice'
import { getLockdropTVL } from './fetchLockdropTVL.saga'
import { getUserLocksDetails } from './fetchUserLocks.saga'
import { updateLockdrop } from './updateLockdrop.saga'

describe('Update lockdrop user details ', () => {
  it('should update user lockdrop details and tvl ', async () => {
    const lockdropDetails = {
      lockdrops: [],
      totalHdkTokens: BigDecimal.from(3000),
      totalUserHdkToClaim: BigDecimal.from(300),
      totalUserValueLocked: BigDecimal.from(1332),
    }

    const lockdropTvl = {
      totalValueLocked: BigDecimal.from(6124),
      totalValueLockedWithWeights: BigDecimal.from(12084),
    }

    await expectSaga(updateLockdrop)
      .withReducer(
        combineReducers({
          [StoreKeys.LockDrop]: lockDropReducer,
          [StoreKeys.Network]: networkReducer,
          [StoreKeys.Wallet]: walletReducer,
        }),
      )
      .withState({
        [StoreKeys.Network]: {
          applicationChainId: Network.GodwokenTestnet,
        },
        [StoreKeys.Wallet]: {
          ethAddress: '0x123',
        },
      })
      .provide([
        [call.fn(getUserLocksDetails), lockdropDetails],
        [call.fn(getLockdropTVL), lockdropTvl],
      ])
      .hasFinalState({
        [StoreKeys.LockDrop]: {
          lockDrops: {
            ids: [],
            entities: {},
          },
          totalUserHdkToClaim: lockdropDetails.totalUserHdkToClaim,
          totalUserValueLocked: lockdropDetails.totalUserValueLocked,
          totalHdkTokens: BigDecimal.from(0),
          lockdropTvl,
        },
        [StoreKeys.Network]: {
          applicationChainId: Network.GodwokenTestnet,
        },
        [StoreKeys.Wallet]: {
          ethAddress: '0x123',
        },
      })
      .run()
  })
})
