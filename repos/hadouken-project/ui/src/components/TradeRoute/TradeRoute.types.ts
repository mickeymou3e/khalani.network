import React from 'react'

import { IPoolToken, ISvg } from '@interfaces/core'

export interface IRouteNode {
  id: string
  name: string
  tokens: { id: string; symbol: string; icon?: React.FC<ISvg> }[]
}

type PoolWithSortedTokens = {
  [poolId: string]: {
    name: string
    tokens: { id: string; symbol: string; source?: string }[]
    symbol: string
    displayPoolIcon: boolean
  }
}

export interface ITradeRouteProps {
  inToken: IPoolToken
  inTokenValue: string
  outToken: IPoolToken
  outTokenValue: string
  routes: {
    pools: IRouteNode[]
    percentage?: string
  }[]
  onRouteNodeClick?: (id: IRouteNode['id']) => void
  poolsWithSortedTokens: PoolWithSortedTokens
}
