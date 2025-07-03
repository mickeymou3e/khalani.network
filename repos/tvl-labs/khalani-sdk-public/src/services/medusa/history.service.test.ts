import { getMedusaHistory } from './history.service'

describe.skip('get history service', () => {
  it('getHistory: should return result on success from live API', async () => {
    const intentId =
      '0x890ba31bfd6e2d545aff369e533fa71875fa9f67fa91e5ae3ee28c672639e10e'

    try {
      const result = await getMedusaHistory(intentId)
      console.log('Live API response:', result)
      expect(result).toBeDefined()
    } catch (error) {
      console.error('Error in live API call:', error)
      throw error
    }
  })
})
