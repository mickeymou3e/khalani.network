import { IChain } from '@interfaces/core'

export interface ChainSelectorPopoverProps {
  chains: IChain[]
  open: boolean
  anchorEl: HTMLButtonElement | HTMLDivElement | null
  selectedChainId: number | undefined
  handleChainSelect: (chain: IChain) => void
  handleClose: () => void
}
