import { MedusaHistory } from '@services/medusa/history.service'
import { IntentHistory } from './intents.types'
import { mapMedusaIntent } from '@store/swaps/create/create.mappers'

export const mapToIntentHistory = (
  history: MedusaHistory,
  intentId: string,
): IntentHistory => {
  const [transactions, intent] = history

  return {
    intentId,
    transactions,
    intent: mapMedusaIntent(intent),
  }
}
