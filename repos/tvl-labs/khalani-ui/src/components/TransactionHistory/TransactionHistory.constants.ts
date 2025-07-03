import { TransactionType } from './TransactionHistory.types'

export const transactionTypes = [
  { type: TransactionType.BRIDGE, text: 'Bridged' },
  { type: TransactionType.APPROVE, text: 'Approved' },
  { type: TransactionType.PROVIDE_LIQUIDITY, text: 'Provided Liquidity' },
  { type: TransactionType.WITHDRAW_LIQUIDITY, text: 'Withdrawn Liquidity' },
]
