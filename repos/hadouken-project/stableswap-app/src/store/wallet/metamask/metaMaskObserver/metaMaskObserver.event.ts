import { EventChannel, eventChannel } from 'redux-saga'
import { call, put, select, take } from 'typed-redux-saga'

import { MetaMaskInpageProvider } from '@metamask/inpage-provider'
import { networkSelectors } from '@store/network/network.selector'
import { networkActions } from '@store/network/network.slice'

import {
  ConnectionStageStatus,
  ConnectionStageType,
} from '../../connection/types'
import { walletActions } from '../../wallet.slice'
import { getMetaMaskProvider } from '../../wallet.utils'

function createMetaMaskEventsChannel(
  ethereum: MetaMaskInpageProvider,
): EventChannel<
  | ReturnType<typeof walletActions.onNetworkChange>
  | ReturnType<typeof walletActions.onAccountChange>
> {
  return eventChannel((emitter) => {
    const onChainChanged = () => {
      emitter(walletActions.onNetworkChange())
    }

    const onAccountsChanged = (accounts: string[]) => {
      emitter(
        walletActions.onAccountChange(accounts.length > 0 ? accounts[0] : null),
      )
    }

    ethereum.on('chainChanged', onChainChanged)
    ethereum.on('accountsChanged', onAccountsChanged)

    return () => {
      ethereum.removeListener('chainChanged', onChainChanged)
      ethereum.removeListener('accountsChanged', onAccountsChanged)
    }
  })
}

export function* waitForChainToBeSet(): Generator {
  const applicationChainId = yield* select(networkSelectors.applicationChainId)

  if (!applicationChainId) {
    yield* take(networkActions.setApplicationChainId)
  }
}

export function* observeMetaMaskEvents(): Generator {
  yield* call(waitForChainToBeSet)

  const ethereum = yield* call(getMetaMaskProvider)

  if (!ethereum?.isMetaMask) return

  const channel = yield* call(createMetaMaskEventsChannel, ethereum)
  while (true) {
    const action = yield* take(channel)
    yield put(action)
    if (action.type === walletActions.onAccountChange.type) {
      if (action.payload !== null) {
        yield* put(
          walletActions.changeConnectionStage({
            type: ConnectionStageType.SelectWallet,
            status: ConnectionStageStatus.Success,
          }),
        )
      } else {
        yield* put(
          walletActions.changeConnectionStage({
            type: ConnectionStageType.SelectWallet,
            status: ConnectionStageStatus.Fail,
          }),
        )
      }
    } else if (action.type === walletActions.onNetworkChange.type)
      yield* put(
        walletActions.changeConnectionStage({
          type: ConnectionStageType.ChangeNetwork,
          status: ConnectionStageStatus.Pending,
        }),
      )
  }
}
