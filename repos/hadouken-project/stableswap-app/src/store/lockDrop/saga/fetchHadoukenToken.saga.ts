import { Effect } from 'redux-saga/effects'
import { all, call, select } from 'typed-redux-saga'

import { isTestOrLocalEnv } from '@constants/NodeEnv'
import { IPoolToken } from '@dataSource/graph/pools/poolsTokens/types'
import { address } from '@dataSource/graph/utils/formatters'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { networkSelectors } from '@store/network/network.selector'
import { waitForChainToBeSet } from '@store/wallet/metamask/metaMaskObserver/metaMaskObserver.event'
import { config } from '@utils/network'

export function* fetchHadoukenTokenSaga(): Generator<
  Effect,
  IPoolToken | null
> {
  try {
    yield* call(waitForChainToBeSet)
    const chainId = yield* select(networkSelectors.applicationChainId)

    //* NOTE: remove after deploy lockdrop on mainnet
    if (!isTestOrLocalEnv) return null

    const hadoukenTokenAddress = config.lockDropTokens[chainId].Hdk

    const connectToToken = yield* select(contractsSelectors.tokenConnector)

    const hadoukenToken = connectToToken(hadoukenTokenAddress)

    const tokenData = yield* all({
      name: call(hadoukenToken.name),
      symbol: call(hadoukenToken.symbol),
      decimals: call(hadoukenToken.decimals),
    })

    const token: IPoolToken = {
      address: address(hadoukenToken.address),
      decimals: tokenData.decimals,
      name: tokenData.name,
      displayName: tokenData.symbol,
      id: address(hadoukenToken.address),
      symbol: tokenData.symbol,
      isLpToken: false,
    }

    return token
  } catch (e) {
    console.error(e)

    return null
  }
}
