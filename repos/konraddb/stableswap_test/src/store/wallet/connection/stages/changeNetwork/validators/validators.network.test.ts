import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga-test-plan/matchers'

import { chainsSelectors } from '@store/chains/chains.selector'
import { networkSelectors } from '@store/network/network.selector'

import {
  checkExpectedNetwork,
  checkReloadedNetwork,
  checkSupportedNetwork,
} from './validators'

describe('Connection Stage Change Network Validators', () => {
  it('should return true if expected network selected', async () => {
    expectSaga(checkExpectedNetwork)
      .provide([[select(networkSelectors.isExpectedNetwork), true]])
      .run()
      .then((res) => {
        expect(res.returnValue).toBe(true)
      })
  })

  it('should return true if is supported network', async () => {
    const chainIds = ['0x5', '0xa869', '0x116e9', '0x271c']
    const network = '0x116e9'
    expectSaga(checkSupportedNetwork)
      .provide([
        [select(chainsSelectors.chainsIds), chainIds],
        [select(networkSelectors.network), network],
      ])
      .run()
      .then((res) => {
        expect(res.returnValue).toBe(true)
      })
  })

  it('should return true if is initialized network', async () => {
    expectSaga(checkReloadedNetwork)
      .provide([[select(networkSelectors.isReloaded), true]])
      .run()
      .then((res) => {
        expect(res.returnValue).toBe(true)
      })
  })
})
