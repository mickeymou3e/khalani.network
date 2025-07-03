import { BigNumber } from 'ethers'
import { bigIntToBigNumber, bigNumberToBigInt } from './adapter'

export class BigDecimal {
  public stringValue: string
  constructor(readonly value: bigint, readonly decimals: number) {
    this.stringValue = this.toString()
  }

  static from(number: number | bigint | BigNumber, decimals = 18): BigDecimal {
    let bigIntNumber

    switch (typeof number) {
      case 'bigint':
        bigIntNumber = number
        break
      case 'number':
        bigIntNumber = BigInt(number)
        break
      case 'object':
        bigIntNumber = bigNumberToBigInt(number)
        break
      default:
        throw new Error('Invalid input type')
    }

    return new BigDecimal(bigIntNumber, decimals)
  }

  static fromString(decimalString: string, decimals = 18): BigDecimal {
    const [wholePartString, fractionPartString] = decimalString.split('.')

    const fractionPartLength = fractionPartString?.length ?? 0

    let bigNumberString
    if (decimals > fractionPartLength) {
      const additionalZeros = '0'.repeat(decimals - fractionPartLength)
      bigNumberString =
        [wholePartString, fractionPartString].join('') + additionalZeros
    } else {
      bigNumberString = [
        wholePartString,
        fractionPartString.slice(0, decimals),
      ].join('')
    }

    const value = BigInt(bigNumberString)
    return new BigDecimal(value, decimals)
  }

  public add(bigDecimal: BigDecimal): BigDecimal {
    const resultDecimals = Math.max(this.decimals, bigDecimal.decimals)
    const resultDecimalsDenominator = Math.min(
      this.decimals,
      bigDecimal.decimals,
    )

    const value1 = this.value * BigInt(10) ** BigInt(bigDecimal.decimals)
    const value2 = bigDecimal.value * BigInt(10) ** BigInt(this.decimals)
    const resultValue =
      (value1 + value2) / BigInt(10) ** BigInt(resultDecimalsDenominator)

    return new BigDecimal(resultValue, resultDecimals)
  }

  sub(bigDecimal: BigDecimal): BigDecimal {
    const resultDecimals = Math.max(this.decimals, bigDecimal.decimals)
    const resultDecimalsDenominator = Math.min(
      this.decimals,
      bigDecimal.decimals,
    )
    const value1 = this.value * BigInt(10) ** BigInt(bigDecimal.decimals)
    const value2 = bigDecimal.value * BigInt(10) ** BigInt(this.decimals)

    const resultValue =
      (value1 - value2) / BigInt(10) ** BigInt(resultDecimalsDenominator)

    return new BigDecimal(resultValue, resultDecimals)
  }

  public mul(bigDecimal: BigDecimal): BigDecimal {
    const resultDecimals = Math.max(this.decimals, bigDecimal.decimals)
    const resultDecimalsDenominator = Math.min(
      this.decimals,
      bigDecimal.decimals,
    )

    const value =
      (this.value * bigDecimal.value) /
      BigInt(10) ** BigInt(resultDecimalsDenominator)

    return new BigDecimal(value, resultDecimals)
  }

  public div(bigDecimal: BigDecimal, decimals?: number): BigDecimal {
    const divisionAccuracy = 27

    const divisionResultBN =
      bigDecimal.value === 0n
        ? BigInt(0)
        : (this.value *
            BigInt(10) **
              BigInt(
                Math.abs(
                  divisionAccuracy - this.decimals + bigDecimal.decimals,
                ),
              )) /
          bigDecimal.value

    if (decimals && decimals > 0) {
      return new BigDecimal(
        (divisionResultBN * BigInt(10) ** BigInt(decimals)) /
          BigInt(10) ** BigInt(divisionAccuracy),
        decimals,
      )
    }

    return new BigDecimal(divisionResultBN, divisionAccuracy)
  }

  public gt(bigDecimal: BigDecimal): boolean {
    const value1 = this.value * BigInt(10) ** BigInt(bigDecimal.decimals)
    const value2 = bigDecimal.value * BigInt(10) ** BigInt(this.decimals)

    return value1 > value2
  }

  public gte(bigDecimal: BigDecimal): boolean {
    const value1 = this.value * BigInt(10) ** BigInt(bigDecimal.decimals)
    const value2 = bigDecimal.value * BigInt(10) ** BigInt(this.decimals)

    return value1 >= value2
  }

  public lt(bigDecimal: BigDecimal): boolean {
    const value1 = this.value * BigInt(10) ** BigInt(bigDecimal.decimals)
    const value2 = bigDecimal.value * BigInt(10) ** BigInt(this.decimals)

    return value1 < value2
  }

  public toString(): string {
    if (this.value === 0n) {
      return '0'
    }

    const digits = this.value.toString()

    if (digits.length > this.decimals) {
      const wholePart = digits.slice(0, digits.length - this.decimals)
      const fractionPart = digits
        .slice(digits.length - this.decimals)
        .replace(/0+$/, '')
      return fractionPart ? [wholePart, fractionPart].join('.') : wholePart
    } else {
      const additionalZeros = this.decimals - digits.length
      const decimal = `0.${'0'.repeat(additionalZeros)}` + digits
      const decimalWithRemovedZerosAtTheEnd = decimal.replace(/0+$/, '')

      return decimalWithRemovedZerosAtTheEnd
    }
  }

  public toFixed(fractionDigits?: number): string {
    if (!fractionDigits) {
      return this.toString()
    }

    if (this.value === 0n) {
      return `0.${'0'.repeat(fractionDigits)}`
    }

    const digits = this.value.toString()

    let wholePart
    let fractionPart

    if (digits.length > this.decimals) {
      wholePart = digits.slice(0, digits.length - this.decimals)
      fractionPart = digits.slice(digits.length - this.decimals)

      if (fractionPart.length > fractionDigits) {
        return [wholePart, fractionPart.slice(0, fractionDigits)].join('.')
      } else {
        return (
          [wholePart, fractionPart].join('.') +
          '0'.repeat(fractionDigits - fractionPart.length)
        )
      }
    } else {
      const fractionPartLeadingZeros = this.decimals - digits.length
      wholePart = '0'
      fractionPart = '0'.repeat(fractionPartLeadingZeros) + digits
    }

    if (fractionPart.length > fractionDigits) {
      return [wholePart, fractionPart.slice(0, fractionDigits)].join('.')
    } else {
      return (
        [wholePart, fractionPart].join('.') +
        '0'.repeat(fractionDigits - fractionPart.length)
      )
    }
  }

  public toBigInt(): bigint {
    return this.value
  }

  public toBigNumber(): BigNumber {
    return bigIntToBigNumber(this.value)
  }

  public toNumber(): number {
    const stringValue = this.toString()

    return Number(stringValue)
  }
}
