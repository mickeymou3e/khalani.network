import { call, put, select } from 'typed-redux-saga'

import { fetchLiquidations } from '@dataSource/graph/backstop'
import { LIQUIDATIONS_LIMIT } from '@pages/Backstop/Backstop.constants'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { setContractError } from '@store/contracts/setError.saga'
import { waitForPoolsAndTokensBeFetched } from '@store/deposit/saga/editor/utils'
import { networkSelectors } from '@store/network/network.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { WEEK_BIG_DECIMAL, YEAR_BIG_DECIMAL } from '@utils/date'
import { BigDecimal } from '@utils/math'

import { backstopActions } from '../backstop.slice'

export function* initializeBackstopSaga(): Generator {
  try {
    yield* call(waitForPoolsAndTokensBeFetched)
    yield* call(waitForChainToBeSet)

    const chainId = yield* select(networkSelectors.applicationChainId)
    const selectToken = yield* select(tokenSelectors.selectById)
    const tokenConnector = yield* select(contractsSelectors.tokenConnector)
    const backstopContracts = yield* select(
      contractsSelectors.backstopContracts,
    )

    const backstop = backstopContracts?.backstop

    if (!backstop) throw Error('backstop not defined')

    const tokenAddress = yield* call(backstop.liquidationToken)

    const liquidationToken = selectToken(tokenAddress.toLowerCase())
    const backstopToken = selectToken(backstop.address)

    if (!liquidationToken) throw Error('liquidationToken not defined')
    if (!backstopToken) throw Error('backstopToken not defined')

    const liquidationTokeContract = tokenConnector(liquidationToken.address)

    const totalLiquidity = yield* call(
      liquidationTokeContract.balanceOf,
      backstop.address,
    )

    const poolTotalBalance = BigDecimal.from(
      totalLiquidity,
      liquidationToken.decimals,
    )

    const skip = 0

    const liquidations = yield* call(
      fetchLiquidations,
      chainId,
      LIQUIDATIONS_LIMIT,
      skip,
    )

    const hasMore = liquidations.length >= LIQUIDATIONS_LIMIT

    const profit = liquidations.reduce((sum, current) => {
      return sum.add(BigDecimal.from(current.profit.toBigNumber()))
    }, BigDecimal.from(0))

    const apr = profit
      .div(WEEK_BIG_DECIMAL)
      .mul(YEAR_BIG_DECIMAL)
      .div(poolTotalBalance)
      .mul(BigDecimal.from(100, 0))

    yield* put(
      backstopActions.initializeBackstopSuccess({
        backstopToken,
        liquidationToken,
        poolTotalBalance,
        backstopAddress: backstop.address,
        apr,
        liquidations,
        hasMore,
      }),
    )
  } catch (error) {
    console.log('error', error)
    yield* call(setContractError, error)

    yield* put(backstopActions.initializeBackstopFailure())
  }
}
