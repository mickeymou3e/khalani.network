import { expectSaga } from 'redux-saga-test-plan'

import { Network } from '@constants/Networks'
import { combineReducers } from '@reduxjs/toolkit'
import { lockDropReducer } from '@store/lockDrop/lockDrop.slice'
import { networkReducer } from '@store/network/network.slice'
import { StoreKeys } from '@store/store.keys'

import { initializeLockdropPhaseOne } from './initializeLockdropPhaseOne.saga'

describe('Lockdrop - Phase One', () => {
  describe('Initialization', () => {
    it('should init phase one with necessary data', async () => {
      const { returnValue } = await expectSaga(initializeLockdropPhaseOne)
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
        .run()

      expect(returnValue).toMatchInlineSnapshot(`
        Object {
          "phaseOne": Object {
            "lock": Object {
              "amount": BigDecimal {
                "decimals": 18,
                "stringValue": "0",
                "value": Object {
                  "hex": "0x00",
                  "type": "BigNumber",
                },
              },
              "estimatedReward": BigDecimal {
                "decimals": 18,
                "stringValue": "0",
                "value": Object {
                  "hex": "0x00",
                  "type": "BigNumber",
                },
              },
              "isCalculatingReward": false,
              "isInProgress": false,
              "lockLength": 2,
              "lockLengthBoost": 1,
              "tokenAddress": "0x9904d25f1fd95a17fa90ad95901a9aede6952d85",
            },
          },
        }
      `)
    })
  })
})
