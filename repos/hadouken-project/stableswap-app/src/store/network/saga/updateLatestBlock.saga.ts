import { apply, put, select } from 'typed-redux-saga'

import { networkActions } from '@store/network/network.slice'
import { providerSelector } from '@store/provider/provider.selector'

export function* updateLatestBlock(): Generator {
  const provider = yield* select(providerSelector.provider)

  if (provider) {
    const latestBlockNumber = yield* apply(
      provider,
      provider.getBlockNumber,
      [],
    )

    yield* put(
      networkActions.updateLatestBlock({
        latestBlock: latestBlockNumber,
      }),
    )
  }
}
