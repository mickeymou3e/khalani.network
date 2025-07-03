import { call, put, select } from 'typed-redux-saga'

import { fetchLendingReserves } from '@dataSource/blockchain/lending/fetchLendingReserves'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { BigDecimal } from '@utils/math'

import { YIELD_FEE_TYPE } from '../lending.constants'
import { lendingActions } from '../lending.slice'

export function* fetchLendingReservesSaga(): Generator {
  try {
    yield* call(waitForChainToBeSet)

    const protocolFeePercentageProvider = yield* select(
      contractsSelectors.protocolFeePercentageProvider,
    )

    if (protocolFeePercentageProvider) {
      const reserves = yield* call(fetchLendingReserves)

      const yieldFee = yield* call(
        protocolFeePercentageProvider.getFeeTypePercentage,
        YIELD_FEE_TYPE,
      )

      yield* put(
        lendingActions.fetchLendingTokensSuccess({
          reserves,
          yieldFee: BigDecimal.from(yieldFee, 25),
        }),
      )
    }
  } catch (error) {
    yield* put(lendingActions.fetchLendingTokensFailure())
    console.error(error)
  }
}
