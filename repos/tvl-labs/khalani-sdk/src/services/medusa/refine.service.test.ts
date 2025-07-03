import { FillStructure, OutcomeAssetStructure } from '@interfaces/outcome'
import {
  createRefinementRequest,
  queryRefinementRequest,
} from './refine.service'

describe.skip('Refinement Requests (Live)', () => {
  describe('queryRefinementRequest', () => {
    it('should return result on success from live API', async () => {
      const params =
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'

      try {
        const result = await queryRefinementRequest(params)
        console.log('Live API response:', result)
        expect(result).toBeDefined()
      } catch (error) {
        console.error('Error in live API call:', error)
        throw error
      }
    })
  })

  describe('createRefinementRequest', () => {
    it('should create refinement successfully with live API', async () => {
      const params = {
        author: '0x54A8D8bf37039eCB70139e4C6eb7B6350CCDC60e',
        ttl: 1728390902n,
        nonce: 1728389102n,
        srcMToken: '0x7342C34Ee0d0bcd6C7508FB0721E5028B94B9E3C',
        srcAmount: 10000000000000000000n,
        outcome: {
          mTokens: ['0xae9e784C31ff91bd08dD64082A3F53CCCA639c58'],
          mAmounts: [10000000000000000000n],
          outcomeAssetStructure: OutcomeAssetStructure.AnySingle,
          fillStructure: FillStructure.Exact,
        },
      }

      try {
        const result = await createRefinementRequest(params)
        console.log('Live API response for createRefinementRequest:', result)
        expect(result).toBeDefined()
      } catch (error) {
        console.error('Error in live API call:', error)
        throw error
      }
    })
  })
})
