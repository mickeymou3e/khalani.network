import React, { ReactElement } from 'react'

import { ArbitrumLogo, AvalancheLogo, PolygonLogo } from '@components/icons'
import {
  BnbIcon,
  BtcIcon,
  BusdBoostedIcon,
  BusdIcon,
  CkbIcon,
  DaiIcon,
  EthIcon,
  KaiIcon,
  LpTokenBoostedIcon,
  LpTokenIcon,
  UsdcBoostedIcon,
  UsdcIcon,
  UsdtBoostedIcon,
  UsdtIcon,
  WbtcIcon,
} from '@components/icons/tokens'
import { ISvg, ISvgRenderer } from '@interfaces/core'
import Skeleton from '@mui/material/Skeleton'

import { formatTokenSymbol } from './tokens'

const IconWrapper = ({
  Icon,
  height = 24,
  width = 24,
  fill,
}: {
  Icon: ReactElement
} & ISvg) => {
  return React.cloneElement(Icon, {
    style: {
      height: height,
      width: width,
      fill: fill ?? 'none',
    },
  })
}

export const getTokenComponent = (
  tokenSymbol?: string,
  size?: {
    width: number
    height: number
  },
): ReactElement => {
  const iconParams = { style: { height: 24, width: 24, ...size } }
  switch (formatTokenSymbol(tokenSymbol)?.toUpperCase()) {
    case 'DAI':
    case 'HDAI':
      return <DaiIcon {...iconParams} />

    case 'USDC':
    case 'HUSDC':
      return <UsdcIcon {...iconParams} />

    case 'USDT':
    case 'HUSDT':
      return <UsdtIcon {...iconParams} />

    case 'CKB':
    case 'PCKB':
      return <CkbIcon {...iconParams} />

    case 'BTC':
    case 'HBTC':
      return <BtcIcon {...iconParams} />

    case 'BUSD':
    case 'HBUSD':
      return <BusdIcon {...iconParams} />

    case 'ETH':
    case 'HETH':
      return <EthIcon {...iconParams} />

    case 'BNB':
    case 'HBNB':
      return <BnbIcon {...iconParams} />

    case 'WBTC':
    case 'HWBTC':
      return <WbtcIcon {...iconParams} />

    case 'HDK-LNR-USDC':
    case 'HDK-USDC':
      return <UsdcBoostedIcon {...iconParams} />

    case 'HDK-LNR-USDT':
    case 'HDK-USDT':
      return <UsdtBoostedIcon {...iconParams} />

    case 'HDK-BUSD':
      return <BusdBoostedIcon {...iconParams} />

    case 'HDK-B-2POOL':
      return <LpTokenBoostedIcon {...iconParams} />

    case '2POOL LP':
      return <LpTokenIcon {...iconParams} />

    case 'KAI':
      return <KaiIcon {...iconParams} />

    case 'AVAX':
      return <AvalancheLogo {...iconParams} />

    case 'MATIC':
      return <PolygonLogo {...iconParams} />

    case 'AGOR':
      return <ArbitrumLogo {...iconParams} />

    default:
      return <Skeleton variant="circular" width={24} height={24} {...size} />
  }
}

export const getTokenIconComponent = (
  tokenSymbol?: string,
): ISvgRenderer['icon'] => {
  return (props) => (
    <IconWrapper Icon={getTokenComponent(tokenSymbol)} {...props} />
  )
}

export const getCustomIconComponent = (
  icon: ReactElement,
): ISvgRenderer['icon'] => {
  return (props) => <IconWrapper Icon={icon} {...props} />
}
