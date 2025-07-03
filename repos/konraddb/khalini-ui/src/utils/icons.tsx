import React, { ReactElement } from 'react'

import {
  BnbIcon,
  BtcIcon,
  BusdBoostedIcon,
  BusdIcon,
  CkbIcon,
  DaiIcon,
  EthIcon,
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
  switch (tokenSymbol?.replace(/(["|()"].+)\w+/g, '').toUpperCase()) {
    case 'DAI':
    case 'HDAI':
      return <DaiIcon style={{ height: 40, width: 40, ...size }} />

    case 'USDC':
    case 'HUSDC':
      return <UsdcIcon style={{ height: 40, width: 40, ...size }} />

    case 'USDT':
    case 'HUSDT':
      return <UsdtIcon style={{ height: 40, width: 40, ...size }} />

    case 'CKB':
    case 'HCKB':
      return <CkbIcon style={{ height: 40, width: 40, ...size }} />

    case 'BTC':
    case 'HBTC':
      return <BtcIcon style={{ height: 40, width: 40, ...size }} />

    case 'BUSD':
    case 'HBUSD':
      return <BusdIcon style={{ height: 40, width: 40, ...size }} />

    case 'ETH':
    case 'HETH':
      return <EthIcon style={{ height: 40, width: 40, ...size }} />

    case 'BNB':
    case 'HBNB':
      return <BnbIcon style={{ height: 40, width: 40, ...size }} />

    case 'WBTC':
    case 'HWBTC':
      return <WbtcIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-LNR-USDC':
    case 'HDK-USDC':
      return <UsdcBoostedIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-LNR-USDT':
    case 'HDK-USDT':
      return <UsdtBoostedIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-BUSD':
      return <BusdBoostedIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-B-2POOL':
      return <LpTokenBoostedIcon style={{ height: 40, width: 40, ...size }} />

    case '2POOL LP':
      return <LpTokenIcon style={{ height: 40, width: 40, ...size }} />

    default:
      return <Skeleton variant="circular" width={40} height={40} {...size} />
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
