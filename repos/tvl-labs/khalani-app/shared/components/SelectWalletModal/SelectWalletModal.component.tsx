import React, { createContext, ReactNode, useState } from 'react'

import { useWallet } from '@shared/store'
import {
  SelectWalletModal as SelectWalletModalUI,
  WalletType,
} from '@tvl-labs/khalani-ui'

import { wallets } from './SelectWalletModal.constants'

interface ModalContext {
  openModal: () => void
}

export const SelectWalletModalContext = createContext<ModalContext>(
  {} as ModalContext,
)

export const SelectWalletModalProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const wallet = useWallet()

  const openModal = () => {
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
  }

  const handleWalletSelect = (type: WalletType) => {
    if (wallet.status === 'notConnected') wallet.connect(undefined, type)
  }
  return (
    <SelectWalletModalContext.Provider value={{ openModal }}>
      {children}
      <SelectWalletModalUI
        wallets={wallets}
        open={open}
        onClose={() => closeModal()}
        onWalletSelect={handleWalletSelect}
      />
    </SelectWalletModalContext.Provider>
  )
}

export const useSelectWalletModal = () => {
  const context = React.useContext(SelectWalletModalContext)
  if (context === undefined) {
    throw new Error(
      'useSelectWalletModal must be used within a SelectWalletModalProvider',
    )
  }
  return context
}
