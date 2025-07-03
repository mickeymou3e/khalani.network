import config from '@config'
import { Network } from '@constants/Networks'
import { IChain } from '@store/chains/chains.types'
import { TokenModelBalanceWithChain } from '@store/tokens/tokens.types'
import { tokenAmountsMultiCall } from './multicall'

jest.setTimeout(60 * 1000)

describe('tokenAmountsMulticall utils', () => {
  let tokens: TokenModelBalanceWithChain[]
  let chains: IChain[]
  let fujiTokens: TokenModelBalanceWithChain[]
  let fujiChain: IChain | undefined

  beforeAll(async () => {
    try {
      tokens = config.tokens as unknown as TokenModelBalanceWithChain[]
      chains = config.supportedChains as unknown as IChain[]
    } catch (error) {
      throw new Error(
        `Seems mocks are configured incorrectly or not running in tests. Can't find tokens and chains data`,
      )
    }

    fujiTokens = tokens.filter(
      (token) => token.chainId === Network.AvalancheTestnet,
    )
    fujiChain = chains.find(
      (chain) => chain.chainId === Network.AvalancheTestnet,
    )
  })
  it('should return expected result', async () => {
    const context = await tokenAmountsMultiCall(
      fujiTokens,
      '0x33f484D85f01DAF00354fb4B0c960a44f325Dd79',
      fujiChain?.rpcUrls ?? [],
    )

    expect(Object.keys(context.results).length).toBe(4)
  })
})
