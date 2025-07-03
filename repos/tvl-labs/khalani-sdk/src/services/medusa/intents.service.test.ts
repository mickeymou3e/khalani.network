import { getIntentIdsByAuthor, getIntents } from './intents.service'

describe('get getIntents service', () => {
  it.skip('getIntents: should return result on success from live API', async () => {
    try {
      const result = await getIntents()
      console.log('Live API response:', result)
      expect(result).toBeDefined()
    } catch (error) {
      console.error('Error in live API call:', error)
      throw error
    }
  })

  it.skip('getIntentIdsByAuthor: should return result on success from live API', async () => {
    try {
      const author = '0xc13113E56E00050327Be3AD164185103541f1903'
      const result = await getIntentIdsByAuthor(author)
      console.log('Live API response:', result)
      expect(result).toBeDefined()
    } catch (error) {
      console.error('Error in live API call:', error)
      throw error
    }
  })
})
