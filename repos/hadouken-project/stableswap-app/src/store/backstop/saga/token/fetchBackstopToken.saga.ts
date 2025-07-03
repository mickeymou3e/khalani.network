import { Effect } from 'redux-saga/effects'
import { all, call, select } from 'typed-redux-saga'

import { IPoolToken } from '@dataSource/graph/pools/poolsTokens/types'
import { address } from '@dataSource/graph/utils/formatters'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'

export function* fetchBackstopTokenSaga(): Generator<
  Effect,
  IPoolToken | null
> {
  try {
    yield* call(waitForChainToBeSet)

    const backstopContracts = yield* select(
      contractsSelectors.backstopContracts,
    )
    const backstop = backstopContracts?.backstop

    if (!backstop) throw Error('backstop is undefined')

    const tokenData = yield* all({
      name: call(backstop.name),
      symbol: call(backstop.symbol),
      decimals: call(backstop.decimals),
    })

    const token: IPoolToken = {
      address: address(backstop.address),
      decimals: tokenData.decimals,
      name: tokenData.name,
      displayName: tokenData.name,
      id: backstop.address,
      symbol: tokenData.symbol,
      isLpToken: true,
    }

    return token
  } catch (e) {
    console.error(e)
  }
  return null
}
