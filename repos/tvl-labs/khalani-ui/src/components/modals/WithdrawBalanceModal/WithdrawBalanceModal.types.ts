import { IChain } from '@interfaces/core'
import { DialogProps } from '@mui/material'

export interface ISelectWalletModalProps extends Omit<DialogProps, 'onClose'> {
  tokenSymbol: string
  sourceChain: IChain
  destinationChain: IChain
  amount: string
  tokenDecimals: number
  summaryItems: {
    id: number
    label: string
    value: React.ReactNode
  }[]
  buttonComponent: React.ReactNode
  onClose: () => void
  onSubmit: () => void
}
