import { expectSaga } from 'redux-saga-test-plan'
import { select } from 'redux-saga-test-plan/matchers'

import { contractsSelectors } from '@store/contracts/contracts.selectors'

import { phaseTwoClaim } from './phaseTwoClaim.saga'

describe('Lockdrop - Phase Two', () => {
  describe('Claim HDK', () => {
    let mockMultiClaimHDKTokensFunction: jest.Mock

    beforeEach(() => {
      mockMultiClaimHDKTokensFunction = jest.fn().mockImplementation(() => {
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

    it('should claim hdk tokens with correct lock ids', async () => {
      await expectSaga(phaseTwoClaim, [1, 2, 3])
        .provide([
          [
            select(contractsSelectors.lockDropConnector),
            {
              multiClaimHDKTokens: mockMultiClaimHDKTokensFunction,
            },
          ],
        ])
        .run()

      expect(mockMultiClaimHDKTokensFunction).toBeCalledTimes(1)
      expect(mockMultiClaimHDKTokensFunction).toBeCalledWith([1, 2, 3])
    })
  })
})
