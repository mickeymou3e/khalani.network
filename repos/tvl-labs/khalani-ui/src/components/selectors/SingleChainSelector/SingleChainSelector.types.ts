import { IChain } from '@interfaces/core'

export interface SingleChainSelectorProps {
  chains: IChain[]
  selectedChain: IChain | undefined
  handleChainChange: (chain: IChain) => void
}
