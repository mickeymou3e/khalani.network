import React, { useEffect, useMemo, useState } from 'react'

import { Box } from '@mui/material'
import { useSelectWalletModal } from '@shared/components'
import { useWallet } from '@shared/store'
import { PrimaryButton } from '@tvl-labs/khalani-ui'

import { messages } from './ConfirmButton.messages'
import { IConfirmButtonProps } from './ConfirmButton.types'

type ConfirmButtonState =
  | {
      type: 'pending'
      label: string
    }
  | {
      type: 'insufficientBalance'
    }
  | {
      type: 'needToChangeNetwork'
    }
  | {
      type: 'needToConnectWallet'
    }
  | {
      type: 'ready'
    }

const ConfirmButton: React.FC<IConfirmButtonProps> = (props) => {
  const {
    onClick,
    text,
    disabled,
    size = 'large',
    isLoading = false,
    expectedNetwork: targetNetwork,
    insufficientBalance,
  } = props

  const [buttonState, setButtonState] = useState<ConfirmButtonState>({
    type: 'pending',
    label: 'Initializing...',
  })
  const { openModal: openSelectWalletModal } = useSelectWalletModal()

  const wallet = useWallet()
  const walletStatus = wallet.status
  const walletNetwork = wallet.network

  useEffect(() => {
    switch (walletStatus) {
      case 'unavailable':
        setButtonState({ type: 'pending', label: 'No Supported Wallet...' })
        break
      case 'connecting':
        setButtonState({ type: 'pending', label: 'Connecting Wallet...' })
        break
      case 'notConnected':
        setButtonState({ type: 'needToConnectWallet' })
        break
      case 'unsupportedNetwork':
        setButtonState({ type: 'needToChangeNetwork' })
        break
      case 'connected':
        if (walletNetwork !== targetNetwork) {
          setButtonState({ type: 'needToChangeNetwork' })
        } else if (insufficientBalance) {
          setButtonState({ type: 'insufficientBalance' })
        } else {
          setButtonState({ type: 'ready' })
        }
        break
    }
  }, [
    walletStatus,
    setButtonState,
    walletNetwork,
    targetNetwork,
    insufficientBalance,
  ])

  const handleButtonClick = (): void => {
    switch (buttonState.type) {
      case 'pending':
      case 'insufficientBalance':
      case 'needToChangeNetwork':
        if (
          wallet.status === 'connected' ||
          wallet.status === 'unsupportedNetwork'
        ) {
          wallet.switchToNetwork(targetNetwork)
        } else {
          console.warn(
            `Attempt to change network from wallet status ${wallet.status}`,
          )
        }
        break
      case 'needToConnectWallet':
        if (wallet.status === 'notConnected') {
          openSelectWalletModal()
        }
        break
      case 'ready':
        onClick()
        break
    }
  }

  const buttonLabel = useMemo(() => {
    switch (buttonState.type) {
      case 'pending':
        return buttonState.label
      case 'needToConnectWallet':
        return messages.CONNECT_WALLET_LABEL
      case 'needToChangeNetwork':
        return messages.CHANGE_NETWORK_LABEL
      case 'insufficientBalance':
        return messages.INSUFFICIENT_BALANCE_LABEL
      case 'ready':
        return text
    }
    return text
  }, [buttonState, text])

  const isDisabled = useMemo(() => {
    switch (buttonState.type) {
      case 'needToChangeNetwork':
      case 'needToConnectWallet':
        // Always allow changing the network.
        return false
      case 'pending':
      case 'insufficientBalance':
      case 'ready':
        return disabled
    }
    return disabled
  }, [buttonState, disabled])

  return (
    <Box>
      <PrimaryButton
        fullWidth
        sx={{ width: '100%' }}
        size={size}
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        text={buttonLabel}
        disabled={isDisabled}
        isLoading={isLoading}
      />
    </Box>
  )
}

export default ConfirmButton
