import { BigNumber } from 'ethers'
import { BigintIsh, ONE } from '@yokai-sdk/constants'
import { bigNumberToString, parseBigintIsh } from '@yokai-sdk//utils'

export class Fraction {
  public readonly numerator: bigint
  public readonly denominator: bigint

  public constructor(numerator: BigintIsh, denominator: BigintIsh = ONE) {
    this.numerator = parseBigintIsh(numerator)
    this.denominator = parseBigintIsh(denominator)
  }

  // performs floor division
  public get quotient(): bigint {
    return this.numerator / this.denominator
  }

  // remainder after floor division
  public get remainder(): Fraction {
    return new Fraction(this.numerator % this.denominator, this.denominator)
  }

  public invert(): Fraction {
    return new Fraction(this.denominator, this.numerator)
  }

  public add(other: Fraction | BigintIsh): Fraction {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    if (this.denominator === otherParsed.denominator) {
      return new Fraction(
        this.numerator + otherParsed.numerator,
        this.denominator,
      )
    }
    return new Fraction(
      this.numerator * otherParsed.denominator +
        otherParsed.numerator * this.denominator,
      this.denominator * otherParsed.denominator,
    )
  }

  public subtract(other: Fraction | BigintIsh): Fraction {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    if (this.denominator === otherParsed.denominator) {
      return new Fraction(
        this.numerator - otherParsed.numerator,
        this.denominator,
      )
    }
    return new Fraction(
      this.numerator * otherParsed.denominator -
        otherParsed.numerator * this.denominator,
      this.denominator * otherParsed.denominator,
    )
  }

  public lessThan(other: Fraction | BigintIsh): boolean {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return (
      this.numerator * otherParsed.denominator <
      otherParsed.numerator * this.denominator
    )
  }

  public equalTo(other: Fraction | BigintIsh): boolean {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return (
      this.numerator * otherParsed.denominator ===
      otherParsed.numerator * this.denominator
    )
  }

  public greaterThan(other: Fraction | BigintIsh): boolean {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return (
      this.numerator * otherParsed.denominator >
      otherParsed.numerator * this.denominator
    )
  }

  public multiply(other: Fraction | BigintIsh): Fraction {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return new Fraction(
      this.numerator * otherParsed.numerator,
      this.denominator * otherParsed.denominator,
    )
  }

  public divide(other: Fraction | BigintIsh): Fraction {
    const otherParsed =
      other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return new Fraction(
      this.numerator * otherParsed.denominator,
      this.denominator * otherParsed.numerator,
    )
  }

  public toSignificant(significantDigits: number): string {
    const precision = 18
    const scaledValue = BigNumber.from(this.numerator)
      .mul(BigNumber.from(10).pow(precision))
      .div(BigNumber.from(this.denominator))

    return bigNumberToString(scaledValue, precision, significantDigits)
  }
}
