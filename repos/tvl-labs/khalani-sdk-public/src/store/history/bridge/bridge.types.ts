import { IntentEntity } from '@graph/history/types'
import { MedusaHistory } from '@services/medusa/history.service'

export type BridgeHistory = {
  intentEntity: IntentEntity
  history: MedusaHistory
}
