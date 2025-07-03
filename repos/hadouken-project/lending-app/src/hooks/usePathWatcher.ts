import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { usePrevious } from '@hadouken-project/ui'
import { walletActions } from '@store/wallet/wallet.slice'
import { ConnectionState, ConnectionStatus } from '@store/wallet/wallet.types'
import { checkIsSupportedNetworkInUrl } from '@utils/network'

export const usePathWatcher = () => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()

  const supportedNetwork = checkIsSupportedNetworkInUrl(pathname)

  const previousChain = usePrevious(supportedNetwork?.chainId)

  useEffect(() => {
    if (supportedNetwork && previousChain !== supportedNetwork.chainId) {
      dispatch(walletActions.setApplicationChainId(supportedNetwork.chainId))
      dispatch(
        walletActions.setApplicationNetworkName(supportedNetwork.chainId),
      )
      dispatch(
        walletActions.changeConnectionStateStatus({
          connectionState: ConnectionState.None,
          status: ConnectionStatus.pending,
        }),
      )
    }
  }, [dispatch, supportedNetwork, previousChain])
}
