import { all, apply, call, put } from 'typed-redux-saga'

import { shouldUseSubgraph } from '@graph/subgraph/queries'
import { getProvider } from '@hadouken-project/lending-contracts'
import { initializeBalancesSaga } from '@store/balances/balances.initialize.saga'
import { initializeLiquidationsSaga } from '@store/liquidation/liquidation.initialize.saga'
import { providerActions } from '@store/provider/provider.slice'
import { initializeReservesSaga } from '@store/reserves/reserves.initialize.saga'
import {
  initializeReservesSagaRpcCall,
  initializeTokensSaga,
  initializeTokensSagaRpcCall,
} from '@store/tokens/tokens.initialize.saga'
import { initializeUsersSaga } from '@store/users/users.initialize.saga'
import { getAppConfig } from '@utils/config'
import { CONTRACTS_CONFIG } from '@utils/stringOperations'

import { initializeStoreActions } from './initializeStore.slice'

export function* initializeStoreSaga(): Generator {
  try {
    const appConfig = getAppConfig()
    const providerSelector = yield* call(getProvider, appConfig.chain)
    const web3Provider = providerSelector(CONTRACTS_CONFIG, true)

    const currentBlockNumber = yield* apply(
      web3Provider,
      web3Provider.getBlockNumber,
      [],
    )

    const shouldUseGraph = yield* call(shouldUseSubgraph, currentBlockNumber)

    if (shouldUseGraph) {
      yield* all([call(initializeTokensSaga), call(initializeReservesSaga)])
    } else {
      yield* all([
        call(initializeReservesSagaRpcCall),
        call(initializeTokensSagaRpcCall),
      ])
    }

    yield* all([
      call(initializeBalancesSaga),
      call(initializeUsersSaga),
      call(initializeLiquidationsSaga),
    ])

    yield* put(providerActions.updateLatestBlock(currentBlockNumber))

    yield* put(initializeStoreActions.initializeStoreSuccess())
  } catch (error) {
    yield* put(initializeStoreActions.initializeStoreFailure())
  }
}
