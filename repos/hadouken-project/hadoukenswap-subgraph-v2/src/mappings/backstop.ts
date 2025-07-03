import { Liquidation as LiquidationEvent } from '../types/Backstop/Backstop'
import { Liquidation } from '../types/schema'

export function handleLiquidation(event: LiquidationEvent): void {
  let id = event.transaction.hash.toHex()

  let liquidation = new Liquidation(id)
  liquidation.user = event.params.user
  liquidation.repayAmount = event.params.repayAmount
  liquidation.profit = event.params.profit
  liquidation.debtToken = event.params.debtToken
  liquidation.collateralToken = event.params.collateralToken
  liquidation.timestamp = event.block.timestamp.toI32()
  liquidation.save()
}
