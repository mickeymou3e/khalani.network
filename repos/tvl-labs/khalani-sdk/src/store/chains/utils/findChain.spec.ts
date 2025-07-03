import config from '@config'
import { Network } from '@constants/Networks'
import { IChain } from '../chains.types'
import { findChain, findChainByTokenSymbol, findChains } from './findChain'

describe('findChain utils', () => {
  const chains = config.supportedChains as IChain[]
  it('finding specific chain', async () => {
    const expectedChain = Network.ArbitrumSepolia
    const result = findChain(chains, expectedChain)
    expect(result?.chainId).toBe(expectedChain)
  })
  it('finding several specific chains', async () => {
    const expectedChains = [Network.ArbitrumSepolia, Network.AvalancheTestnet]
    const result = findChains(chains, expectedChains)
    expect(result).toHaveLength(2)
  })
  it('finding specific chain by pool token symbol', async () => {
    const poolTokenSymbol = 'USDT.arbitrum'
    const result = findChainByTokenSymbol(chains, poolTokenSymbol)
    expect(result).toHaveProperty('id', 421614)
  })
})
