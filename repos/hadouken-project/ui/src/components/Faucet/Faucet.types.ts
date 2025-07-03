import { ReactElement } from 'react'

import { BigNumber } from 'ethers'

export type FaucetToken = {
  id: string
  address: string
  symbol: string
  decimals: number
  source: string
  icon?: ReactElement
  name: string
  displayName: string
}

export interface IFaucetProps {
  tokens: FaucetToken[]
  inProgress?: boolean
  onMintRequest?: (address: string, amount: BigNumber) => void
}
