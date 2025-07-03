import { ethers } from 'ethers-v6'
import { cancelIntent, SignedIntentId } from './cancel.service'
import { arrayify } from 'ethers/lib/utils'
import { utils } from 'ethers'
import { KHALANI_PRIVATE_KEY_HEX } from '../../e2e/config'

describe.skip('cancelIntent', () => {
  it.skip('should return result on success from live API', async () => {
    const intentId =
      '0x5d6193f1219df987d17b932935384d7a354ab2965d8e02b75a4735a2b8da954d'

    const privateKey = KHALANI_PRIVATE_KEY_HEX
    const wallet = new ethers.Wallet(privateKey)

    const message =
      '0x5d6193f1219df987d17b932935384d7a354ab2965d8e02b75a4735a2b8da954d'

    const messageBytes = arrayify(message)

    const signatureHex = await wallet.signMessage(messageBytes)
    const { r, s, v } = utils.splitSignature(signatureHex)

    const signatureObject = { r, s, v }

    const signedIntentId: SignedIntentId = {
      intent_id: intentId,
      signature: signatureObject,
    }

    try {
      const result = await cancelIntent(signedIntentId)
      console.log('Live API response:', result)
      expect(result).toBeDefined()
    } catch (error) {
      console.error('Error in live API call:', error)
      throw error
    }
  })
})
