import { IChain } from '@interfaces/core'

export interface IChainSelectorProps {
  label: string
  chains: IChain[]
  selectedChain: IChain
  handleChainClick: (chain: IChain) => void
}
