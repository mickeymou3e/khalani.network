import { decodeIntent } from '@services/decodeIntent'

import { SwapIntentBookResponse } from './types'

export const transferSwapIntentResponse = (
  swapIntent: SwapIntentBookResponse,
) => ({
  ...swapIntent,
  ...decodeIntent(swapIntent.intent),
})
