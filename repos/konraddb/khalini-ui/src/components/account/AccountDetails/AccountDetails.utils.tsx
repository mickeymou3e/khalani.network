import React, { ReactElement } from 'react'

import {
  BinanceLogo,
  EthereumLogo,
  GodwokenLogo,
  GodwokenTestnetLogo,
  WrongLogo,
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
      return <GodwokenTestnetLogo style={{ width: 32, height: 32 }} />
    }
    case 56: {
      return <BinanceLogo style={{ width: 32, height: 32 }} />
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
    default: {
      return 'Unsupported network'
    }
  }
}
