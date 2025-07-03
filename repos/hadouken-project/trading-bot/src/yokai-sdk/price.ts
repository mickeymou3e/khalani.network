import { BigintIsh, TEN } from '@yokai-sdk//constants'
import { Currency } from '@yokai-sdk//currency'
import { Fraction } from '@yokai-sdk//fraction'

export class Price extends Fraction {
  public readonly baseCurrency: Currency // input i.e. denominator
  public readonly quoteCurrency: Currency // output i.e. numerator
  public readonly scalar: Fraction // used to adjust the raw fraction w/r/t the decimals of the {base,quote}Token

  // denominator and numerator _must_ be raw, i.e. in the native representation
  public constructor(
    baseCurrency: Currency,
    quoteCurrency: Currency,
    denominator: BigintIsh,
    numerator: BigintIsh,
  ) {
    super(numerator, denominator)

    this.baseCurrency = baseCurrency
    this.quoteCurrency = quoteCurrency
    this.scalar = new Fraction(
      TEN ** BigInt(baseCurrency.decimals),
      TEN ** BigInt(quoteCurrency.decimals),
    )
  }

  public get raw(): Fraction {
    return new Fraction(this.numerator, this.denominator)
  }

  public get adjusted(): Fraction {
    return super.multiply(this.scalar)
  }

  public invert(): Price {
    return new Price(
      this.quoteCurrency,
      this.baseCurrency,
      this.numerator,
      this.denominator,
    )
  }

  public multiply(other: Price): Price {
    const fraction = super.multiply(other)
    return new Price(
      this.baseCurrency,
      other.quoteCurrency,
      fraction.denominator,
      fraction.numerator,
    )
  }

  public toSignificant(significantDigits = 6): string {
    return this.adjusted.toSignificant(significantDigits)
  }
}
