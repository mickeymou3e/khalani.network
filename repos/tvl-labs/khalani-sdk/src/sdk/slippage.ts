import { Amount } from './amount'
import { HUNDRED_PERCENTAGE, ONE_PERCENT } from '@utils/slippage'

export class Slippage {
  constructor(private slippage: bigint) {}

  toBasisPoints(): bigint {
    return this.slippage
  }

  removeFrom(amount: Amount): Amount {
    const slippageBaseUnits =
      (amount.baseUnits * this.slippage) / HUNDRED_PERCENTAGE
    const newBaseUnits = amount.baseUnits - slippageBaseUnits
    return Amount.fromBaseUnits(newBaseUnits, amount.decimals)
  }

  static onePercent(): Slippage {
    return new Slippage(BigInt(ONE_PERCENT))
  }

  static hundredPercent(): Slippage {
    return new Slippage(BigInt(HUNDRED_PERCENTAGE))
  }
}
