import { IChain } from '@store/chains/chains.types'

export interface IChainSelectorBoxProps {
  selected: boolean
  chain: IChain
  disableHover?: boolean
}
