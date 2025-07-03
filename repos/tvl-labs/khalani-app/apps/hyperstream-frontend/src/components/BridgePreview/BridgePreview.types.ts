import { TokenModelBalanceWithChain } from '@tvl-labs/sdk'

export interface IBridgePreviewProps {
  modalOpen: boolean
  onModalClose: () => void
  tokens: TokenModelBalanceWithChain[]
  amounts: (bigint | undefined)[]
  payload?: any
}
