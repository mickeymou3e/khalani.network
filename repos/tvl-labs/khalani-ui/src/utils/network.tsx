import React, { ReactElement } from 'react'

import {
  BinanceLogo,
  EthereumLogo,
  WrongLogo,
  AvalancheLogo,
  KhalaniLogo,
  PolygonLogo,
  OptimismLogo,
  ArbitrumLogo,
  GodwokenLogo,
  BaseLogo,
} from '@components/icons'
import { ENetwork, IIcon } from '@interfaces/core'

export const getNetworkIcon = (
  chainId: number | undefined,
  customParams?: IIcon,
): ReactElement => {
  switch (chainId) {
    case ENetwork.EthereumSepolia:
    case ENetwork.Ethereum:
    case ENetwork.Holesky:
      return <EthereumLogo {...customParams} />
    case ENetwork.BscTestnet:
    case ENetwork.BscMainnet:
      return <BinanceLogo {...customParams} />
    case ENetwork.AvalancheTestnet:
    case ENetwork.Avalanche:
      return <AvalancheLogo {...customParams} />
    case ENetwork.ArcadiaMainnet:
    case ENetwork.Khalani:
      return <KhalaniLogo {...customParams} />
    case ENetwork.MumbaiTestnet:
      return <PolygonLogo {...customParams} />
    case ENetwork.OptimismSepolia:
      return <OptimismLogo {...customParams} />
    case ENetwork.ArbitrumOne:
    case ENetwork.ArbitrumSepolia:
      return <ArbitrumLogo {...customParams} />
    case ENetwork.GodwokenTestnet:
      return <GodwokenLogo {...customParams} />
    case ENetwork.BaseSepolia:
      return <BaseLogo {...customParams} />
    default:
      return <WrongLogo {...customParams} />
  }
}
