import { UIIntentParams } from '@store/swaps'

export interface BuildOutcomeParams
  extends Omit<UIIntentParams, 'mTokens' | 'srcMToken'> {
  srcToken: string
}
