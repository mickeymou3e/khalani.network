import { increaseJestTimeout } from '../test.utils'
import { Sdk } from '../../sdk'
import { JsonRpcProvider, Wallet } from 'ethers-v6'
import { KHALANI_PRIVATE_KEY_HEX } from '../config'
import { Network } from '@constants/Networks'

increaseJestTimeout()

describe('cancelIntent e2e', () => {
  it('cancelIntent', async () => {
    console.log(`Running test: cancel intent`)

    const sdk = new Sdk()
    const provider = new JsonRpcProvider(
      await sdk.chains().getRpcUrl(Network.Khalani),
    )
    const wallet = new Wallet(KHALANI_PRIVATE_KEY_HEX, provider)

    await sdk.wallet().initialize(provider, wallet)
    await sdk.tokens().updateIntentBalances()

    const payload = {
      intentId:
        '0x1efb42749fb64e4f5b1ba72f5279edee744d72d733b6ace26896116c501c1f97',
    }

    await sdk.intents().withdrawIntentBalance(payload)
  })
})
