import { BigNumber } from 'ethers'
import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'

import { combineReducers } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { BigDecimal } from '@utils/math'

import { lockDropReducer } from '../lockDrop.slice'
import { fetchUserLockdropLpTokens } from './fetchUserLockdropLpTokens.saga'
import { updateLockdropUserClaimedLpTokens } from './updateLockdropUserClaimedLpTokens.saga'

describe('Update user lp tokens ', () => {
  it('should update user claimed lp tokens', async () => {
    const claimedLpTokensBalances = {
      totalUserLpTokensAvailableToClaim: BigNumber.from(10),
      userLpClaimed: BigNumber.from(1),
      currentAvailableLpTokens: BigNumber.from(2),
    }

    await expectSaga(updateLockdropUserClaimedLpTokens)
      .withReducer(
        combineReducers({
          [StoreKeys.LockDrop]: lockDropReducer,
        }),
      )
      .withState({
        [StoreKeys.LockDrop]: {
          phaseThree: {
            claimLps: {},
          },
        },
      })
      .provide([[call.fn(fetchUserLockdropLpTokens), claimedLpTokensBalances]])
      .hasFinalState({
        [StoreKeys.LockDrop]: {
          phaseThree: {
            claimLps: {
              currentAvailableLpTokens: BigDecimal.from(
                claimedLpTokensBalances.currentAvailableLpTokens,
              ),
              userLpClaimed: BigDecimal.from(
                claimedLpTokensBalances.userLpClaimed,
              ),
            },
          },
        },
      })
      .run()
  })
})
