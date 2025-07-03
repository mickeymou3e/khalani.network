import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga-test-plan/matchers'

import { combineReducers } from '@reduxjs/toolkit'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { lockDropReducer } from '@store/lockDrop/lockDrop.slice'
import { LockLength } from '@store/lockDrop/lockDrop.types'
import { StoreKeys } from '@store/store.keys'
import { walletInitState } from '@store/wallet/wallet.slice'
import { BigDecimal } from '@utils/math'

import { phaseOneLock } from './phaseOneLock.saga'

const TEST_TOKEN = {
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
  describe('Lock', () => {
    let mockLockFunction: jest.Mock

    beforeEach(() => {
      mockLockFunction = jest.fn().mockImplementation(() => {
        return {
          wait() {
            return null
          },
        }
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it('should execute lock transaction with correct arguments', async () => {
      await expectSaga(phaseOneLock)
        .withReducer(
          combineReducers({
            [StoreKeys.LockDrop]: lockDropReducer,
          }),
        )
        .withState({
          [StoreKeys.LockDrop]: {
            phaseOne: {
              lock: {
                amount: BigDecimal.from(10),
                tokenAddress: TEST_TOKEN.address,
                lockLength: LockLength.OneMonth,
              },
            },
          },
          [StoreKeys.Wallet]: walletInitState,
        })
        .provide([
          [select(lockdropSelectors.phaseOneSelectedLockToken), TEST_TOKEN],
          [
            select(contractsSelectors.lockDropConnector),
            {
              lock: mockLockFunction,
            },
          ],
        ])
        .run()

      expect(mockLockFunction).toBeCalledTimes(1)
      expect(mockLockFunction).toBeCalledWith(
        TEST_TOKEN.address,
        BigDecimal.from(10).toBigNumber(),
        LockLength.OneMonth,
      )
    })
  })
})
