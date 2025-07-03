export interface TransactionCompleteProps {
  open: boolean
  onClose: () => void
  text: string
  sourceNetworkId: number
  destinationNetworkId: number
  tokenAmount: bigint
  tokenSymbol: string
  tokenDecimals: number
}
