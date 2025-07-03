import { IChain } from '@interfaces/core'

export interface INetworkDetailsProps {
  chains?: IChain[]
  onChainSelect: (chain: IChain) => void
  selectedChainId?: IChain['id']
}
