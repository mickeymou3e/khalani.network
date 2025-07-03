import { all, cancel, FixedTask, fork, select, take } from 'typed-redux-saga'

import { poolsActions } from '@store/pool/pool.slice'
import { poolSelectors } from '@store/pool/selectors/pool.selector'

import { tokenSelectors } from '../../../tokens/tokens.selector'
import { tokensActions } from '../../../tokens/tokens.slice'
import { watchPoolTokensBalances } from './watchPoolTokensBalances.saga'

export function* spawnPoolsBalancesWatcher(): Generator {
  const watchersBuffer: FixedTask<Generator>[] = []

  while (true) {
    yield* all({
      updateTokens: take(tokensActions.updateTokensSuccess),
      updatePools: take(poolsActions.updateSuccess),
    })

    const tokens = yield* select(tokenSelectors.selectTokens)
    const pools = yield* select(poolSelectors.selectAll)
    const poolsIds = pools.map(({ id }) => id)

    if (poolsIds && tokens && tokens.length > 0) {
      const prevBalanceWatcher = watchersBuffer.pop()
      if (prevBalanceWatcher) {
        yield* cancel(prevBalanceWatcher)
      }

      const balanceWatcher = yield* fork(
        watchPoolTokensBalances,
        poolsIds,
        tokens,
      )
      watchersBuffer.push(balanceWatcher)
    }
  }
}
