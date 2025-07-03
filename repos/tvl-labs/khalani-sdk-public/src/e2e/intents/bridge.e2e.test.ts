import { increaseJestTimeout } from '../test.utils'
import { runSwapIntentTest } from './swapIntent.test'
import { Network } from '@constants/Networks'
import { UsdTokenName } from '../../sdk/usdToken/usdTokenName'

increaseJestTimeout()

describe('intents e2e', () => {
  it('swap intent', async () => {
    console.log(`Running test: swap intent`)
    const params = {
      description: 'Without slippage',
      sourceChain: Network.ArbitrumSepolia,
      destinationChain: Network.AvalancheTestnet,
      sourceTokenName: UsdTokenName.USDC,

      destinationTokenName: UsdTokenName.USDC,
      srcAmount: BigInt(10),
    }
    await runSwapIntentTest(
      params.sourceChain,
      params.destinationChain,
      params.sourceTokenName,
      params.destinationTokenName,
      params.srcAmount,
    )
  })
})
