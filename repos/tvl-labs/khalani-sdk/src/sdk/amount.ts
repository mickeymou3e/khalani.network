import { BigDecimal } from '@utils/math'
import { Token } from './token'

export type DecimalType = 6 | 18

export class Amount {
  readonly baseUnits: bigint
  readonly decimals: DecimalType

  private constructor(baseUnits: bigint, decimals: DecimalType) {
    this.baseUnits = baseUnits
    this.decimals = decimals
  }

  static fromBaseUnits(baseUnits: bigint, decimals: DecimalType) {
    return new Amount(baseUnits, decimals)
  }

  static fromUserUnitsToken(amount: bigint, token: Token) {
    return this.fromUserUnits(amount, token.decimals)
  }

  static fromUserUnits(amount: bigint, decimals: DecimalType) {
    const baseUnits = amount * BigInt(10) ** BigInt(decimals)
    return new Amount(baseUnits, decimals)
  }

  rescaleTo(decimals: DecimalType) {
    if (this.decimals === decimals) {
      return this
    }
    if (this.decimals < decimals) {
      const upscale = BigInt(10) ** (BigInt(decimals) - BigInt(this.decimals))
      return new Amount(this.baseUnits * BigInt(upscale), decimals)
    }
    const downscale = BigInt(10) ** (BigInt(this.decimals) - BigInt(decimals))
    return new Amount(this.baseUnits / downscale, decimals)
  }

  sub(other: Amount) {
    this.assertTheSameDecimals(other)
    if (this.lt(other)) {
      throw new Error(`Negative result: ${this} < ${other}`)
    }
    return new Amount(this.baseUnits - other.baseUnits, this.decimals)
  }

  isZero() {
    return this.baseUnits === 0n
  }

  add(other: Amount) {
    this.assertTheSameDecimals(other)
    return new Amount(this.baseUnits + other.baseUnits, this.decimals)
  }

  mul(other: Amount) {
    this.assertTheSameDecimals(other)
    return new Amount(this.baseUnits * other.baseUnits, this.decimals)
  }

  div(other: Amount) {
    this.assertTheSameDecimals(other)
    return new Amount(this.baseUnits / other.baseUnits, this.decimals)
  }

  compareTo(other: Amount): 'less' | 'equal' | 'greater' {
    this.assertTheSameDecimals(other)
    if (this.baseUnits < other.baseUnits) {
      return 'less'
    }
    if (this.baseUnits === other.baseUnits) {
      return 'equal'
    }
    return 'greater'
  }

  private assertTheSameDecimals(other: Amount) {
    if (this.decimals !== other.decimals) {
      throw new Error(`Incomparable amounts ${this} and ${other}`)
    }
  }

  lt(other: Amount): boolean {
    return this.compareTo(other) === 'less'
  }

  lte(other: Amount): boolean {
    const compared = this.compareTo(other)
    return compared === 'equal' || compared === 'less'
  }

  gt(other: Amount): boolean {
    return this.compareTo(other) === 'greater'
  }

  gte(other: Amount): boolean {
    const compared = this.compareTo(other)
    return compared === 'equal' || compared === 'greater'
  }

  eq(other: Amount): boolean {
    return this.compareTo(other) === 'equal'
  }

  toString() {
    return new BigDecimal(this.baseUnits, this.decimals).toString()
  }
}

export function parseDecimals(decimals: number): DecimalType {
  if (decimals === 6 || decimals === 18) {
    return decimals
  }
  throw new Error(`Unsupported decimals ${decimals}`)
}
