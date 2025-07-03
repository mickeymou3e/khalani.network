import { BigNumber } from 'ethers'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga-test-plan/matchers'

import { Network } from '@constants/Networks'
import { combineReducers } from '@reduxjs/toolkit'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { lockDropReducer } from '@store/lockDrop/lockDrop.slice'
import { networkReducer } from '@store/network/network.slice'
import { StoreKeys } from '@store/store.keys'

import { fetchUserLockdropLpTokens } from '../fetchUserLockdropLpTokens.saga'
import { initializeLockdropPhaseThree } from './initializeLockdropPhaseThree.saga'

describe('Lockdrop - Phase Three', () => {
  describe('Initialization', () => {
    beforeEach(() => {
      const fixedTimestamp = 1699309

      jest.spyOn(Date, 'now').mockImplementation(() => fixedTimestamp)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it('should init phase three with necessary data', async () => {
      const { returnValue } = await expectSaga(initializeLockdropPhaseThree)
        .withReducer(
          combineReducers({
            [StoreKeys.LockDrop]: lockDropReducer,
            [StoreKeys.Network]: networkReducer,
          }),
        )
        .withState({
          [StoreKeys.Network]: {
            applicationChainId: Network.GodwokenTestnet,
          },
        })
        .provide([
          [
            call.fn(fetchUserLockdropLpTokens),
            {
              currentAvailableLpTokens: BigNumber.from(1),
              totalUserLpTokensAvailableToClaim: BigNumber.from(10),
              userLpClaimed: BigNumber.from(2),
            },
          ],
          [
            select(contractsSelectors.lockDropConnector),
            {
              WITHDRAW_LP_DURATION_TIME() {
                return BigNumber.from(1699309)
              },
            },
          ],
        ])
        .run()

      expect(returnValue).toMatchInlineSnapshot(`
        Object {
          "phaseThree": Object {
            "claimLps": Object {
              "currentAvailableLpTokens": BigDecimal {
                "decimals": 18,
                "stringValue": "0.000000000000000001",
                "value": Object {
                  "hex": "0x01",
                  "type": "BigNumber",
                },
              },
              "daysLeft": 19,
              "isInProgress": false,
              "totalUserLpTokensAvailableToClaim": BigDecimal {
                "decimals": 18,
                "stringValue": "0.00000000000000001",
                "value": Object {
                  "hex": "0x0a",
                  "type": "BigNumber",
                },
              },
              "userLpClaimed": BigDecimal {
                "decimals": 18,
                "stringValue": "0.000000000000000002",
                "value": Object {
                  "hex": "0x02",
                  "type": "BigNumber",
                },
              },
            },
            "unlock": Object {},
          },
        }
      `)
    })
  })
})
