import { all, call, put } from 'typed-redux-saga'

import { initializeChainsSaga } from '@store/chains/chains.initialize.saga'
import { initializeHistorySaga } from '@store/history/history.initialize.saga'
import { initializeKhalaTokensSaga } from '@store/khala/tokens/tokens.initialize.saga'
import { initializePoolsSaga } from '@store/pool/saga/initialize/initialize.saga'
import { initializeTokensSaga } from '@store/tokens/tokens.initialize.saga'
import {
  ConnectionStageStatus,
  ConnectionStageType,
} from '@store/wallet/connection/types'
import { walletActions } from '@store/wallet/wallet.slice'

import { initializeStoreActions } from './initializeStore.slice'

export function* initializeStoreSaga(): Generator {
  try {
    yield* put(
      walletActions.changeConnectionStage({
        type: ConnectionStageType.Idle,
        status: ConnectionStageStatus.Pending,
      }),
    )

    yield* all([
      call(initializeChainsSaga),
      call(initializeTokensSaga),
      call(initializePoolsSaga),
      call(initializeHistorySaga),
      call(initializeKhalaTokensSaga),
    ])

    yield* put(initializeStoreActions.initializeStoreSuccess())
  } catch (error) {
    console.error(error)
    yield* put(initializeStoreActions.initializeStoreFailure())
  }
}
