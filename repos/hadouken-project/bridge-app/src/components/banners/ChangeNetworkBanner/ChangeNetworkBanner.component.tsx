import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  ChangeNetworkBanner as UIChangeNetworkBanner,
  ChangeNetworkModal,
} from '@hadouken-project/ui'
import { Box } from '@mui/material'
import { networkSelectors } from '@store/network/network.selector'
import { StoreDispatch } from '@store/store.types'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import { ConnectionState, ConnectionStatus } from '@store/wallet/wallet.types'
import { getNetworkName } from '@utils/network'

import { messages } from './ChangeNetworkBanner.messages'

export const ChangeNetworkBanner: React.FC = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch<StoreDispatch>()

  const { connectionState, status } = useSelector(
    walletSelectors.connectionStateStatus,
  )

  const expectedNetwork = useSelector(networkSelectors.expectedNetwork)
  const currentNetwork = useSelector(networkSelectors.network)

  const prevConnectionStateRef = useRef<{
    connectionState: ConnectionState
    status: ConnectionStatus
  }>(null)

  useEffect(() => {
    if (connectionState === ConnectionState.ChangeNetwork) {
      prevConnectionStateRef.current = { connectionState, status }
      if (status === ConnectionStatus.fail) {
        setOpen(true)
      }
    } else {
      prevConnectionStateRef.current = null
    }
  }, [connectionState, status])

  const switchNetwork = () => {
    dispatch(walletActions.switchNetworkToSupported())
  }

  const handleModalOpen = () => {
    setOpen(true)
  }

  const handleModalClose = () => {
    setOpen(false)
  }

  if (
    (connectionState !== ConnectionState.ChangeNetwork ||
      status !== ConnectionStatus.fail) &&
    (prevConnectionStateRef.current?.connectionState !==
      ConnectionState.ChangeNetwork ||
      prevConnectionStateRef.current?.status !== ConnectionStatus.fail)
  ) {
    return null
  }

  return (
    <>
      <Box data-testid="changeNetworkBanner-errorLabel">
        <UIChangeNetworkBanner onChangeNetworkRequest={handleModalOpen} />
      </Box>
      <ChangeNetworkModal
        open={open}
        expectedNetwork={getNetworkName(expectedNetwork)}
        previousNetwork={getNetworkName(currentNetwork)}
        changeNetwork={switchNetwork}
        title={messages.MODAL_TITLE}
        handleClose={handleModalClose}
      />
    </>
  )
}

export default ChangeNetworkBanner
