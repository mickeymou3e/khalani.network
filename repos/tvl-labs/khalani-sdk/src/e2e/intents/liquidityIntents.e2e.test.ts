import { increaseJestTimeout } from '../test.utils'
import { Sdk } from '../../sdk'
import { JsonRpcProvider, Wallet } from 'ethers-v6'
import { KHALANI_PRIVATE_KEY_HEX } from '../config'
import { Network } from '@constants/Networks'

increaseJestTimeout()

describe('mTokens e2e', () => {
  it('log mToken balances', async () => {
    console.log(`Running test: log liquidity intents`)

    const sdk = new Sdk()
    const provider = new JsonRpcProvider(
      await sdk.chains().getRpcUrl(Network.Khalani),
    )
    const wallet = new Wallet(KHALANI_PRIVATE_KEY_HEX, provider)

    await sdk.wallet().initialize(provider, wallet)
    await sdk.transactionHistory().updateIntentsHistory()

    const liquidityIntents = await sdk
      .transactionHistory()
      .getLiquidityIntents()

    console.log('Liquidity intents:', liquidityIntents)
  })
})
