export interface ISummaryToken {
  id: string
  symbol: string
  displayValue: string
}

export interface ISummaryModuleProps {
  title: string
  description: string
  sendLabel: string
  receiveLabel: string
  sendTokens: ISummaryToken[]
  receiveTokens: ISummaryToken[]
  sendAdditionalLabel?: string
  receiveAdditionalLabel?: string
  sendWarning?: string
  isFetching?: boolean
  errorMessage?: string
}
