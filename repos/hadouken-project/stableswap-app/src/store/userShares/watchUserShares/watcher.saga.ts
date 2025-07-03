import { cancel, FixedTask, fork, race, select, take } from 'typed-redux-saga'

import { subscribeUserPoolsShares } from '@dataSource/graph/user/userPoolsShares'
import { poolsActions } from '@store/pool/pool.slice'
import { tokensActions } from '@store/tokens/tokens.slice'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'

import { tokenSelectors } from '../../tokens/tokens.selector'

export function* watchUserShares(): Generator {
  const watchersBuffer: FixedTask<Generator>[] = []

  while (true) {
    yield* race({
      updatePools: take(poolsActions.updateSuccess),
      updateTokens: take(tokensActions.updateTokensSuccess),
      connectionStage: take(walletActions.changeConnectionStage),
    })

    const isConnected = yield* select(walletSelectors.isConnected)
    if (!isConnected) {
      continue
    }

    const userAddress = yield* select(walletSelectors.userAddress)
    if (!userAddress) throw Error('User not found')

    const lpTokens = yield* select(tokenSelectors.selectLPTokens)

    if (lpTokens && lpTokens.length > 0) {
      const prevBalanceWatcher = watchersBuffer.pop()
      if (prevBalanceWatcher) {
        yield* cancel(prevBalanceWatcher)
      }

      const userPoolsSharesWatcher = yield* fork(
        subscribeUserPoolsShares,
        userAddress,
        lpTokens,
      )
      watchersBuffer.push(userPoolsSharesWatcher)
    }
  }
}
