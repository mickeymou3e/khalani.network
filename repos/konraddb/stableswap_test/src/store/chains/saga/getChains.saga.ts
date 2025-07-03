import { call, put } from 'typed-redux-saga'

import { chainsActions } from '../chains.slice'
import { IChain } from '../chains.types'
import { getChains } from '../utils/getChains'

export function* getChainsSaga(): Generator {
  try {
    const networks = yield* call(getChains)
    yield* put(chainsActions.updateChains(networks as IChain[]))
    yield* put(chainsActions.initializeChainsSuccess())
  } catch (error) {
    yield* put(chainsActions.initializeChainsFailure())
    console.error(error)
  }
}
