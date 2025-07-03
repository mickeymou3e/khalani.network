import { FillStructure, OutcomeAssetStructure } from '@interfaces/outcome'
import { placeIntentRequest } from './place.service'

describe.skip('placeIntentRequest', () => {
  it('should return result on success from live API', async () => {
    const params = {
      intent: {
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
      },
      signature:
        '0xa5e3cf9f89f026673ba445ff09710294d327d7cf88219a0222f4fa252ee1d9207d2b66b984a70fcbc337282c90aafd8798d948e8efcfb4fe01abe4c3cd10caca1b',
    }

    try {
      const result = await placeIntentRequest(params)
      console.log('Live API response:', result)
      expect(result).toBeDefined()
    } catch (error) {
      console.error('Error in live API call:', error)
      throw error
    }
  })
})
