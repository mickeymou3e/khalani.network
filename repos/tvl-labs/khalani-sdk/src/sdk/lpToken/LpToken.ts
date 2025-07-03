import { DecimalType } from '../amount'
import { LpTokenName } from './lpTokenName'
import { Token } from '../token'
import { Address } from '@store/tokens/tokens.types'

export class LpToken implements Token {
  constructor(
    public readonly address: Address,
    public readonly name: LpTokenName,
    public readonly symbol: string,
    public readonly decimals: DecimalType,
  ) {}

  toString() {
    return `LP token ${this.name} ${this.address}`
  }
}
