import { ILPBalanceProps } from '@components/Boxes/LPBalance'
import { ITokenInSummaryProps } from '@components/Boxes/TokenInSummary'

export interface IInvestmentPreviewProps extends ILPBalanceProps {
  title: string
  label: string
  outputAmount: string
  tokens: ITokenInSummaryProps[]
}
