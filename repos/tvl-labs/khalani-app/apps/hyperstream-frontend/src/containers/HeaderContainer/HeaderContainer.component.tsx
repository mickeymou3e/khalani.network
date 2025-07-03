import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'

import { useDisconnect } from 'wagmi'

import config from '@config'
import { useSelectWalletModal } from '@shared/components'
import { useWallet, DEFAULT_NETWORK } from '@shared/store'
import {
  Header,
  HyperstreamLogo,
  UserAddressesModal,
} from '@tvl-labs/khalani-ui'
import {
  chainsSelectors,
  getDepositDestinationChain,
  IChain,
  transactionHistorySelectors,
} from '@tvl-labs/sdk'
import sdkConfig from '@tvl-labs/sdk/dist/app/src/config'

import { Routes } from './HeaderContainer.constants'
import { useTokenBalancesAcrossChains } from './HeaderContainer.hooks'
import { IHeaderContainerProps } from './HeaderContainer.types'

// If the current connection stage is "Fail", the XYZ is shown.
const HeaderContainer: React.FC<IHeaderContainerProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [openAddressModal, setOpenAddressModal] = useState(false)
  const [currentTabId, setCurrentTabId] = useState<string | undefined>()
  const { openModal: openSelectWalletModal } = useSelectWalletModal()

  const wallet = useWallet()
  const { disconnect } = useDisconnect()

  const chains = useSelector(chainsSelectors.chains)
  const filteredChains = useMemo(
    () =>
      chains.filter((chain) => chain.chainId !== getDepositDestinationChain()),
    [chains],
  )
  const transactions = useSelector(transactionHistorySelectors.selectAll)

  const {
    tokenBalancesAcrossChains,
    accountBalance,
    isFetchingBalances,
  } = useTokenBalancesAcrossChains()

  const userAddress = wallet.account

  const currentNetwork = wallet.network
  // const nativeTokenBalance =
  //   wallet.status === 'connected' ? wallet.nativeTokenBalance : null

  const currentNetworkData = useMemo(
    () => sdkConfig.supportedChains.find((i) => i.chainId === currentNetwork),
    [currentNetwork],
  )

  // const nativeTokenSymbol = useMemo(() => {
  //   if (!currentNetwork) {
  //     return ''
  //   }

  //   const network = sdkConfig.supportedChains.find(
  //     (i) => i.chainId === currentNetwork,
  //   )

  //   if (network) {
  //     return network.nativeCurrency.symbol
  //   }
  // }, [currentNetwork])

  const connectClick = () => {
    switch (wallet.status) {
      case 'unavailable':
      case 'connecting':
      case 'connected':
        console.log(
          `Wallet is in ${wallet.status} state, so ignoring the button click`,
        )
        break
      case 'unsupportedNetwork':
        wallet.switchToNetwork(DEFAULT_NETWORK)
        break
      case 'notConnected':
        openSelectWalletModal()
        break
    }
  }

  const onAddressClick = (address: string) => {
    navigator?.clipboard?.writeText(address)
    setOpenAddressModal(true)
  }

  const onLogoClick = () => {
    navigate('/')
  }

  const disconnectWallet = () => {
    if (
      wallet.status === 'connected' ||
      wallet.status === 'unsupportedNetwork'
    ) {
      disconnect()
    }
    setOpenAddressModal(false)
  }

  useEffect(() => {
    let currentPath = location.pathname
    if (currentPath.includes('add') || currentPath.includes('remove')) {
      currentPath = currentPath.slice(0, location.pathname.lastIndexOf('/'))
    }
    Routes.map((route) => {
      const foundId = route.pages.find(
        (page) =>
          page.href.includes(currentPath) ||
          page.internalHrefs?.includes(currentPath),
      )?.id
      if (foundId) {
        setCurrentTabId(foundId)
      }
    })
  }, [location])

  const onChainSelect = (chain: IChain): void => {
    if (
      wallet.status === 'connected' ||
      wallet.status === 'unsupportedNetwork'
    ) {
      wallet.switchToNetwork(chain.chainId)
    }
  }

  const onTransactionClick = (transactionHash: string): void => {
    window.open(`${config.explorerUrl}/explorer/${transactionHash}`, '_blank')
  }

  return (
    <>
      <Header
        items={Routes}
        RouterLink={RouterLink}
        onAddressClick={onAddressClick}
        ethAddress={userAddress ?? undefined}
        onWalletButtonClick={connectClick}
        authenticated={wallet.status === 'connected'}
        selectedChainId={currentNetworkData?.id}
        chains={filteredChains}
        onChainSelect={onChainSelect}
        onHomeClick={onLogoClick}
        currentTabId={currentTabId}
        showConnectWalletButton
        isUnsupportedNetwork={wallet.status === 'unsupportedNetwork'}
        headerLogo={<HyperstreamLogo />}
      />

      <UserAddressesModal
        open={openAddressModal}
        handleClose={() => setOpenAddressModal(false)}
        handleDisconnectWallet={disconnectWallet}
        tokenBalancesAcrossChains={tokenBalancesAcrossChains ?? []}
        accountAddress={userAddress ?? ''}
        accountBalance={accountBalance}
        isFetchingBalances={isFetchingBalances}
        transactions={transactions.map((transaction) => ({
          ...transaction,
          amounts: transaction.amounts,
        }))}
        onClick={onTransactionClick}
      />
    </>
  )
}

export default HeaderContainer
