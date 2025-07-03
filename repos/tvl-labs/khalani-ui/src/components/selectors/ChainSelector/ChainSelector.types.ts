import { IChain } from '@interfaces/core'

export interface IChainSelectorProps {
  handleOriginChainChange: (chain: IChain) => void
  handleDestinationChainChange: (chain: IChain) => void
  handleSwapButtonClick: () => void
  originChains?: IChain[]
  destinationChains?: IChain[]
  selectedOriginChain?: IChain
  selectedDestinationChain?: IChain
}
