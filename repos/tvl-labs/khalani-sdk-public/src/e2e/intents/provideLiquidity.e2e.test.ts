import { increaseJestTimeout } from '../test.utils'
import { Network } from '@constants/Networks'
import { UsdTokenName } from '../../sdk/usdToken/usdTokenName'
import { runProvideLiquidityTest } from './provideLiquidity.test'

increaseJestTimeout()

describe('intents e2e', () => {
  it('provide liquidity', async () => {
    console.log(`Running test: provide liquidity`)
    const params = {
      description: 'With feePercentage of 2%',
      sourceChain: Network.AvalancheTestnet,
      destinationChains: [Network.ArbitrumSepolia],
      sourceTokenName: UsdTokenName.USDC,
      srcAmount: BigInt(10),
      feePercentage: 0.02, // 2% fee
    }
    await runProvideLiquidityTest(
      params.sourceChain,
      params.destinationChains,
      params.sourceTokenName,
      params.srcAmount,
      params.feePercentage,
    )
  })
})
