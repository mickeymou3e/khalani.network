import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom'

import ModalsContainer from '@containers/ModalsContainer/ModalsContainer.component'
import { bigNumberToString, Header } from '@hadouken-project/ui'
import { networkSelectors } from '@store/network/network.selector'
import { StoreDispatch } from '@store/store.types'
import {
  ConnectionStageStatus,
  ConnectionStageType,
} from '@store/wallet/connection/types'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'

import {
  checkIsSupportedNetworkInUrl,
  config,
  formatNetworkName,
} from '../../utils/network'
import {
  getRoutes,
  getUserExplorerAddresses,
} from './HeaderContainer.constants'
import { IHeaderContainerProps } from './HeaderContainer.types'

const { nativeCurrencies } = config

const HeaderContainer: React.FC<IHeaderContainerProps> = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const history = useHistory()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const isNetworkInUrl = checkIsSupportedNetworkInUrl(pathname)

  const [openAddressModal, setOpenAddressModal] = useState(false)
  const chainId = useSelector(networkSelectors.applicationChainId)
  const applicationNetworkName = useSelector(
    networkSelectors.applicationNetworkName,
  )

  const applicationRoutes = useMemo(() => {
    return getRoutes(formatNetworkName(applicationNetworkName ?? ''), chainId)
  }, [chainId, applicationNetworkName])

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

  const currentNetwork = useSelector(networkSelectors.applicationChainId)
  const nativeTokenBalance = useSelector(walletSelectors.userNativeTokenBalance)

  const explorers = useMemo(
    () => getUserExplorerAddresses(userAddress, ckbAddress, chainId),
    [userAddress, ckbAddress, chainId],
  )

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
    if (applicationNetworkName) {
      history.push(`/${formatNetworkName(applicationNetworkName)}`)

      return
    }
    history.push('/')
  }

  const onChainClick = () => {
    const supportedNetworks = config.supportedNetworks
    if (supportedNetworks.length > 1) {
      dispatch(walletActions.openNetworkModal())
    }
  }

  return (
    <>
      <Header
        items={applicationRoutes}
        RouterLink={RouterLink}
        onAddressClick={onAddressClick}
        ethAddress={userAddress ?? undefined}
        nativeTokenBalance={
          nativeTokenBalance
            ? bigNumberToString(nativeTokenBalance, 18)
            : undefined
        }
        onWalletButtonClick={connectClick}
        nativeTokenSymbol={nativeCurrencies[chainId]}
        authenticated={isConnectedToWallet}
        chainId={Number(currentNetwork)}
        onHomeClick={onLogoClick}
        onChainClick={onChainClick}
        hideRightPanel={!isNetworkInUrl}
      />

      <ModalsContainer
        open={open}
        openAddressModal={openAddressModal}
        setOpen={(val) => setOpen(val)}
        installMetaMask={installMetaMask}
        handleCloseAddressModal={() => setOpenAddressModal(false)}
        connectToMetaMask={connectToMetaMask}
        addresses={explorers}
        connectionStage={connectionStage}
      />
    </>
  )
}

export default HeaderContainer
