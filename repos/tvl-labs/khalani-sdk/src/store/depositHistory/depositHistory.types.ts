import { MedusaTransactions } from '@services/medusa/history.service'
import { Intent } from '@store/swaps'

export type DepositHistoryParams = string
export type DepositHistory = {
  intentId: string
  transactions: MedusaTransactions
  intent: Intent
}
