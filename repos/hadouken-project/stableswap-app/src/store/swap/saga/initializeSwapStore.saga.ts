import { call, put, select } from 'typed-redux-saga'

import { address } from '@dataSource/graph/utils/formatters'
import { waitForPoolsAndTokensBeFetched } from '@store/deposit/saga/editor/utils'
import { networkSelectors } from '@store/network/network.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { config } from '@utils/network'

import { swapActions } from '../swap.slice'

export function* initializeSwapStoreSaga(): Generator {
  yield* put(swapActions.swapPreviewRequestClean())

  yield* call(waitForPoolsAndTokensBeFetched)
  yield* call(waitForChainToBeSet)

  const applicationChainId = yield* select(networkSelectors.applicationChainId)

  const tokens = yield* select(tokenSelectors.selectTokens)

  const baseToken = tokens.find(
    (token) =>
      address(token.address) ===
      address(config.prioritizedSwapPairs[applicationChainId].baseToken),
  )

  const quoteToken = tokens.find(
    (token) =>
      address(token.address) ===
      address(config.prioritizedSwapPairs[applicationChainId].quoteToken),
  )

  if (baseToken && quoteToken) {
    yield* put(
      swapActions.initializeSwapStoreSuccess({
        baseTokenAddress: baseToken.address,
        quoteTokenAddress: quoteToken.address,
      }),
    )
  } else {
    yield* put(swapActions.initializeSwapStoreFailure())
  }
}
