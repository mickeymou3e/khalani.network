import { address } from '@dataSource/graph/utils/formatters'

import { ISwap } from '../poolsSwaps/types'
import { IJoinExit, LiquidityProvisionType } from './types'

export function mapComposableJoinExitQueryResult(
  swaps: ISwap[],
  poolAddress: string,
): IJoinExit[] {
  return swaps.map((swap) => {
    const liquidityType =
      address(swap.tokenIn) === address(poolAddress)
        ? LiquidityProvisionType.Exit
        : LiquidityProvisionType.Join

    const isWithdraw = liquidityType === LiquidityProvisionType.Exit

    return {
      id: swap.id,
      timestamp: swap.timestamp,
      amounts: isWithdraw ? [swap.tokenAmountOut] : [swap.tokenAmountIn],
      tx: swap.tx,
      type: liquidityType,
      symbols: isWithdraw ? [swap.tokenOutSym] : [swap.tokenInSym],
    }
  })
}
