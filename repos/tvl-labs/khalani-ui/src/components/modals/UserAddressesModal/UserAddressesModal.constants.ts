import { ITokenBalancesAcrossChains } from '@interfaces/balances'
import { ENetwork } from '@interfaces/core'

import { UserModalTabs } from './UserAddressesModal.types'

export const tokenBalancesAcrossChains = [
  {
    tokenSymbol: 'USDT',
    summedBalance: BigInt(10501200),
    summedBalanceUSD: BigInt(10501400),
    balances: [
      { chainId: ENetwork.GodwokenTestnet, value: BigInt(510222000) },
      { chainId: ENetwork.EthereumSepolia, value: BigInt(510242000) },
    ],
  },
  {
    tokenSymbol: 'USDC',
    summedBalance: BigInt(10501200),
    summedBalanceUSD: BigInt(10501400),
    balances: [
      { chainId: ENetwork.AvalancheTestnet, value: BigInt(510222000) },
      { chainId: ENetwork.Khalani, value: BigInt(510242000) },
    ],
  },
] as ITokenBalancesAcrossChains[]

export const tabs = [
  { label: 'Assets', value: UserModalTabs.ASSETS },
  { label: 'History', value: UserModalTabs.HISTORY },
]
