import { BigDecimal } from '@utils/math'

import { IPoolToken } from '../pools/poolsTokens/types'
import { address } from '../utils/formatters'
import { ILiquidationQueryResult, Liquidation } from './types'

export function mapLiquidationQuery(
  liquidations: ILiquidationQueryResult[],
  tokens: IPoolToken[],
): Liquidation[] {
  return liquidations.map((liquidation) =>
    mapSingleLiquidationQuery(liquidation, tokens),
  )
}

export function mapSingleLiquidationQuery(
  liquidation: ILiquidationQueryResult,
  tokens: IPoolToken[],
): Liquidation {
  const debtToken = tokens.find(
    (token) => address(token.address) === address(liquidation.debtToken),
  )

  const collateralToken = tokens.find(
    (token) => address(token.address) === address(liquidation.collateralToken),
  )

  return {
    id: liquidation.id,
    debtToken: debtToken,
    collateralToken: collateralToken,
    user: liquidation.user,
    timestamp: liquidation.timestamp,
    profit: BigDecimal.from(liquidation.profit, 18),
    repayAmount: BigDecimal.from(liquidation.repayAmount, debtToken?.decimals),
  }
}
