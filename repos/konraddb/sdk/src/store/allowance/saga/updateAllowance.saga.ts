import { contractsSelectors } from '../../contracts/contracts.selectors'
import { providerSelector } from '../../provider/provider.selector'
import { tokenSelectors } from '../../tokens/tokens.selector'
import { fetchERC20Allowances } from '../../../dataSource/allowance'
import { call, put, select } from 'typed-redux-saga'

import { allowanceActions } from '../allowance.slice'

export function* updateAllowanceSaga(): Generator {
  const userAddress = yield* select(providerSelector.userAddress)
  const tokens = yield* select(tokenSelectors.selectAll)

  if (userAddress) {
    try {
      const network = yield* select(providerSelector.network)

      const currentNetworkRouterAddress = yield* select(
        contractsSelectors.currentNetworkRouterAddress,
      )
      const psm = yield* select(contractsSelectors.psm)

      const allowances = yield* call(
        fetchERC20Allowances,
        tokens.filter((token) => token.chainId === network),
        userAddress,
        currentNetworkRouterAddress,
      )

      if (psm?.address) {
        const psmAllowances = yield* call(
          fetchERC20Allowances,
          tokens.filter((token) => token.chainId === network),
          userAddress,
          psm?.address,
        )
        allowances.push(...psmAllowances)
      }

      yield* put(allowanceActions.updateAllowance(allowances))
      yield* put(allowanceActions.initializeAllowanceSuccess())
    } catch (error) {
      console.error(error)
      yield* put(allowanceActions.initializeAllowanceFailure())
    }
  }
}
