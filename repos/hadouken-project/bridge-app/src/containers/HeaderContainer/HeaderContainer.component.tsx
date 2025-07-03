import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, useHistory } from 'react-router-dom'

import { BigNumber } from 'ethers'

import ModalManager from '@components/modals/ModalsManager/ModalsManager.component'
import { Header } from '@hadouken-project/ui'
import { StoreDispatch } from '@store/store.types'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import { ConnectionState, ConnectionStatus } from '@store/wallet/wallet.types'
import { getNativeTokenSymbol } from '@store/wallet/wallet.utils'
import { getDisplayValue } from '@utils/stringOperations'

import { getExplorerAddresses, getRoutes } from './HeaderContainer.constants'

export const usePushHistoryInternal = (): ((
  path: string,
  search?: string,
) => void) => {
  const history = useHistory()
  const pushHistory = useCallback(
    (path: string, search?: string) =>
      history.push({
        pathname: path,
        state: { internalNavigation: true },
        search: search,
      }),
    [history],
  )

  return pushHistory
}

const HeaderContainer: React.FC = () => {
  const pushHistoryInternal = usePushHistoryInternal()

  const { connectionState, status } = useSelector(
    walletSelectors.connectionStateStatus,
  )
  const isConnectedToWallet =
    connectionState === ConnectionState.ChangeNetwork ||
    connectionState === ConnectionState.Connected

  const ethAddress = useSelector(walletSelectors.ethAddress)
  const ckbAddress = useSelector(walletSelectors.ckbAddress)
  const nativeTokenBalance = useSelector(walletSelectors.userNativeTokenBalance)
  const chainId = useSelector(walletSelectors.chainId)

  const addresses = useMemo(
    () => getExplorerAddresses(ethAddress, ckbAddress),
    [ethAddress, ckbAddress],
  )

  const [open, setOpen] = useState(false)
  const [openAddressModal, setOpenAddressModal] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [connectionState])

  const onAddressClick = (address: string) => {
    navigator?.clipboard?.writeText(address)
    setOpenAddressModal(true)
  }

  const onWalletButtonClick = () => {
    setOpen(true)
  }

  const dispatch = useDispatch<StoreDispatch>()
  const onConnectToMetaMask = () => {
    dispatch(
      walletActions.changeConnectionStateStatus({
        connectionState: ConnectionState.Select,
        status: ConnectionStatus.pending,
      }),
    )
  }
  return (
    <>
      <Header
        RouterLink={RouterLink}
        items={getRoutes()}
        ethAddress={ethAddress}
        onAddressClick={onAddressClick}
        onWalletButtonClick={onWalletButtonClick}
        authenticated={isConnectedToWallet}
        nativeTokenBalance={
          getDisplayValue(nativeTokenBalance, 4, 18).displayValue
        }
        onHomeClick={() => pushHistoryInternal('/')}
        isFetchingNativeTokenBalance={nativeTokenBalance ? false : true}
        nativeTokenSymbol={getNativeTokenSymbol(chainId)}
        chainId={chainId ? BigNumber.from(chainId).toNumber() : null}
      />

      <ModalManager
        open={open}
        status={status}
        openAddressModal={openAddressModal}
        setOpen={(val) => setOpen(val)}
        handleCloseAddressModal={() => setOpenAddressModal(false)}
        addresses={addresses}
        connectionState={connectionState}
        connectToMetaMask={onConnectToMetaMask}
      />
    </>
  )
}

export default HeaderContainer
