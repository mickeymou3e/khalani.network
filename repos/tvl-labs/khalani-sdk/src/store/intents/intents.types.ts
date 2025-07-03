import { MedusaTransactions } from '@services/medusa/history.service'
import { Intent } from '@store/swaps'

export type IntentsParams = string
export type IntentHistory = {
  intentId: string
  transactions: MedusaTransactions
  intent: Intent
}
