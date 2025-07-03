import { call, put, select } from 'typed-redux-saga'

import { fetchERC20MultiChainBalances } from '@dataSource/blockchain/erc20/balances/contract'
import { khalaTokenSelectors } from '@store/khala/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { khalaBalancesActions } from './balances.slice'
import { findTheOnlyChainIdWithTokens } from './utils/findOnlyChainIdWithTokens'

export function* initializeKhalaBalancesSaga(): Generator {
  const tokens = yield* select(khalaTokenSelectors.selectAll)
  const userAddress = yield* select(walletSelectors.userAddress)

  if (userAddress) {
    yield* put(khalaBalancesActions.initializeKhalaBalancesRequest())
    try {
      const balances = yield* call(
        fetchERC20MultiChainBalances,
        tokens,
        userAddress,
      )
      const onlyChainIdWithTokens = yield* call(
        findTheOnlyChainIdWithTokens,
        balances,
      )
      if (onlyChainIdWithTokens) {
        yield* put(
          khalaBalancesActions.updateOnlyChainIdWithTokens(
            onlyChainIdWithTokens,
          ),
        )
      }
      yield* put(khalaBalancesActions.updateKhalaBalances(balances))
      yield* put(khalaBalancesActions.initializeKhalaBalancesSuccess())
    } catch (error) {
      yield* put(khalaBalancesActions.initializeKhalaBalancesFailure())
      console.error(error)
    }
  }
}
