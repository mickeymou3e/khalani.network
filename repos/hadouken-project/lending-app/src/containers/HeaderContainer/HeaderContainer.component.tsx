import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, useLocation } from 'react-router-dom'

import { BigNumber } from 'ethers'

import ModalManager from '@components/modals/ModalsManager/ModalsManager.component'
import { getConfig } from '@hadouken-project/lending-contracts'
import { convertBigNumberToDecimal, Header } from '@hadouken-project/ui'
import { balancesSelectors } from '@store/balances/balances.selector'
import { StoreDispatch } from '@store/store.types'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import { ConnectionState, ConnectionStatus } from '@store/wallet/wallet.types'
import { usePushHistoryInternal } from '@utils/navigation'
import {
  checkIsSupportedNetworkInUrl,
  getSupportedNetworksInApplication,
} from '@utils/network'
import { ENVIRONMENT, formatNetworkName } from '@utils/stringOperations'

import { getExplorerAddresses, getRoutes } from './HeaderContainer.constants'

const HeaderContainer: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const applicationNetworkName = useSelector(
    walletSelectors.applicationNetworkName,
  )

  const { pathname } = useLocation()

  const isNetworkInUrl = checkIsSupportedNetworkInUrl(pathname)

  const applicationRoutes = useMemo(() => {
    if (applicationNetworkName) {
      const allPaths = getRoutes(formatNetworkName(applicationNetworkName))

      return allPaths
    }
  }, [applicationNetworkName])

  const { connectionState, status } = useSelector(
    walletSelectors.connectionStateStatus,
  )

  const isConnectedToWallet =
    connectionState === ConnectionState.ChangeNetwork ||
    connectionState === ConnectionState.Connected

  const applicationChainId = useSelector(walletSelectors.applicationChainId)

  const contractsConfig = getConfig(applicationChainId)?.(ENVIRONMENT)

  const l2Address = useSelector(walletSelectors.ethAddress)
  const l1Address = useSelector(walletSelectors.ckbAddress)

  const nativeBalance = useSelector(
    balancesSelectors.selectUserNativeTokenBalance,
  )

  const addresses = useMemo(
    () =>
      getExplorerAddresses({
        chainId: applicationChainId,
        l2Address,
        l1Address,
      }),
    [l2Address, l1Address, applicationChainId],
  )

  const [open, setOpen] = useState(false)
  const [openAddressModal, setOpenAddressModal] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [connectionState])

  const pushHistoryInternal = usePushHistoryInternal()

  const onAddressClick = (address: string) => {
    navigator?.clipboard?.writeText(address)
    setOpenAddressModal(true)
  }

  const onWalletButtonClick = () => {
    setOpen(true)
  }

  const onInstallMetaMask = () => {
    window.open('https://metamask.io/download', '_newtab')
  }

  const onConnectToMetaMask = () => {
    dispatch(
      walletActions.changeConnectionStateStatus({
        connectionState: ConnectionState.Select,
        status: ConnectionStatus.pending,
      }),
    )
  }

  const onHomeClick = () => {
    if (applicationNetworkName) {
      pushHistoryInternal(`/${formatNetworkName(applicationNetworkName)}`)
      return
    }

    pushHistoryInternal('/')
  }

  const onChainClick = () => {
    const supportedNetworks = getSupportedNetworksInApplication()
    if (supportedNetworks.length > 1) {
      dispatch(walletActions.openNetworkModal())
    }
  }

  return (
    <>
      <Header
        RouterLink={RouterLink}
        items={applicationRoutes}
        ethAddress={l2Address}
        chainId={applicationChainId ? Number(applicationChainId) : null}
        onAddressClick={onAddressClick}
        onWalletButtonClick={onWalletButtonClick}
        authenticated={isConnectedToWallet}
        onHomeClick={() => onHomeClick()}
        nativeTokenBalance={convertBigNumberToDecimal(
          nativeBalance?.value ?? BigNumber.from(0),
          nativeBalance?.decimals ?? 2,
        )}
        nativeTokenSymbol={contractsConfig?.nativeToken?.symbol}
        isFetchingNativeTokenBalance={
          nativeBalance?.isFetching || !nativeBalance
        }
        onChainClick={onChainClick}
        hideRightPanel={!isNetworkInUrl}
      />

      <ModalManager
        open={open}
        status={status}
        openAddressModal={openAddressModal}
        setOpen={(val) => setOpen(val)}
        installMetaMask={onInstallMetaMask}
        handleCloseAddressModal={() => setOpenAddressModal(false)}
        connectToMetaMask={onConnectToMetaMask}
        addresses={addresses}
        connectionState={connectionState}
      />
    </>
  )
}

export default HeaderContainer
