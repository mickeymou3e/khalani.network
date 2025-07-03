import React from 'react'

import { getStakeTokenIcon } from '@components/lending/LendingTokenBox/LendingTokenBox.utils'
import { getTokenComponent } from '@utils/icons'
import { getNetworkIcon } from '@utils/network'

import { IconBackground } from '../icons.styled'
import { ITokenWithNetwork } from './TokenWithNetwork.types'

const TokenWithNetwork: React.FC<ITokenWithNetwork> = (props) => {
  const {
    chainId,
    tokenSymbol,
    tokenIconSize,
    networkIconSize,
    isStkToken,
    displayBackground = false,
  } = props

  const iconParams = {
    style: {
      width: networkIconSize?.width || 17,
      height: networkIconSize?.height || 17,
      right: -8,
      bottom: -1,
      position: 'absolute' as const,
    },
  }

  const icon = isStkToken ? (
    getStakeTokenIcon(tokenSymbol, { width: 24, height: 24 })
  ) : (
    <>
      {getTokenComponent(tokenSymbol, tokenIconSize)}

      {chainId && getNetworkIcon(chainId, iconParams)}
    </>
  )

  return chainId && displayBackground ? (
    <IconBackground position="relative">{icon}</IconBackground>
  ) : (
    icon
  )
}

export default TokenWithNetwork
