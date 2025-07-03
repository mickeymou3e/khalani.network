import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import { BigNumber } from 'ethers'

import { getNetworkName } from '@hadouken-project/lending-contracts'
import { SelectNetworkModal } from '@hadouken-project/ui'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import {
  checkIsSupportedNetworkInUrl,
  formatChainIdToHex,
  getSupportedNetworksInApplication,
} from '@utils/network'

export const SelectNetwork = ({
  shouldBeAlwaysOpen = false,
}: {
  shouldBeAlwaysOpen: boolean
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const supportedNetworks = getSupportedNetworksInApplication()

  const { pathname } = useLocation()
  if (supportedNetworks === null) throw Error('Wrong Network configuration')

  const isSupportedNetworkInUrl = checkIsSupportedNetworkInUrl(pathname)

  const supportedNetworksModal = supportedNetworks.map((network) => ({
    name: getNetworkName(network.toString()),
    chainId: BigNumber.from(network).toNumber(),
  }))

  const open = useSelector(walletSelectors.isOpenNetworkModal)

  const applicationChainId = useSelector(walletSelectors.applicationChainId)

  const redirectToChainPage = (chainId: number) => {
    if (chainId === currentChainId) return

    const hexChainId = formatChainIdToHex(chainId)

    const networkName = getNetworkName(hexChainId)
      .split(' ')
      .join('-')
      .toLowerCase()

    //* NOTE: we need to use window.location because history from router breaks metamask request (eth_accounts)
    window.location.pathname = `/lend/${networkName}`
  }
  // remove after zksync mainnet deploy
  useEffect(() => {
    if (supportedNetworks.length === 1) {
      const singleNetwork = supportedNetworks[0]

      const networkName = getNetworkName(singleNetwork)
        .split(' ')
        .join('-')
        .toLowerCase()

      if (!isSupportedNetworkInUrl) {
        history.push(`/${networkName}`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (shouldBeAlwaysOpen) {
    return (
      <SelectNetworkModal
        open={true}
        networks={supportedNetworksModal}
        currentNetwork={undefined}
        handleClose={() => null}
        onSelect={redirectToChainPage}
        shouldBeAlwaysOpen={true}
      />
    )
  }

  const currentChainId = Number(applicationChainId)

  const handleClose = () => dispatch(walletActions.closeNetworkModal())

  return (
    <SelectNetworkModal
      open={open}
      networks={supportedNetworksModal}
      currentNetwork={currentChainId}
      handleClose={handleClose}
      onSelect={redirectToChainPage}
      shouldBeAlwaysOpen={false}
    />
  )
}
