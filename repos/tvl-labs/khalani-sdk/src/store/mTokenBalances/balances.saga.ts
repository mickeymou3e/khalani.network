import { fetchERC20Balances } from '@dataSource/balances'
import { providerSelector } from '@store/provider/provider.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { call, put, select } from 'typed-redux-saga'
import { logger } from '@utils/logger'
import { khalaniContractsSelectors } from '@store/contracts/khalani.contracts.selectors'
import { mTokenBalancesActions } from './balances.slice'

export function* updateMTokenBalancesSaga(): Generator {
  const userAddress = yield* select(providerSelector.userAddress)

  if (!userAddress) {
    return
  }

  const mTokens = yield* select(tokenSelectors.selectMTokens)
  const tokenConnector = yield* select(khalaniContractsSelectors.tokenConnector)

  try {
    const balances = yield* call(
      fetchERC20Balances,
      mTokens,
      userAddress,
      tokenConnector,
    )
    yield* put(mTokenBalancesActions.updateBalances(balances))
    yield* put(mTokenBalancesActions.initializeBalancesSuccess())
  } catch (error) {
    logger.error(error)
  }
}
