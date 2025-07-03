import { all, call, put } from 'typed-redux-saga'

import { initializeHistorySaga } from '@store/history/history.initialize.saga'
import { fetchLendingReservesSaga } from '@store/lending/saga/fetchLendingReserves.saga'
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

    yield* call(fetchLendingReservesSaga)

    yield* all([
      call(initializeTokensSaga),
      call(initializePoolsSaga),
      call(initializeHistorySaga),
    ])

    yield* put(initializeStoreActions.initializeStoreSuccess())
  } catch (error) {
    console.error(error)
    yield* put(initializeStoreActions.initializeStoreFailure())
  }
}
