import { call, put, select } from 'typed-redux-saga'

import { fetchERC20CurrentChainBalances } from '@dataSource/blockchain/erc20/balances/contract'
import { khalaTokenSelectors } from '@store/khala/tokens/tokens.selector'
import { networkSelectors } from '@store/network/network.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { khalaBalancesSelectors } from '../balances.selector'
import { khalaBalancesActions } from '../balances.slice'
import { replaceNewBalances } from '../utils/replaceNewBalances'

export function* updateKhalaBalancesSaga(): Generator {
  const tokens = yield* select(khalaTokenSelectors.selectAll)
  const userAddress = yield* select(walletSelectors.userAddress)
  const network = yield* select(networkSelectors.network)
  const balances = yield* select(khalaBalancesSelectors.selectAll)

  if (userAddress) {
    try {
      const newBalances = yield* call(
        fetchERC20CurrentChainBalances,
        tokens.filter((token) => token.chainId === network),
        userAddress,
      )
      const result = yield* call(replaceNewBalances, balances, newBalances)
      yield* put(
        khalaBalancesActions.updateKhalaBalances(
          result.length === 0 ? newBalances : result,
        ),
      )
    } catch (error) {
      console.error(error)
    }
  }
}
