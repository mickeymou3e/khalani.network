import { call, put, select } from 'typed-redux-saga'
import { providerSelector } from '@store/provider/provider.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { balancesActions } from '../balances.slice'
import { logger } from '@utils/logger'
import { fetchERC20MultiChainBalances } from '@dataSource/balances/multchain'

export function* updateBalancesSaga(): Generator {
  const tokens = yield* select(tokenSelectors.tokensToUpdate)
  const userAddress = yield* select(providerSelector.userAddress)

  if (userAddress) {
    yield* put(balancesActions.initializeBalancesRequest())
    try {
      const balances = yield* call(
        fetchERC20MultiChainBalances,
        tokens,
        userAddress,
      )
      yield* put(balancesActions.updateBalances(balances))
      yield* put(balancesActions.initializeBalancesSuccess())
    } catch (error) {
      yield* put(balancesActions.initializeBalancesFailure())
      logger.error(error)
    }
  }
}
