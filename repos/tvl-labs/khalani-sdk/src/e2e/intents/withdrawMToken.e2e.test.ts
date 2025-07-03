import { increaseJestTimeout } from '../test.utils'
import { Sdk } from '../../sdk'
import { JsonRpcProvider, Wallet } from 'ethers-v6'
import { KHALANI_PRIVATE_KEY_HEX } from '../config'
import { Network } from '@constants/Networks'
import { Amount } from '../../sdk/amount'

increaseJestTimeout()

describe('mTokens e2e', () => {
  it('log mToken balances', async () => {
    console.log(`Running test: log mToken balances`)

    const sdk = new Sdk()
    const provider = new JsonRpcProvider(
      await sdk.chains().getRpcUrl(Network.Khalani),
    )
    const wallet = new Wallet(KHALANI_PRIVATE_KEY_HEX, provider)

    await sdk.wallet().initialize(provider, wallet)
    await sdk.tokens().updateMTokenBalances()

    const amount = Amount.fromUserUnits(BigInt(10), 18)

    const payload = {
      from: wallet.address,
      mToken: '0xeE37F7f98d003C2474310EC27529297bBEAd61Ef',
      amount: amount.baseUnits,
    }

    await sdk.intents().withdrawMToken(payload)
  })
})
