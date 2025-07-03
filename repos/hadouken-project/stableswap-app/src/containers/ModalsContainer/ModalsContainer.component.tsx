import React from 'react'

import {
  AuthorizeWalletModal,
  InstallMetaMaskModal,
  SelectWalletModal,
  UserAddressesModal,
} from '@hadouken-project/ui'
import {
  ConnectionStageStatus,
  ConnectionStageType,
} from '@store/wallet/connection/types'

import { IModalContainerProps } from './ModalContainer.types'

const ModalsContainer: React.FC<IModalContainerProps> = ({
  open,
  connectionStage,
  setOpen,
  connectToMetaMask,
  installMetaMask,
  openAddressModal,
  handleCloseAddressModal,
  addresses,
}) => {
  const shouldOpenModal =
    open && connectionStage.status === ConnectionStageStatus.Fail

  const shouldOpenInstallModal =
    shouldOpenModal &&
    connectionStage.type === ConnectionStageType.InstallWallet

  const shouldOpenSelectModal =
    shouldOpenModal && connectionStage.type === ConnectionStageType.SelectWallet

  const shouldOpenAuthorizeModal =
    shouldOpenModal &&
    connectionStage.type === ConnectionStageType.ConnectWallet

  return (
    <>
      <InstallMetaMaskModal
        open={shouldOpenInstallModal}
        handleClose={() => setOpen(false)}
        handleGoBack={() => setOpen(false)}
        handleInstallMetaMask={installMetaMask}
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

export default ModalsContainer
