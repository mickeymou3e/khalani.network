import { Sdk } from '../sdk'
import { JsonRpcProvider, Wallet } from 'ethers-v6'
import { E2E_PRIVATE_KEY_HEX } from './config'
import { increaseJestTimeout } from './test.utils'
import { Network } from '@constants/Networks'

increaseJestTimeout()

describe('transaction history', () => {
  it('update transaction history saga', async () => {
    const sourceChain = Network.Khalani

    const sdk = new Sdk()
    const provider = new JsonRpcProvider(
      await sdk.chains().getRpcUrl(sourceChain),
    )
    const wallet = new Wallet(E2E_PRIVATE_KEY_HEX, provider)
    await sdk.wallet().initialize(provider, wallet)

    await sdk.transactionHistory().updateBridgeHistory()
    await sdk.transactionHistory().updateLiquidityHistory()

    const bridgeHistory = await sdk.transactionHistory().getBridgeHistory()
    const liquidityHistory = await sdk
      .transactionHistory()
      .getLiquidityHistory()

    console.log('Bridge history:', bridgeHistory)
    console.log('Liquidity history:', liquidityHistory)
  })
})
