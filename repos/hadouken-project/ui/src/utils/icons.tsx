import React, { ReactElement, ReactNode } from 'react'

import {
  GodwokenLogo,
  GodwokenTestnetLogo,
  MantleLogo,
  MantleTestnetLogo,
  TokenIconWithChain,
  ZksyncLogo,
  ZksyncTestnetLogo,
} from '@components/icons'
import {
  NetworkIconWithTestnet,
  NetworkIconWithTestnetProps,
} from '@components/icons/TokenIconWithChain/TokenIconWithChain.component'
import {
  BnbIcon,
  BtcIcon,
  BusdIcon,
  BusdLinearIcon,
  CelerIcon,
  CkbIcon,
  CkbLinearIcon,
  DaiIcon,
  EthIcon,
  EthLinearIcon,
  HadoukenBackstopToken,
  LpTokenBoostedIcon,
  TriCryptoBoostedCKB,
  UsdcIcon,
  UsdcLinearIcon,
  UsdtIcon,
  UsdtLinearIcon,
  WbtcIcon,
  HadoukenToken,
} from '@components/icons/tokens'
import { TriCryptoBoostedWBTC } from '@components/icons/tokens/boosted/TriCryptoBoosted'
import { BtcLinearIcon } from '@components/icons/tokens/linear/BtcLinear'
import { ISvg, ISvgRenderer } from '@interfaces/core'
import Skeleton from '@mui/material/Skeleton'

export type IconWithSubIconProps = {
  MainIcon: React.FC<ISvg>
  SubIcon?: ReactNode
  width?: number
  height?: number
  background?: boolean
}

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

export const getNetworkIconComponent = (chainId: number): ReactElement => {
  switch (chainId) {
    case 324:
      return <ZksyncLogo />
    case 280:
      return <ZksyncTestnetLogo />
    case 71401:
      return <GodwokenTestnetLogo />
    case 71402:
      return <GodwokenLogo />
    case 5000:
      return <MantleLogo />
    case 5001:
      return <MantleTestnetLogo />
    default:
      return <GodwokenLogo />
  }
}

export const getTokenComponent = (
  tokenSymbol?: string,
  size?: {
    width: number
    height: number
  },
): ReactElement | null => {
  switch (tokenSymbol?.replace(/(["|()"].+)\w+/g, '').toUpperCase()) {
    case 'DAI':
    case 'HDAI':
      return <DaiIcon style={{ height: 40, width: 40, ...size }} />

    case 'USDC':
    case 'HUSDC':
    case 'CEUSDC':
    case 'MULTIUSDC':
      return <UsdcIcon style={{ height: 40, width: 40, ...size }} />

    case 'USDT':
    case 'HUSDT':
    case 'CEUSDT':
    case 'MULTIUSDT':
      return <UsdtIcon style={{ height: 40, width: 40, ...size }} />

    case 'CKB':
    case 'PCKB':
    case 'HCKB':
    case 'DCKB':
      return <CkbIcon style={{ height: 40, width: 40, ...size }} />

    case 'BTC':
    case 'HBTC':
      return <BtcIcon style={{ height: 40, width: 40, ...size }} />

    case 'BUSD':
    case 'HBUSD':
      return <BusdIcon style={{ height: 40, width: 40, ...size }} />

    case 'ETH':
    case 'HETH':
    case 'WETH':
    case 'CEETH':
    case 'MULTIETH':
      return <EthIcon style={{ height: 40, width: 40, ...size }} />

    case 'BNB':
    case 'HBNB':
      return <BnbIcon style={{ height: 40, width: 40, ...size }} />

    case 'WBTC':
    case 'HWBTC':
    case 'MULTIWBTC':
    case 'CEWBTC':
      return <WbtcIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-LNR-WBTC':
    case 'HDK-BOOSTED-WBTC-MULTIWBTC':
    case 'HDK-HWBTC-WBTC':
      return <BtcLinearIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-LNR-USDC':
    case 'HDK-HUSDC-USDC':
    case 'HDK-USDC':
      return <UsdcLinearIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-LNR-USDT':
    case 'HDK-HUSDT-USDT':
    case 'HDK-USDT':
      return <UsdtLinearIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-BUSD':
      return <BusdLinearIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-B-2POOL':
    case 'HDK-BOOSTED-USD':
    case 'HDK-BOOSTED-USD-BUSD':
    case 'HDK-BOOSTED-USD-USDC-BSC':
    case 'HDK-BOOSTED-USD-USDT-BSC':
    case 'HDK-BOOSTED-USD-MULTIUSDC-MULTIUSDT':
      return <LpTokenBoostedIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-BOOSTED-USD-CUSDT':
    case 'HDK-BOOSTED-USD-CUSDC':
      return <CelerIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-LNR-CKB':
    case 'HDK-HCKB-CKB':
      return <CkbLinearIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-LNR-ETH':
    case 'HDK-HETH-ETH':
    case 'HDK-BOOSTED-ETH-MULTIETH':
      return <EthLinearIcon style={{ height: 40, width: 40, ...size }} />

    case 'HDK-BOOSTED-CKB-ETH-USD':
      return <TriCryptoBoostedCKB style={{ height: 40, width: 40, ...size }} />

    case 'HDK-BOOSTED-WBTC-ETH-USD':
      return <TriCryptoBoostedWBTC style={{ height: 40, width: 40, ...size }} />

    case 'HDKB':
      return (
        <HadoukenBackstopToken style={{ height: 40, width: 40, ...size }} />
      )

    case 'HDK':
      return <HadoukenToken />

    default:
      return null
  }
}

export const getTokenIconWithChainComponent = (
  tokenSymbol: string,
  tokenSource?: string,
): ISvgRenderer['icon'] => {
  return (props) => (
    <IconWrapper
      Icon={
        <TokenIconWithChain
          width={props.width}
          height={props.height}
          symbol={tokenSymbol}
          source={tokenSource}
        />
      }
      {...props}
    />
  )
}

export const isTriCrypto = (symbol: string): boolean =>
  symbol.toLowerCase() === 'hdk-boosted-ckb-eth-usd' ||
  symbol.toLowerCase() === 'hdk-boosted-wbtc-eth-usd'

export const getTokenChainIconTestnetComponent = (
  network: NetworkIconWithTestnetProps['network'],
): ISvgRenderer['icon'] => {
  return (props) => (
    <IconWrapper
      Icon={
        <NetworkIconWithTestnet
          width={props.width}
          height={props.height}
          network={network}
        />
      }
      {...props}
    />
  )
}

export const getTokenIconComponent = (
  tokenSymbol?: string,
): ISvgRenderer['icon'] => {
  return (props) => {
    const icon = getTokenComponent(tokenSymbol)

    if (icon) {
      return <IconWrapper Icon={icon} {...props} />
    } else {
      return <Skeleton variant="circular" width={40} height={40} />
    }
  }
}

export const getCustomIconComponent = (
  icon: ReactElement,
): ISvgRenderer['icon'] => {
  return (props) => <IconWrapper Icon={icon} {...props} />
}
