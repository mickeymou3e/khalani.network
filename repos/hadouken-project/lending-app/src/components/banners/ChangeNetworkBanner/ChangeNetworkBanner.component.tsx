import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import {
  ChangeNetworkBanner as UIChangeNetworkBanner,
  ChangeNetworkModal,
} from '@hadouken-project/ui'
import { Box } from '@mui/material'
import { StoreDispatch } from '@store/store.types'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import { ConnectionState, ConnectionStatus } from '@store/wallet/wallet.types'
import { checkIsSupportedNetworkInUrl } from '@utils/network'

export const ChangeNetworkBanner: React.FC = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch<StoreDispatch>()
  const { pathname } = useLocation()
  const isNetworkInUrl = checkIsSupportedNetworkInUrl(pathname)

  const { connectionState, status } = useSelector(
    walletSelectors.connectionStateStatus,
  )

  const applicationNetworkName = useSelector(
    walletSelectors.applicationNetworkName,
  )
  const applicationChainId = useSelector(walletSelectors.applicationChainId)

  const prevConnectionStateRef = useRef<{
    connectionState: ConnectionState
    status: ConnectionStatus
  }>()

  useEffect(() => {
    if (connectionState === ConnectionState.ChangeNetwork) {
      prevConnectionStateRef.current = { connectionState, status }
      if (status === ConnectionStatus.fail) {
        setOpen(true)
      }
    } else {
      prevConnectionStateRef.current = undefined
      setOpen(false)
    }
  }, [connectionState, status])

  const switchNetwork = () => {
    dispatch(walletActions.switchNetworkToSupported(applicationChainId))
  }

  const handleModalOpen = () => {
    setOpen(true)
  }

  const handleModalClose = () => {
    setOpen(false)
  }

  if (!isNetworkInUrl) return null

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
        expectedNetwork={applicationNetworkName ?? '-'}
        changeNetwork={switchNetwork}
        handleClose={handleModalClose}
      />
    </>
  )
}

export default ChangeNetworkBanner
