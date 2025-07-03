import { BigNumber } from 'ethers'
import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga-test-plan/matchers'

import { TokenModelBalanceWithIcon } from '@hadouken-project/ui'
import { combineReducers } from '@reduxjs/toolkit'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { lockDropReducer } from '@store/lockDrop/lockDrop.slice'
import { priceInitialState, pricesReducer } from '@store/prices/prices.slice'
import { StoreKeys } from '@store/store.keys'
import { BigDecimal } from '@utils/math'

import { phaseOneCalculateEstimatedReward } from './phaseOneCalculateEstimatedReward.saga'

const TEST_TOKEN: TokenModelBalanceWithIcon = {
  id: '0x11111',
  address: '0x11111',
  balance: BigDecimal.from(20).toBigNumber(),
  decimals: 18,
  displayName: 'Token',
  name: 'Token',
  source: 'gw',
  symbol: 'TK',
}

describe('Lockdrop - Phase One', () => {
  describe('Calculate estimated reward', () => {
    it('should correctly calculate estimated reward when amount is greater than 0', async () => {
      const priceState = {
        ids: [TEST_TOKEN.address],
        entities: {
          [TEST_TOKEN.address]: {
            id: TEST_TOKEN.address,
            price: BigDecimal.from(BigNumber.from(10).pow(27), 27),
          },
        },
      }

      await expectSaga(phaseOneCalculateEstimatedReward)
        .withReducer(
          combineReducers({
            [StoreKeys.LockDrop]: lockDropReducer,
            [StoreKeys.Prices]: pricesReducer,
          }),
        )
        .withState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {
                amount: BigDecimal.from(1),
                tokenAddress: TEST_TOKEN.address,
                lockLengthBoost: 1,
                dayBoost: 2,
              },
            },
            totalHdkTokens: BigDecimal.from('30000000000000000000000'),
            lockdropTvl: {
              totalValueLockedWithWeights: BigDecimal.from(0),
            },
          },
          [StoreKeys.Prices]: {
            ...priceInitialState,
            ...priceState,
          },
        })
        .provide([
          [select(lockdropSelectors.phaseOneSelectedLockToken), TEST_TOKEN],
        ])
        .hasFinalState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {
                amount: BigDecimal.from(1),
                tokenAddress: TEST_TOKEN.address,
                lockLengthBoost: 1,
                dayBoost: 2,
                estimatedReward: BigDecimal.from('30000000000000000000000'), // first lock so user gets all hdk tokens
                isCalculatingReward: false,
              },
            },
            totalHdkTokens: BigDecimal.from('30000000000000000000000'),
            lockdropTvl: {
              totalValueLockedWithWeights: BigDecimal.from(0),
            },
          },
          [StoreKeys.Prices]: {
            ...priceInitialState,
            ...priceState,
          },
        })
        .run()
    })
    it('should not calculate reward when lock amount is equal to 0', async () => {
      const priceState = {
        ids: [TEST_TOKEN.address],
        entities: {
          [TEST_TOKEN.address]: {
            id: TEST_TOKEN.address,
            price: BigDecimal.from(BigNumber.from(10).pow(27), 27),
          },
        },
      }

      await expectSaga(phaseOneCalculateEstimatedReward)
        .withReducer(
          combineReducers({
            [StoreKeys.LockDrop]: lockDropReducer,
            [StoreKeys.Prices]: pricesReducer,
          }),
        )
        .withState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {
                amount: BigDecimal.from(0),
                tokenAddress: TEST_TOKEN.address,
                lockLengthBoost: 1,
                dayBoost: 2,
              },
            },
            totalHdkTokens: BigDecimal.from('30000000000000000000000'),
            lockdropTvl: {
              totalValueLockedWithWeights: BigDecimal.from(0),
            },
          },
          [StoreKeys.Prices]: {
            ...priceInitialState,
            ...priceState,
          },
        })
        .provide([
          [select(lockdropSelectors.phaseOneSelectedLockToken), TEST_TOKEN],
        ])
        .hasFinalState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {
                amount: BigDecimal.from(0),
                tokenAddress: TEST_TOKEN.address,
                lockLengthBoost: 1,
                dayBoost: 2,
                estimatedReward: BigDecimal.from(0), //estimatedReward 0 because lockAmount = 0
                isCalculatingReward: false,
              },
            },
            totalHdkTokens: BigDecimal.from('30000000000000000000000'),
            lockdropTvl: {
              totalValueLockedWithWeights: BigDecimal.from(0),
            },
          },
          [StoreKeys.Prices]: {
            ...priceInitialState,
            ...priceState,
          },
        })
        .run()
    })
  })
})
