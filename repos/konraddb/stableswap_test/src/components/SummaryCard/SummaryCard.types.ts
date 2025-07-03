import { ISummaryToken } from '@components/SummaryModule/SummaryModule.type'

export interface ISummaryCardProps {
  label: string
  additionalLabel?: string
  tokens: ISummaryToken[]
  isFetching?: boolean
  error?: string
}
