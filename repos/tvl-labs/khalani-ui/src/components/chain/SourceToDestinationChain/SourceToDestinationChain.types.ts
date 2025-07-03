import { IChain } from '@interfaces/core'

export interface ISourceToDestinationChainProps {
  sourceChain: IChain
  destinationChain: IChain
  destinationChains?: IChain[]
  onSourceChainClick?: () => void
  onDestinationChainClick?: () => void
}
