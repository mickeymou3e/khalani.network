import { providerSelector } from '@store/provider/provider.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { fetchERC20Allowances } from '@dataSource/allowance'
import { call, put, select } from 'typed-redux-saga'

import { allowanceActions } from '@store/allowance/allowance.slice'
import config from '@config'
import { IAllowance } from '../allowance.types'
import { Network } from '@constants/Networks'
import { safeSelector } from '@store/safe/safe.selector'
import { logger } from '@utils/logger'
import { evmChainContractsSelectors } from '@store/contracts/contracts.selectors'

export function* updateAllowanceSaga(): Generator {
  const userAddress = yield* select(providerSelector.userAddress)
  const network = yield* select(providerSelector.network)
  const tokens = yield* select(tokenSelectors.selectByCurrentNetwork)
  const klnTokens = yield* select(tokenSelectors.klnTokens)
  const stkTokens = yield* select(tokenSelectors.stkTokens)

  const permit2Address = yield* select(
    evmChainContractsSelectors.permit2Address,
  )
  if (!permit2Address) throw new Error('Permit2 address not found')

  if (!userAddress) {
    return
  }

  try {
    const allowances: IAllowance[] = []
    const permit2Allowances = yield* call(
      fetchERC20Allowances,
      tokens,
      userAddress,
      permit2Address,
    )
    allowances.push(...permit2Allowances)

    const interchainLiquidityHubAddress =
      config.contracts.InterchainLiquidityHub
    const safeAddress = yield* select(safeSelector.address)

    if (network === Network.Khalani) {
      const klnAllowances = yield* call(
        fetchERC20Allowances,
        klnTokens,
        userAddress,
      )
      allowances.push(...klnAllowances)

      if (config.contracts.lending.borrowerOperations) {
        const stkBorrowerAllowances = yield* call(
          fetchERC20Allowances,
          stkTokens,
          userAddress,
          config.contracts.lending.borrowerOperations,
        )
        allowances.push(...stkBorrowerAllowances)
      }
    }

    yield* put(allowanceActions.updateAllowance(allowances))
    yield* put(allowanceActions.initializeAllowanceSuccess())
  } catch (error) {
    logger.error(error)
    yield* put(allowanceActions.initializeAllowanceFailure())
  }
}
