import { ReactNode } from 'react'

import { BigNumber } from 'ethers'

export type Asset = {
  address: string
  decimals: number
  symbol: string
  symbolDescription?: string
  balance: BigNumber
  balanceInDollars: BigNumber
  icon?: ReactNode
}

export interface AssetsListProps {
  assets: Asset[]
  isFetching?: boolean
  totalBalanceDecimals?: number
  totalBalanceMessage?: string
  totalBalanceOnTop?: boolean
}
