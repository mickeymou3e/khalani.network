import { select, take } from 'typed-redux-saga'

import { pricedBalancesActions } from './pricedBalances.slice'
import { pricedBalancesSelectors } from './selectors/priceBalances.selector'

export function* waitForPricedBalancesSaga(): Generator {
  const isFetching = yield* select(pricedBalancesSelectors.isFetching)
  if (isFetching) {
    yield* take(pricedBalancesActions.updateSuccess)
  }
}
