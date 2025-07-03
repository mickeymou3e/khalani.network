import { increaseJestTimeout } from '../test.utils'
import { Sdk } from '../../sdk'
import { JsonRpcProvider, Wallet } from 'ethers-v6'
import { KHALANI_PRIVATE_KEY_HEX } from '../config'
import { Network } from '@constants/Networks'

increaseJestTimeout()

describe('mTokens e2e', () => {
  it('log mToken balances', async () => {
    console.log(`Running test: log mToken balances`)

    const sdk = new Sdk()
    const provider = new JsonRpcProvider(
      await sdk.chains().getRpcUrl(Network.Holesky),
    )
    const wallet = new Wallet(KHALANI_PRIVATE_KEY_HEX, provider)

    await sdk.wallet().initialize(provider, wallet)
    await sdk.tokens().updateMTokenBalances()

    const mTokens = await sdk.mirrorTokens().getMTokensBalances()

    console.log('MTokens', mTokens)
  })
})
