import { call, put, select } from 'typed-redux-saga'

import { fetchERC20BatchBalances } from '@dataSource/blockchain/erc20/balances/batch'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { balancesActions } from '../../balances.slice'

export function* updateUserBalances(): Generator {
  const userAddress = yield* select(walletSelectors.userAddress)
  const tokens = yield* select(tokenSelectors.selectAllTokens)
  if (userAddress) {
    try {
      yield* put(balancesActions.updateBalancesRequest())
      const balances = yield* call(fetchERC20BatchBalances, userAddress, tokens)
      yield* put(balancesActions.updateBalancesSuccess([balances]))
    } catch (error) {
      console.error(error)
      yield* put(balancesActions.updateBalancesFailed())
    }
  }
}
