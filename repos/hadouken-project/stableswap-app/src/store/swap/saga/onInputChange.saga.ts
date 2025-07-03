import { delay, put } from 'typed-redux-saga'

import { SWAP_PREVIEW_DELAY } from '../swap.constants'
import { swapActions } from '../swap.slice'

export function* onInputChangeSaga(): Generator {
  yield* delay(SWAP_PREVIEW_DELAY)

  yield* put(swapActions.swapPreviewRequest())
}
