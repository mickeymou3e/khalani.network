import { all, apply, call, put, select } from 'typed-redux-saga'

import { getProvider } from '@hadouken-project/lending-contracts'
import { fetchBackstopPools } from '@store/backstop/fetchBackstopPools/fetchBackstopPools.saga'
import { balancesActions } from '@store/balances/balances.slice'
import { providerActions } from '@store/provider/provider.slice'
import { initializeReservesSagaRpcCall } from '@store/reserves/reserves.initialize.saga'
import { reservesActions } from '@store/reserves/reserves.slice'
import { initializeTokensSagaRpcCall } from '@store/tokens/tokens.initialize.saga'
import { tokensActions } from '@store/tokens/tokens.slice'
import { userDataActions } from '@store/userData/userData.slice'
import { waitForChainToBeSet } from '@store/wallet/actions/metaMaskObserver.event'
import { ENVIRONMENT } from '@utils/stringOperations'

import { historyActions } from '../history/history.slice'
import { walletSelectors } from '../wallet/wallet.selector'
import { initializeStoreActions } from './initializeStore.slice'

export function* initializeStoreSaga(): Generator {
  try {
    yield* call(waitForChainToBeSet)

    const applicationChainId = yield* select(walletSelectors.applicationChainId)
    const web3Provider = getProvider(applicationChainId)(ENVIRONMENT, false)

    const currentBlockNumber = yield* apply(
      web3Provider,
      web3Provider.getBlockNumber,
      [],
    )

    yield* all([
      call(initializeReservesSagaRpcCall),
      call(initializeTokensSagaRpcCall),
    ])

    // It is separated because logic depend on tokens
    yield* call(fetchBackstopPools)

    yield* put(providerActions.updateLatestBlock(currentBlockNumber))

    yield* put(initializeStoreActions.initializeStoreSuccess())
  } catch (error) {
    yield* put(initializeStoreActions.initializeStoreFailure())
  }
}

export function* resetStoreSaga(): Generator {
  yield* put(reservesActions.resetReserves())
  yield* put(tokensActions.resetTokens())
  yield* put(balancesActions.resetBalances())
  yield* put(historyActions.clearTransactions())
  yield* put(userDataActions.clearUserData())
}
