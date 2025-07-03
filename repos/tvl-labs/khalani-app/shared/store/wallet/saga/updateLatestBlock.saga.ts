import { apply, put, select } from 'typed-redux-saga'

import { providerSelector } from '@tvl-labs/sdk'

import { walletActions } from '../wallet.slice'

export function* updateLatestBlock(): Generator {
  const provider = yield* select(providerSelector.provider)
  if (!provider) {
    return
  }

  try {
    const latestBlock = yield* apply(provider, provider.getBlockNumber, [])
    yield* put(walletActions.updateLatestBlock(latestBlock as number))
  } catch (error) {
    console.error('Failed to update latest block', error)
  }
}
