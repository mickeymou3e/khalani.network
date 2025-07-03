import config from '@config'
import { waitForMinting } from './waitForMinting'
import { Network } from '@constants/Networks'
import { parseEther } from 'ethers-v6'

const fallbackFunction = () => {
  console.log('Fallback function called')
}

describe.skip('waitForMinting', () => {
  jest.setTimeout(60000)

  it('should return result on success from live API', async () => {
    const userAddress = '0xc13113E56E00050327Be3AD164185103541f1903'
    const spokeToken = config.tokens.find(
      (token) =>
        token.chainId === Network.AvalancheTestnet &&
        token.symbol.includes('USDT'),
    )
    if (!spokeToken) throw new Error('Spoke token not found')

    try {
      const result = await waitForMinting(
        {
          symbol: spokeToken.symbol,
          chainId: spokeToken.chainId,
        },
        parseEther('10'),
        userAddress,
        //Pass proper one
        {} as any,
        {} as any,
        '0x',
      )
      expect(result).toBeTruthy()
    } catch (error) {
      console.error('Error when waiting for minting:', error)
      throw error
    }
  })
})
