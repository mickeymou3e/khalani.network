import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga-test-plan/matchers'

import { contractsSelectors } from '@store/contracts/contracts.selectors'

import { phaseThreeUnlock } from './phaseThreeUnlock.saga'

describe('Lockdrop - Phase Three', () => {
  describe('Unlock asset', () => {
    let mockUnlock: jest.Mock

    beforeEach(() => {
      mockUnlock = jest.fn().mockImplementation(() => {
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

    it('should unlock tokens', async () => {
      await expectSaga(phaseThreeUnlock, 872)
        .provide([
          [
            select(contractsSelectors.lockDropConnector),
            {
              unlock: mockUnlock,
            },
          ],
        ])
        .run()

      expect(mockUnlock).toBeCalledTimes(1)
      expect(mockUnlock).toBeCalledWith(872)
    })
  })
})
