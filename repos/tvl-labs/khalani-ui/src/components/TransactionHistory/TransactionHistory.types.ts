export interface TransactionHistoryProps {
  transactions: TransactionHistory[]
  onClick: (transactionHash: string) => void
}

interface TransactionHistory {
  id: string
  type: TransactionType
  time: string
  sourceTokens: TransactionHistoryToken[]
  amounts: bigint[]
  hash: string
  destinationToken?: TransactionHistoryToken
}

interface TransactionHistoryToken {
  symbol: string
  network: string
  decimals?: number
}

export enum TransactionType {
  BRIDGE = 'Bridge',
  APPROVE = 'Approve',
  PROVIDE_LIQUIDITY = 'Provide liquidity',
  WITHDRAW_LIQUIDITY = 'Withdraw liquidity',
}
