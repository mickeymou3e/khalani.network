import { fetchNativeTokensBalances } from '@dataSource/nativeBalances'
import { chainsSelectors } from '@store/chains/chains.selector'
import { providerSelector } from '@store/provider/provider.selector'
import { call, put, select } from 'typed-redux-saga'

import { nativeBalancesSelectors } from '../nativeBalances.selector'
import { nativeBalancesActions } from '../nativeBalances.slice'
import { logger } from '@utils/logger'
import { stringifyBalanceWithBigIntsToString } from '@utils/adapter'

export function* updateNativeBalancesSaga(): Generator {
  const chains = yield* select(chainsSelectors.chains)
  const userAddress = yield* select(providerSelector.userAddress)
  if (!userAddress) return
  const balances = yield* select(nativeBalancesSelectors.selectAll)

  yield* put(nativeBalancesActions.updateNativeBalancesRequest())
  try {
    const updatedBalances = yield* call(
      fetchNativeTokensBalances,
      chains,
      userAddress,
    )

    const isBalanceSheetDifferent =
      stringifyBalanceWithBigIntsToString(balances) !==
      stringifyBalanceWithBigIntsToString(updatedBalances)

    if (isBalanceSheetDifferent) {
      yield* put(nativeBalancesActions.updateNativeBalances(updatedBalances))
    }
    yield* put(nativeBalancesActions.updateNativeBalancesSuccess())
  } catch (error) {
    yield* put(nativeBalancesActions.updateNativeBalancesFailure())
    logger.error(error)
  }
}
