import React from 'react'

import {
  AuthorizeWalletModal,
  InstallMetaMaskModal,
  SelectWalletModal,
  UserAddressesModal,
} from '@hadouken-project/ui'
import { ConnectionState, ConnectionStatus } from '@store/wallet/wallet.types'

import { IModalManagerProps } from './ModalsManager.types'

const ModalManager: React.FC<IModalManagerProps> = ({
  open,
  connectionState,
  status,
  setOpen,
  connectToMetaMask,
  installMetaMask,
  selectWallet,
  openAddressModal,
  handleCloseAddressModal,
  addresses,
}) => {
  const shouldOpenModal = open && status === ConnectionStatus.fail

  const shouldOpenInstallModal =
    shouldOpenModal && connectionState === ConnectionState.Install

  const shouldOpenSelectModal =
    shouldOpenModal && connectionState === ConnectionState.Select

  const shouldOpenAuthorizeModal =
    shouldOpenModal && connectionState === ConnectionState.Authorize

  return (
    <>
      <InstallMetaMaskModal
        open={shouldOpenInstallModal}
        handleClose={() => setOpen(false)}
        handleInstallMetaMask={installMetaMask}
        handleGoBack={selectWallet}
      />
      <SelectWalletModal
        open={shouldOpenSelectModal}
        handleClose={() => setOpen(false)}
        metaMaskSelected={connectToMetaMask}
      />
      <AuthorizeWalletModal
        open={shouldOpenAuthorizeModal}
        handleClose={() => setOpen(false)}
      />
      <UserAddressesModal
        open={openAddressModal}
        handleClose={handleCloseAddressModal}
        addresses={addresses}
      />
    </>
  )
}

export default ModalManager
