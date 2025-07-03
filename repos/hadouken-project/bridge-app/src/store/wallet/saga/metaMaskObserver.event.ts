import { EventChannel, eventChannel } from 'redux-saga'
import { put, call, take } from 'typed-redux-saga'

import { MetaMaskInpageProvider } from '@metamask/inpage-provider'

import { walletActions } from '../wallet.slice'
import { ConnectionState, ConnectionStatus } from '../wallet.types'
import { getMetaMaskProvider } from '../wallet.utils'

function createMetaMaskEventsChannel(
  ethereum: MetaMaskInpageProvider,
): EventChannel<
  | ReturnType<typeof walletActions.onNetworkChange>
  | ReturnType<typeof walletActions.onAccountChange>
> {
  return eventChannel((emitter) => {
    const onChainChanged = (chainId: string) => {
      emitter(walletActions.onNetworkChange(chainId))
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
export function* observeMetaMaskEvents(): Generator {
  const ethereum = yield* call(getMetaMaskProvider)

  if (!ethereum?.isMetaMask) return

  const channel = yield* call(createMetaMaskEventsChannel, ethereum)
  while (true) {
    const action = yield* take(channel)
    yield put(action)
    if (action.type === walletActions.onAccountChange.type) {
      if (action.payload != null) {
        yield* put(
          walletActions.changeConnectionStateStatus({
            connectionState: ConnectionState.Select,
            status: ConnectionStatus.success,
          }),
        )
      } else {
        yield* put(
          walletActions.changeConnectionStateStatus({
            connectionState: ConnectionState.Select,
            status: ConnectionStatus.fail,
          }),
        )
      }
    } else if (action.type === walletActions.onNetworkChange.type)
      yield* put(
        walletActions.changeConnectionStateStatus({
          connectionState: ConnectionState.ChangeNetwork,
          status: ConnectionStatus.pending,
        }),
      )
  }
}
