import { call, put } from 'typed-redux-saga'

import { Network } from '@constants/Networks'
import { networkActions } from '@store/network/network.slice'
import { getProviderNetwork } from '@store/wallet/wallet.utils'

export function* updateNetwork(): Generator {
  const network = (yield* call(getProviderNetwork)) as Network

  yield* put(networkActions.updateNetwork(network))
}
