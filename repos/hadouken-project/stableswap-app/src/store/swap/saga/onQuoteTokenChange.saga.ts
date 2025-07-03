import { BigNumber } from 'ethers'
import { put, select } from 'typed-redux-saga'

import { swapSelectors } from '../swap.selector'
import { swapActions } from '../swap.slice'

export function* onQuoteTokenChange(): Generator {
  const inputTokenAmount = yield* select(swapSelectors.baseTokenValue)

  if (inputTokenAmount?.toBigNumber().gt(BigNumber.from(0))) {
    yield* put(swapActions.swapPreviewRequest())
  }
}
