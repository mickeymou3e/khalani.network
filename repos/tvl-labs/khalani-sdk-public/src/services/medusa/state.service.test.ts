import { getIntentStatus } from './state.service'

describe.skip('State service', () => {
  it('getIntentStatus: should return result on success from live API', async () => {
    const intentId =
      '0xd3953e82895d1f543d191c40612582525fa076338d52aa28498c815e20aac159'

    try {
      const result = await getIntentStatus(intentId)
      console.log('Live API response:', result)
      expect(result).toBeDefined()
    } catch (error) {
      console.error('Error in live API call:', error)
      throw error
    }
  })
})
