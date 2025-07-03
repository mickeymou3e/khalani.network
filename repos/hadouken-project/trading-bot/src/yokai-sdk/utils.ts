import { getAddress } from '@ethersproject/address'
import { BigNumber } from 'ethers'
import { BigintIsh } from '@yokai-sdk/constants'

export function parseBigintIsh(bigintIsh: BigintIsh): bigint {
  return typeof bigintIsh === 'bigint' ? bigintIsh : BigInt(bigintIsh)
}

export function validateAndParseAddress(address: string): string {
  return getAddress(address)
}

export const convertBigNumberToDecimal = (
  value: BigNumber,
  decimals: number,
): string => {
  if (!value || value.eq(0)) {
    return `0.${'0'.repeat(decimals)}`
  }

  const integerDecimal = value.toString()

  const isMoreNumbersInIntegerThenDecimalSupport = () =>
    integerDecimal.length > decimals

  if (isMoreNumbersInIntegerThenDecimalSupport()) {
    return (
      integerDecimal.slice(0, integerDecimal.length - decimals) +
      '.' +
      integerDecimal.slice(integerDecimal.length - decimals)
    )
  } else {
    const additionalZeros = decimals - integerDecimal.length
    const decimal = `0.${'0'.repeat(additionalZeros)}` + integerDecimal
    const decimalWithRemovedZerosAtTheEnd = decimal.replace(/0+$/, '')
    return decimalWithRemovedZerosAtTheEnd
  }
}

export const truncateToSpecificDecimals = (
  text: string,
  decimals: number,
): string => {
  if (!text) return ''

  const dotPlace = text.indexOf('.')

  if (dotPlace < 0) return (text + '.').padEnd(text.length + 1 + decimals, '0')

  const lengthOfText = dotPlace + decimals + 1

  if (decimals <= 0) {
    return text.slice(0, dotPlace + 1)
  }

  if (text.length > lengthOfText) {
    return text.slice(0, lengthOfText)
  }

  if (text.length < lengthOfText) {
    return text.padEnd(lengthOfText, '0')
  }
  return text
}

export const bigNumberToString = (
  value: BigNumber,
  decimals: number,
  displayDecimals: number,
): string =>
  truncateToSpecificDecimals(
    convertBigNumberToDecimal(value, decimals),
    displayDecimals,
  )

export const ZERO = BigNumber.from(0)
export const ONE = BigNumber.from(10).pow(18)
export const TWO = ONE.mul(2)
export const FOUR = ONE.mul(4)
export const MAX_POW_RELATIVE_ERROR = BigNumber.from(10000)

export const divDown = (a: BigNumber, b: BigNumber): BigNumber => {
  if (a.eq(ZERO)) {
    return ZERO
  } else {
    const aInflated = a.mul(ONE)

    return aInflated.div(b)
  }
}

export const divUp = (a: BigNumber, b: BigNumber): BigNumber => {
  if (a.eq(ZERO)) {
    return ZERO
  } else {
    const aInflated = a.mul(ONE)

    // The traditional divUp formula is:
    // divUp(x, y) := (x + y - 1) / y
    // To avoid intermediate overflow in the addition, we distribute the division and get:
    // divUp(x, y) := (x - 1) / y + 1
    // Note that this requires x != 0, which we already tested for.

    return aInflated.sub(1).div(b).add(1)
  }
}

export const mulDown = (a: BigNumber, b: BigNumber): BigNumber => {
  const product = a.mul(b)

  return product.div(ONE)
}

export const mulUp = (a: BigNumber, b: BigNumber): BigNumber => {
  const product = a.mul(b)
  if (product.eq(ZERO)) {
    return ZERO
  } else {
    // The traditional divUp formula is:
    // divUp(x, y) := (x + y - 1) / y
    // To avoid intermediate overflow in the addition, we distribute the division and get:
    // divUp(x, y) := (x - 1) / y + 1
    // Note that this requires x != 0, which we already tested for.

    return product.sub(1).div(ONE).add(1)
  }
}

export const powDown = (x: BigNumber, y: BigNumber): BigNumber => {
  // Optimize for when y equals 1.0, 2.0 or 4.0, as those are very simple to implement and occur often in 50/50
  // and 80/20 Weighted Pools
  if (y.eq(ONE)) {
    return x
  } else if (y.eq(TWO)) {
    return mulDown(x, x)
  } else if (y.eq(FOUR)) {
    const square = mulDown(x, x)
    return mulDown(square, square)
  } else {
    const raw = x.pow(y)
    const maxError = mulUp(raw, MAX_POW_RELATIVE_ERROR).add(1)

    if (raw < maxError) {
      return ZERO
    } else {
      return raw.sub(maxError)
    }
  }
}

/**
 * @dev Returns x^y, assuming both are fixed point numbers, rounding up. The result is guaranteed to not be below
 * the true value (that is, the error function expected - actual is always negative).
 */
export const powUp = (x: BigNumber, y: BigNumber): BigNumber => {
  // Optimize for when y equals 1.0, 2.0 or 4.0, as those are very simple to implement and occur often in 50/50
  // and 80/20 Weighted Pools
  if (y.eq(ONE)) {
    return x
  } else if (y.eq(TWO)) {
    return mulUp(x, x)
  } else if (y.eq(FOUR)) {
    const square = mulUp(x, x)
    return mulUp(square, square)
  } else {
    const raw = x.pow(y)
    const maxError = mulUp(raw, MAX_POW_RELATIVE_ERROR).add(1)

    return raw.add(maxError)
  }
}

export const complement = (x: BigNumber): BigNumber => {
  return x.lt(ONE) ? ONE.sub(x) : ZERO
}

export const applyDecimal = (decimal: number, value: BigNumber) => {
  if (decimal > 0) return value.mul(BigNumber.from(10).pow(decimal))
  else return value.div(BigNumber.from(10).pow(decimal * -1))
}

export const toTenthPower = (decimal: number) => {
  return BigNumber.from(10).pow(decimal)
}

export const capitalize = (text: string) => {
  const lowerCasedText = text.toLowerCase()
  return lowerCasedText[0].toUpperCase() + lowerCasedText.slice(1)
}
