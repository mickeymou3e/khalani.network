import { ENetwork, IChain } from '@interfaces/core'

export interface IChainPickerProps {
  selectedChains: ChainPickerItem[]
  chains: IChain[]
  buttonClickFn: (id: number) => void
  chainSelectedFn: (id: number) => void
}
export interface ChainPickerItem {
  id: ENetwork
  name: string
}
