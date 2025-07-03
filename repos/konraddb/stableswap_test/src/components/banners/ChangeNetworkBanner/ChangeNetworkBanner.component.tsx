import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  ChangeNetworkBanner as UIChangeNetworkBanner,
  ChangeNetworkModal,
} from '@hadouken-project/ui'
import { Box } from '@mui/material'
import { networkSelectors } from '@store/network/network.selector'
import { StoreDispatch } from '@store/store.types'
import {
  ConnectionStage,
  ConnectionStageStatus,
  ConnectionStageType,
} from '@store/wallet/connection/types'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import { getNetworkName } from '@utils/network'

import { messages } from './ChangeNetworkBanner.messages'

export const ChangeNetworkBanner: React.FC = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch<StoreDispatch>()

  const connectionStage = useSelector(walletSelectors.connectionStage)

  const currentNetwork = useSelector(networkSelectors.network)
  const expectedNetwork = useSelector(networkSelectors.expectedNetwork)

  const prevConnectionStageRef = useRef<ConnectionStage | null>(null)

  useEffect(() => {
    if (connectionStage.type === ConnectionStageType.ChangeNetwork) {
      prevConnectionStageRef.current = connectionStage
      if (connectionStage.status === ConnectionStageStatus.Fail) {
        setOpen(true)
      }
    } else {
      prevConnectionStageRef.current = null
      setOpen(false)
    }
  }, [connectionStage])

  const switchNetwork = () => {
    dispatch(walletActions.switchMetamaskNetwork())
  }

  const handleModalOpen = () => {
    setOpen(true)
  }

  const handleModalClose = () => {
    setOpen(false)
  }

  if (
    (connectionStage.type !== ConnectionStageType.ChangeNetwork ||
      connectionStage.status !== ConnectionStageStatus.Fail) &&
    (prevConnectionStageRef.current?.type !==
      ConnectionStageType.ChangeNetwork ||
      prevConnectionStageRef.current?.status !== ConnectionStageStatus.Fail)
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
