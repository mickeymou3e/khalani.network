import { ILPBalanceProps } from '@components/Boxes/LPBalance'
import { ITokenInSummaryProps } from '@components/Boxes/TokenInSummary'
import { IModal } from '@interfaces/core'

export interface IInvestmentPreviewModalProps extends IModal, ILPBalanceProps {
  title: string
  label: string
  outputAmount: string
  tokens: ITokenInSummaryProps[]
  handleConfirm: () => void
}
