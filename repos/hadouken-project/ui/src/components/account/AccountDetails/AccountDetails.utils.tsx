import React, { ReactElement } from 'react'

import {
  BinanceLogo,
  EthereumLogo,
  GodwokenLogo,
  GodwokenTestnetLogo,
  MantleLogo,
  MantleTestnetLogo,
  WrongLogo,
  ZksyncLogo,
  ZksyncTestnetLogo,
} from '@components/icons'

export const resolveNetworkIcon = (chainId: number | null): ReactElement => {
  switch (chainId) {
    case 1: {
      return (
        <EthereumLogo
          style={{
            width: 32,
            height: 32,
          }}
        />
      )
    }
    case 71402: {
      return <GodwokenLogo style={{ width: 32, height: 32 }} />
    }
    case 71401: {
      return <GodwokenTestnetLogo width={32} height={32} />
    }
    case 56: {
      return <BinanceLogo style={{ width: 32, height: 32 }} />
    }
    case 280: {
      return <ZksyncTestnetLogo width={32} height={32} />
    }
    case 324: {
      return <ZksyncLogo style={{ width: 32, height: 32 }} />
    }
    case 5000: {
      return <MantleLogo style={{ width: 32, height: 32 }} />
    }
    case 5001: {
      return <MantleTestnetLogo width={32} height={32} />
    }
    default: {
      return <WrongLogo style={{ width: 32, height: 32 }} />
    }
  }
}

export const resolveNetworkName = (chainId: number | null): string => {
  switch (chainId) {
    case 1: {
      return 'Ethereum Mainnet'
    }
    case 71402: {
      return 'Godwoken Mainnet V1'
    }
    case 71401: {
      return 'Godwoken Testnet V1'
    }
    case 56: {
      return 'Binance Smart Chain'
    }
    case 280: {
      return 'zkSync Testnet'
    }
    case 324: {
      return 'zkSync Mainnet'
    }
    case 5000: {
      return 'Mantle Mainnet'
    }
    case 5001: {
      return 'Mantle Testnet'
    }
    default: {
      return 'Unsupported network'
    }
  }
}
