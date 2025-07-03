import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, useHistory } from 'react-router-dom'

import config from '@config'
import ModalsContainer from '@containers/ModalsContainer/ModalsContainer.component'
import { Header } from '@hadouken-project/ui'
import { networkSelectors } from '@store/network/network.selector'
import { StoreDispatch } from '@store/store.types'
import {
  ConnectionStageStatus,
  ConnectionStageType,
} from '@store/wallet/connection/types'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import { getDisplayValue } from '@utils/string'

import { Routes } from './HeaderContainer.constants'
import { IHeaderContainerProps } from './HeaderContainer.types'

const HeaderContainer: React.FC<IHeaderContainerProps> = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const history = useHistory()
  const [open, setOpen] = useState(false)
  const [openAddressModal, setOpenAddressModal] = useState(false)

  const connectionStage = useSelector(walletSelectors.connectionStage)

  useEffect(() => {
    if (connectionStage.status === ConnectionStageStatus.Fail) {
      setOpen(true)
    }
  }, [connectionStage.status])

  const isConnectedToWallet =
    connectionStage.type === ConnectionStageType.Connected ||
    connectionStage.type === ConnectionStageType.ChangeNetwork

  const userAddress = useSelector(walletSelectors.userAddress)
  const ckbAddress = useSelector(walletSelectors.ckbAddress)

  const currentNetwork = useSelector(networkSelectors.network)
  const nativeTokenBalance = useSelector(walletSelectors.userNativeTokenBalance)

  const explorerUrl = {
    ckb: config.explorerUrl.ckb,
    godwoken: config.explorerUrl.godwoken,
    ethereum: config.explorerUrl.ethereum,
  }

  const addresses = [
    {
      address: userAddress || 'loading ...',
      networkName: 'Ethereum',
      explorers: [
        {
          url: `${explorerUrl.godwoken}/address/${userAddress}`,
          name: 'GODWOKEN EXPLORER',
        },
        {
          url: `${explorerUrl.ethereum}/address/${userAddress}`,
          name: 'ETH EXPLORER',
        },
      ],
    },
    {
      address: ckbAddress || 'loading ...',
      networkName: 'CKB',
      explorers: [
        {
          url: `${explorerUrl.ckb}/account/${userAddress}`,
          name: 'CKB EXPLORER',
        },
      ],
    },
  ]

  const installMetaMask = () => {
    window.open('https://metamask.io/download', '_newtab')
  }

  const connectClick = () => {
    if (
      connectionStage.type === ConnectionStageType.ConnectWallet &&
      connectionStage.status === ConnectionStageStatus.Fail
    ) {
      dispatch(
        walletActions.changeConnectionStage({
          type: ConnectionStageType.Idle,
          status: ConnectionStageStatus.Pending,
        }),
      )
    }
    setOpen(true)
  }

  const connectToMetaMask = () => {
    dispatch(
      walletActions.changeConnectionStage({
        type: ConnectionStageType.SelectWallet,
        status: ConnectionStageStatus.Pending,
      }),
    )
  }

  const onAddressClick = (address: string) => {
    navigator?.clipboard?.writeText(address)
    setOpenAddressModal(true)
  }

  const onLogoClick = () => {
    history?.push('/')
  }

  return (
    <>
      <Header
        items={Routes}
        RouterLink={RouterLink}
        onAddressClick={onAddressClick}
        ethAddress={userAddress ?? undefined}
        nativeTokenBalance={
          getDisplayValue(nativeTokenBalance, 4, 18).displayValue
        }
        onWalletButtonClick={connectClick}
        nativeTokenSymbol="CKB" // TODO
        authenticated={isConnectedToWallet}
        chainId={Number(currentNetwork)}
        onHomeClick={onLogoClick}
      />

      <ModalsContainer
        open={open}
        openAddressModal={openAddressModal}
        setOpen={(val) => setOpen(val)}
        installMetaMask={installMetaMask}
        handleCloseAddressModal={() => setOpenAddressModal(false)}
        connectToMetaMask={connectToMetaMask}
        addresses={addresses}
        connectionStage={connectionStage}
      />
    </>
  )
}

export default HeaderContainer
