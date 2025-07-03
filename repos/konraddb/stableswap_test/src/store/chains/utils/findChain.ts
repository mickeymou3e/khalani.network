import { Network } from '@constants/Networks'

import { IChain } from '../chains.types'

export const findChain = (
  chains: IChain[],
  expectedChain: Network | null,
): IChain | undefined => {
  return chains.find((chain) => chain.chainId === expectedChain)
}

export const findChains = (
  chains: IChain[],
  expectedChains: Network[],
): IChain[] => {
  const foundChains = chains.filter((x) => expectedChains?.includes(x.chainId))
  return foundChains
}

export const findChainByTokenSymbol = (
  chains: IChain[],
  poolTokenSymbol: IChain['poolTokenSymbol'],
): IChain | undefined => {
  return chains.find((chain) => chain.poolTokenSymbol === poolTokenSymbol)
}
