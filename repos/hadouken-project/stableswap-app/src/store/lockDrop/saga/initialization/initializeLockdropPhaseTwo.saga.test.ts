import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'

import { Network } from '@constants/Networks'
import { address } from '@dataSource/graph/utils/formatters'
import { combineReducers } from '@reduxjs/toolkit'
import { lockDropReducer } from '@store/lockDrop/lockDrop.slice'
import { networkReducer } from '@store/network/network.slice'
import { StoreKeys } from '@store/store.keys'
import { tokensReducer } from '@store/tokens/tokens.slice'
import { BigDecimal } from '@utils/math'

import { getDepositedTokensBalances } from '../fetchDepositedTokensBalances.saga'
import { getDistributedHDKTokensOnChain } from '../fetchDistributedHDKTokensOnChain.saga'
import { getParticipation } from '../fetchParticipation.saga'
import { initializeLockdropPhaseTwo } from './intializeLockdropPhaseTwo.saga'

describe('Lockdrop - Phase Two', () => {
  describe('Initialization', () => {
    it('should init phase two with necessary data', async () => {
      const hdkToken = address('0xB314aebeB775D3D0F3b6487D519FB026f443D65d')
      const priceToken = address('0x0eb76790a2014dd1f65488ccd703bcdf75f8195e')
      const tokensState = {
        ids: [hdkToken, priceToken],
        entities: {
          [hdkToken]: {
            id: hdkToken,
            address: hdkToken,
            name: 'HDK',
            symbol: 'HDK',
            decimals: 18,
            displayName: 'HDK',
          },
          [priceToken]: {
            id: priceToken,
            address: priceToken,
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
            displayName: 'ETH',
          },
        },
      }
      const { returnValue } = await expectSaga(initializeLockdropPhaseTwo)
        .withReducer(
          combineReducers({
            [StoreKeys.LockDrop]: lockDropReducer,
            [StoreKeys.Network]: networkReducer,
            [StoreKeys.Tokens]: tokensReducer,
          }),
        )
        .withState({
          [StoreKeys.Network]: {
            applicationChainId: Network.GodwokenTestnet,
          },
          [StoreKeys.Tokens]: {
            ...tokensState,
          },
        })
        .provide([
          [call.fn(getDistributedHDKTokensOnChain), BigDecimal.from(100)],
          [call.fn(getParticipation), BigDecimal.from(40, 2)],
          [
            call.fn(getDepositedTokensBalances),
            {
              totalHdkDepositAmount: BigDecimal.from(30),
              totalPriceTokenDepositAmount: BigDecimal.from(1),
              userPriceTokenDepositAmount: BigDecimal.from(10),
              userHdkDepositAmount: BigDecimal.from(1),
            },
          ],
        ])
        .run()

      expect(returnValue).toMatchInlineSnapshot(`
        Object {
          "phaseTwo": Object {
            "deposit": Object {
              "isInProgress": false,
              "tokens": Array [
                Object {
                  "address": "0x0eb76790a2014dd1f65488ccd703bcdf75f8195e",
                  "amount": undefined,
                  "decimals": 18,
                  "displayName": "ETH",
                  "id": "0x0eb76790a2014dd1f65488ccd703bcdf75f8195e",
                  "name": "ETH",
                  "symbol": "ETH",
                },
                Object {
                  "address": "0xb314aebeb775d3d0f3b6487d519fb026f443d65d",
                  "amount": undefined,
                  "decimals": 18,
                  "displayName": "HDK",
                  "id": "0xb314aebeb775d3d0f3b6487d519fb026f443d65d",
                  "name": "HDK",
                  "symbol": "HDK",
                },
              ],
              "tokensAmount": Object {
                "0x0eb76790a2014dd1f65488ccd703bcdf75f8195e": undefined,
                "0xb314aebeb775d3d0f3b6487d519fb026f443d65d": undefined,
              },
            },
            "lockdropDepositBalances": Object {
              "totalHdkDepositAmount": BigDecimal {
                "decimals": 18,
                "stringValue": "0.00000000000000003",
                "value": Object {
                  "hex": "0x1e",
                  "type": "BigNumber",
                },
              },
              "totalPriceTokenDepositAmount": BigDecimal {
                "decimals": 18,
                "stringValue": "0.000000000000000001",
                "value": Object {
                  "hex": "0x01",
                  "type": "BigNumber",
                },
              },
              "userHdkDepositAmount": BigDecimal {
                "decimals": 18,
                "stringValue": "0.000000000000000001",
                "value": Object {
                  "hex": "0x01",
                  "type": "BigNumber",
                },
              },
              "userPriceTokenDepositAmount": BigDecimal {
                "decimals": 18,
                "stringValue": "0.00000000000000001",
                "value": Object {
                  "hex": "0x0a",
                  "type": "BigNumber",
                },
              },
            },
            "participationOnChain": BigDecimal {
              "decimals": 2,
              "stringValue": "0.4",
              "value": Object {
                "hex": "0x28",
                "type": "BigNumber",
              },
            },
            "totalHDKTokensOnChain": BigDecimal {
              "decimals": 18,
              "stringValue": "0.0000000000000001",
              "value": Object {
                "hex": "0x64",
                "type": "BigNumber",
              },
            },
          },
        }
      `)
    })
  })
})
