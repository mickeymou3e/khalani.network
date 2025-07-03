import { call, put, select } from 'typed-redux-saga'

import { fetchERC20Allowances } from '@dataSource/blockchain/erc20/allowance'
import { networkSelectors } from '@store/network/network.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { allowanceActions } from '../allowance.slice'
import { getTokens } from '../utils/getTokens'

export function* updateAllowanceSaga(): Generator {
  const userAddress = yield* select(walletSelectors.userAddress)
  const network = yield* select(networkSelectors.network)
  const tokens = yield* call(getTokens)
  if (userAddress) {
    try {
      const allowances = yield* call(
        fetchERC20Allowances,
        tokens.filter((token) => token.chainId === network),
        userAddress,
      )
      yield* put(allowanceActions.updateAllowance(allowances))
      yield* put(allowanceActions.initializeAllowanceSuccess())
    } catch (error) {
      console.error(error)
      yield* put(allowanceActions.initializeAllowanceFailure())
    }
  }
}
