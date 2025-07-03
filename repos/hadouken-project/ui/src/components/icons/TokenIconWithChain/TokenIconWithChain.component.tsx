import React, { ReactNode } from 'react'

import { Box, useTheme } from '@mui/material'
import { IconWithSubIconProps, getTokenIconComponent } from '@utils/icons'

import { ISvg } from '../../../interfaces/core'
import {
  BinanceLogo,
  EthereumLogo,
  GodwokenLogo,
  MantleLogo,
} from '../networks'
import TestnetLogo from '../networks/testnet'
import ZksyncLogo from '../networks/zksync'
import { BnbIcon, CelerIcon, EthIcon, MultichainIcon } from '../tokens'
import {
  ETH_SOURCE,
  ETH_SYMBOL,
  MULTIPLE_CHAINS_TOKENS,
} from './TokenIconWithChain.constants'

const IconWithSubIcon = ({
  MainIcon,
  SubIcon,
  width = 32,
  height = 32,
}: IconWithSubIconProps): JSX.Element => {
  return (
    <Box display="flex" alignItems="center" position="relative">
      <MainIcon width={width} height={height} />
      {SubIcon ? (
        <Box position="absolute" top="24px" right="-6px" zIndex="10">
          <Box zIndex="10" position="relative">
            {SubIcon}
          </Box>
          <Box
            bgcolor={(theme) => theme.palette.common.black}
            width="22px"
            height="22px"
            borderRadius="47px"
            position="absolute"
            top="-1px"
            left="-1px"
          />
        </Box>
      ) : null}
    </Box>
  )
}

const IconWithSubIconNoBackground = ({
  MainIcon,
  SubIcon,
  width = 32,
  height = 32,
}: IconWithSubIconProps): JSX.Element => {
  return (
    <Box display="flex" alignItems="center" position="relative">
      <MainIcon width={width} height={height} />
      {SubIcon ? (
        <Box position="absolute" top="16px" right="-1px" zIndex="10">
          <Box zIndex="10" position="relative">
            {SubIcon}
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}

type TokenIconWithChainProps = {
  symbol: string
  source?: string
  width?: number
  height?: number
}

const TokenIconWithChain = ({
  source,
  symbol,
  width = 32,
  height = 32,
}: TokenIconWithChainProps): JSX.Element => {
  const hideMultiChainIcon = (
    tokenSource: string,
    tokenSymbol: string,
  ): boolean => tokenSource === ETH_SOURCE && tokenSymbol === ETH_SYMBOL

  const isMultiChainToken = (symbol: string) =>
    MULTIPLE_CHAINS_TOKENS.some((multiToken) =>
      symbol?.toLowerCase().includes(multiToken.toLowerCase()),
    )

  const getChainIcon = (source: string): ReactNode | undefined => {
    const styles = {
      height: 20,
      width: 20,
    }

    switch (source) {
      case 'eth':
        return <EthIcon style={styles} />
      case 'bsc':
        return <BnbIcon style={styles} />
      case 'ce':
        return <CelerIcon style={styles} />
      case 'multi':
        return <MultichainIcon style={styles} />
      default:
        return undefined
    }
  }

  const TokenIcon = getTokenIconComponent(symbol)

  const ChainIcon =
    source && !hideMultiChainIcon(source, symbol) && isMultiChainToken(symbol)
      ? getChainIcon(source)
      : undefined

  return IconWithSubIcon({
    MainIcon: TokenIcon,
    SubIcon: ChainIcon,
    width,
    height,
  })
}

export type NetworkIconWithTestnetProps = {
  network: 'eth' | 'bsc' | 'gw' | 'zksync' | 'mantle'
  width?: number
  height?: number
}

export const NetworkIconWithTestnet = ({
  network,
  width = 32,
  height = 32,
}: NetworkIconWithTestnetProps): JSX.Element => {
  const theme = useTheme()
  const NetworkIcon = ((): React.FC<ISvg> => {
    const styles = {
      height: 32,
      width: 32,
    }

    switch (network) {
      case 'eth':
        return (props) => <EthereumLogo style={styles} {...props} />
      case 'bsc':
        return (props) => <BinanceLogo style={styles} {...props} />
      case 'gw':
        return (props) => <GodwokenLogo style={styles} {...props} />
      case 'zksync':
        return (props) => <ZksyncLogo style={styles} {...props} />
      case 'mantle':
        return (props) => <MantleLogo style={styles} {...props} />
      default:
        return (props) => <GodwokenLogo style={styles} {...props} />
    }
  })()

  return (
    <Box width={32} height={32}>
      {IconWithSubIconNoBackground({
        MainIcon: NetworkIcon,
        SubIcon: (
          <TestnetLogo
            style={{ height: 13, width: 13 }}
            fill={theme.palette.primary.main}
          />
        ),
        width,
        height,
      })}
    </Box>
  )
}

export default TokenIconWithChain
