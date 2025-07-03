import React from 'react'

import { useSelectWalletModal } from '@shared/components/SelectWalletModal'
import { useWallet } from '@shared/store'
import { PrimaryButton } from '@tvl-labs/khalani-ui'

const ConnectWallet: React.FC = () => {
  const wallet = useWallet()
  const { openModal: openSelectWalletModal } = useSelectWalletModal()

  const handleButtonClick = () => {
    if (wallet.status === 'notConnected') {
      openSelectWalletModal()
    }
  }

  return (
    <PrimaryButton
      size="large"
      variant="contained"
      color="primary"
      onClick={handleButtonClick}
      text={'Connect wallet'}
    />
  )
}

export default ConnectWallet
