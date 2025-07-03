import { History } from 'history'
import { call, put, take } from 'typed-redux-saga'

import Config from '@config'
import { Network } from '@constants/Networks'
import { eventChannel, EventChannel } from '@redux-saga/core'
import { networkActions } from '@store/network/network.slice'
import { checkSupportedNetwork } from '@store/wallet/connection/stages/changeNetwork/validators/validators'

import { routerActions } from '../router.slice'

function createHistoryEventsChannel(
  history: History,
): EventChannel<ReturnType<typeof routerActions.locationChanged>> {
  return eventChannel((emitter) => {
    history.listen((location) =>
      emitter(routerActions.locationChanged(location)),
    )

    return () => ({})
  })
}

export function* watchLocationChange(history: History): Generator {
  const channel = yield* call(createHistoryEventsChannel, history)

  while (true) {
    yield* take(channel)

    const isSupportedNetwork = yield* call(checkSupportedNetwork)

    if (!isSupportedNetwork) {
      yield* put(
        networkActions.updateExpectedNetwork(
          Config.godwoken.chainId as Network,
        ),
      )
    }
  }
}
