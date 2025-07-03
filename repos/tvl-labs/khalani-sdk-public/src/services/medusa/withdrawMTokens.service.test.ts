import { withdrawMTokens } from './withdrawMTokens.service'

describe.skip('WithdrawMTokens service', () => {
  it.skip('withdrawMTokens: should return tx hash on success', async () => {
    const params = {
      owner: '0x54A8D8bf37039eCB70139e4C6eb7B6350CCDC60e',
      mToken: '0xe60739a948f78b9de07dd6c55b38f635ef55b819',
      amount: '1000000000000000000',
    }

    try {
      const result = await withdrawMTokens(
        params.owner as any,
        params.mToken,
        BigInt(params.amount),
      )
      console.log('Live API response:', result)
      expect(result).toBeDefined()
    } catch (error) {
      console.error('Error in live API call:', error)
      throw error
    }
  })
})
