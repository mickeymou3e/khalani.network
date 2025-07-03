import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'

import { getConnectedAccount } from '../../wallet.utils'
import { checkAccountConnected } from './validators'

describe('Connection Stage General Validators', () => {
  it('should return true if some account connected', async () => {
    await expectSaga(checkAccountConnected)
      .provide([[call.fn(getConnectedAccount), '0x']])
      .returns(true)
      .run()
  })

  it('should return false if no account connected', async () => {
    await expectSaga(checkAccountConnected)
      .provide([[call.fn(getConnectedAccount), null]])
      .returns(false)
      .run()
  })

  it('should return false if no account connected', async () => {
    await expectSaga(checkAccountConnected)
      .provide([
        [
          call.fn(getConnectedAccount),
          throwError(new Error('provider contracts')),
        ],
      ])
      .returns(false)
      .run()
  })
})
