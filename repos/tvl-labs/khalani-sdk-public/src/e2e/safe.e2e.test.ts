import { Sdk } from '../sdk'
import { JsonRpcProvider, Wallet } from 'ethers-v6'
import { E2E_PRIVATE_KEY_HEX } from './config'
import { increaseJestTimeout } from './test.utils'
import assert from 'assert'

increaseJestTimeout()

describe('Safe E2E', () => {
  it('creates Safe account if not present already', async () => {
    const sdk = new Sdk()
    const provider = new JsonRpcProvider('https://testnet.khalani.network')
    const wallet = new Wallet(E2E_PRIVATE_KEY_HEX, provider)
    await sdk.wallet().initialize(provider, wallet)
    await sdk.safe().ensureDeployed()

    assert.notDeepEqual(sdk.safe().getAddress(), null)
    assert.deepEqual(sdk.safe().getAddress()?.length, 42)

    assert.deepEqual(sdk.safe().isDeployed(), true)
  })
})
