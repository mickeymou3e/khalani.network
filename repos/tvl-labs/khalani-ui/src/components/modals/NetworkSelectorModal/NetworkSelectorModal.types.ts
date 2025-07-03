import { IChain } from '@interfaces/core'
import { DialogProps } from '@mui/material'

export interface INetworkSelectorModalProps
  extends Omit<DialogProps, 'onClose'> {
  chains: IChain[]
  headerText: string
  onClose: () => void
  onChainSelect?: (chain: IChain) => void
  selectedChain?: IChain
}
