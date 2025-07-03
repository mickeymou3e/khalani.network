import { IChain } from '@store/chains/chains.types'

export interface IChainSelectorProps {
  label: string
  chains: IChain[]
  selectedChain: IChain
  handleChainClick: (chain: IChain) => void
}
