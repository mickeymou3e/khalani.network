import React, { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import { SelectNetworkModal } from '@hadouken-project/ui'
import { networkSelectors } from '@store/network/network.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import {
  checkIsSupportedNetworkInUrl,
  formatChainIdToHex,
  formatNetworkName,
  getNetworkName,
} from '@utils/network'

import { config } from '../../utils/network'

export const SelectNetwork = ({
  shouldBeAlwaysOpen = false,
}: {
  shouldBeAlwaysOpen: boolean
}): ReactElement => {
  const dispatch = useDispatch()
  const { pathname } = useLocation()

  const open = useSelector(walletSelectors.isOpenNetworkModal)
  const history = useHistory()

  const applicationChainId = useSelector(networkSelectors.applicationChainId)

  const supportedNetworksModal = config.supportedNetworks.map((network) => ({
    name: getNetworkName(network.toString()),
    chainId: Number(network),
  }))

  const isSupportedNetworkInUrl = checkIsSupportedNetworkInUrl(pathname)
  const handleClose = () => dispatch(walletActions.closeNetworkModal())

  const redirectToChainPage = (chainId: number) => {
    if (chainId === null) return

    const hexChainId = formatChainIdToHex(chainId)

    const networkName = formatNetworkName(getNetworkName(hexChainId))

    //* NOTE: we need to use window.location because history from router breaks metamask request (eth_accounts)
    window.location.pathname = `/swap/${networkName}`
  }

  useEffect(() => {
    if (supportedNetworksModal.length === 1) {
      const singleNetwork = formatChainIdToHex(
        supportedNetworksModal[0].chainId,
      )

      const networkName = getNetworkName(singleNetwork.toString())
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

  return (
    <SelectNetworkModal
      open={open}
      networks={supportedNetworksModal}
      currentNetwork={Number(applicationChainId)}
      handleClose={handleClose}
      onSelect={redirectToChainPage}
      shouldBeAlwaysOpen={shouldBeAlwaysOpen}
    />
  )
}
