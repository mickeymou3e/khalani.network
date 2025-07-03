import { Network } from '@constants/Networks'
import { IChain } from '../chains.types'

export const findChain = (
  chains: IChain[],
  expectedChain: Network | null,
): IChain | undefined => chains.find((chain) => chain.chainId === expectedChain)

export const findChains = (
  chains: IChain[],
  expectedChains: Network[],
): IChain[] => chains.filter((x) => expectedChains?.includes(x.chainId))

export const findChainByTokenSymbol = (
  chains: IChain[],
  poolTokenSymbol: string | undefined,
): IChain | undefined =>
  chains.find((chain) =>
    chain.poolTokenSymbols?.includes(poolTokenSymbol ?? ''),
  )
