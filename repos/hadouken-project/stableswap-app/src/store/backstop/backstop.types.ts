import { Liquidation } from '@dataSource/graph/backstop/types'
import { IPoolToken } from '@dataSource/graph/pools/poolsTokens/types'
import { EntityState } from '@reduxjs/toolkit'
import { BigDecimal } from '@utils/math'

export type LiquidationReduxState = {
  liquidationToken: IPoolToken | null
  backstopToken: IPoolToken | null
  initialized: boolean | null
  backstopTotalBalance: BigDecimal
  apr: BigDecimal
  liquidations: EntityState<Liquidation>
  hasMore: boolean
}

export type InitializeBackstopSuccessPayload = {
  liquidationToken: IPoolToken
  backstopToken: IPoolToken
  poolTotalBalance: BigDecimal
  backstopAddress: string
  apr: BigDecimal
  liquidations: Liquidation[]
  hasMore: boolean
}

export type BackstopDepositRequestPayload = {
  amount: BigDecimal
}

export type BackstopDepositSuccessPayload = {
  backstopTotalBalance: BigDecimal
}

export type BackstopWithdrawRequestPayload = {
  amount: BigDecimal
}

export type BackstopWithdrawSuccessPayload = {
  backstopTotalBalance: BigDecimal
}
