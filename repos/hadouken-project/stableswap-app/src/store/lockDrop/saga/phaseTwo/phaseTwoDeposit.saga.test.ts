import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga-test-plan/matchers'

import { combineReducers } from '@reduxjs/toolkit'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { StoreKeys } from '@store/store.keys'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletReducer } from '@store/wallet/wallet.slice'
import { BigDecimal } from '@utils/math'

import { phaseTwoDeposit } from './phaseTwoDeposit.saga'

describe('Lockdrop - Phase Two', () => {
  describe('Deposit tokens', () => {
    let mockDeposit: jest.Mock

    beforeEach(() => {
      mockDeposit = jest.fn().mockImplementation(() => {
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

    it('should deposit hdk and eth tokens', async () => {
      await expectSaga(
        phaseTwoDeposit,
        BigDecimal.from(10),
        BigDecimal.from(1),
        false,
      )
        .withReducer(
          combineReducers({
            [StoreKeys.Wallet]: walletReducer,
          }),
        )
        .provide([
          [select(walletSelectors.userAddress), '0x123'],
          [
            select(contractsSelectors.lockDropConnector),
            {
              depositPhaseTwo: mockDeposit,
            },
          ],
        ])
        .run()

      expect(mockDeposit).toBeCalledTimes(1)
      expect(mockDeposit).toBeCalledWith(
        BigDecimal.from(10).toBigNumber(),
        BigDecimal.from(1).toBigNumber(),
      )
    })
    it('should handle native eth and use payable', async () => {
      await expectSaga(
        phaseTwoDeposit,
        BigDecimal.from(10),
        BigDecimal.from(1),
        true,
      )
        .withReducer(
          combineReducers({
            [StoreKeys.Wallet]: walletReducer,
          }),
        )
        .provide([
          [select(walletSelectors.userAddress), '0x123'],
          [
            select(contractsSelectors.lockDropConnector),
            {
              depositPhaseTwo: mockDeposit,
            },
          ],
        ])
        .run()

      expect(mockDeposit).toBeCalledTimes(1)
      expect(mockDeposit).toBeCalledWith(BigDecimal.from(10).toBigNumber(), 0, {
        value: BigDecimal.from(1).toBigNumber(),
      })
    })
  })
})
