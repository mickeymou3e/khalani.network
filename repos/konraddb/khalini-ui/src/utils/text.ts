import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

const WRONG_ADDRESS = 'Wrong address'

const isEthereumAddress = (address: string) => address?.length === 42

const ckbRegex = new RegExp(`^(ckb|ckt)`)
const isCkbAddress = (address: string) => ckbRegex.test(address)

export const getAddressLabel = (address?: string): string => {
  if (!address || !(isEthereumAddress(address) || isCkbAddress(address))) {
    return WRONG_ADDRESS
  }

  const first = address.substring(0, 6)
  const last = address.substring(address.length - 4, address.length)
  return `${first}...${last}`
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

export const truncateDecimals = (text: string): string => {
  const [intPart, decPart] = text.split('.')
  const decPartTrimmed = decPart.replace(/0+$/, '')

  return decPartTrimmed.length > 0
    ? [intPart, decPartTrimmed].join('.')
    : intPart
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

export const bigNumberToString = (value: BigNumber, decimals: number): string =>
  truncateDecimals(convertBigNumberToDecimal(value, decimals))

export const convertDecimalToIntegerDecimal = (
  value: string,
  decimals: number,
): BigNumber => {
  const splitValue = value.split('.')

  const numbersBeforeDecimal = splitValue[0]

  const numbersAfterDecimal = splitValue.length > 1 ? splitValue[1] : null

  if (numbersAfterDecimal) {
    let afterDecimal
    if (decimals - numbersAfterDecimal.length >= 0) {
      const zerosToAdd = decimals - numbersAfterDecimal.length
      afterDecimal = numbersAfterDecimal + `${'0'.repeat(zerosToAdd)}`
    } else {
      const decimalsToRemove = numbersAfterDecimal.length - decimals
      afterDecimal = numbersAfterDecimal.slice(0, -decimalsToRemove)
    }

    const result = (numbersBeforeDecimal + afterDecimal).replace(/^0+/, '')
    return BigNumber.from(result || 0)
  } else {
    return BigNumber.from(
      numbersBeforeDecimal.replace(/^0+/, '') + `${'0'.repeat(decimals)}`,
    )
  }
}

export const getInputValue = (
  value: string,
  decimals?: number,
): string | null => {
  const decimalSupport = decimals && decimals !== 0
  const isValueEndsWithSingleDot =
    value.split('.').length - 1 === 1 && value.endsWith('.')

  const integerAmountPattern = '^\\d{0,30}'
  const decimalAmountPattern = `(\\.\\d{1,${decimals}})?$`

  if (decimalSupport) {
    const decimalLimitRegex = new RegExp(
      integerAmountPattern + decimalAmountPattern,
    )

    if (value.match(decimalLimitRegex)) {
      return value
    }
  } else {
    const integerLimitRegex = new RegExp(integerAmountPattern + '?$')

    if (value.match(integerLimitRegex)) {
      return value
    }
  }

  if (isValueEndsWithSingleDot && decimalSupport) {
    const replacedValue = value.replace(/^0+/, '')

    if (replacedValue.length === 1 && replacedValue === '.') {
      return '0.'
    }

    return replacedValue
  }

  return null
}

export const convertDecimalToBigNumber = (
  value: string,
  decimals: number,
): BigNumber => {
  const splitValue = value.split('.')

  const numbersBeforeDecimal = splitValue[0]

  const numbersAfterDecimal = splitValue.length > 1 ? splitValue[1] : null

  if (numbersAfterDecimal) {
    let afterDecimal
    if (decimals - numbersAfterDecimal.length >= 0) {
      const zerosToAdd = decimals - numbersAfterDecimal.length
      afterDecimal = numbersAfterDecimal + `${'0'.repeat(zerosToAdd)}`
    } else {
      const decimalsToRemove = numbersAfterDecimal.length - decimals
      afterDecimal = numbersAfterDecimal.slice(0, -decimalsToRemove)
    }

    const result = (numbersBeforeDecimal + afterDecimal).replace(/^0+/, '')
    return BigNumber.from(result || 0)
  } else {
    return BigNumber.from(
      numbersBeforeDecimal.replace(/^0+/, '') + `${'0'.repeat(decimals)}`,
    )
  }
}

export const formatWithMathematicalNotation = (
  n: number,
  decimals = 2,
): string => {
  if (n < 1e3) return truncateToSpecificDecimals(n.toString(), decimals)

  if (n >= 1e3 && n < 1e6)
    return (
      +Math.trunc((n / 1e3) * Math.pow(10, decimals)) / Math.pow(10, decimals) +
      'K'
    )

  if (n >= 1e6 && n < 1e9)
    return (
      +Math.trunc((n / 1e6) * Math.pow(10, decimals)) / Math.pow(10, decimals) +
      'M'
    )
  if (n >= 1e9 && n < 1e12)
    return (
      +Math.trunc((n / 1e9) * Math.pow(10, decimals)) / Math.pow(10, decimals) +
      'B'
    )
  if (n >= 1e12 && n < 1e15)
    return (
      +Math.trunc((n / 1e12) * Math.pow(10, decimals)) /
        Math.pow(10, decimals) +
      'T'
    )
  if (n >= 1e15 && n < 1e18)
    return (
      +Math.trunc((n / 1e15) * Math.pow(10, decimals)) /
        Math.pow(10, decimals) +
      'P'
    )
  if (n >= 1e18)
    return (
      +Math.trunc((n / 1e18) * Math.pow(10, decimals)) /
        Math.pow(10, decimals) +
      'E'
    )
  return '0.00'
}

export const getDisplayingValue = (
  value: number,
  roundingDecimals = 3,
  showDollars = false,
): string => {
  const parsedValue = Number(
    truncateToSpecificDecimals(value.toString(), roundingDecimals),
  )

  let valueText

  if (showDollars) {
    valueText =
      value > 0 && value < 0.01
        ? '< 0.01'
        : formatWithMathematicalNotation(parsedValue, 2)
  } else {
    valueText =
      value > 0 && value < 0.001
        ? '< 0.001'
        : formatWithMathematicalNotation(parsedValue, roundingDecimals)
  }

  if (showDollars) {
    if (valueText.includes('<')) {
      return valueText.slice(0, 2) + '$' + valueText.slice(2)
    }

    return `$${valueText}`
  }

  return valueText
}

type FormatTokenAmountBigNumber = [BigNumber, number]

type FormatTokenAmountString = [string]

export const formatTokenAmount = <T extends string | BigNumber>(
  ...args: T extends string
    ? FormatTokenAmountString
    : FormatTokenAmountBigNumber
): string => {
  const [tokenAmount, tokenDecimals] = args

  let amount = tokenAmount

  if (typeof amount !== 'string') {
    amount = formatUnits(amount, tokenDecimals)
  }

  if (Number.MAX_SAFE_INTEGER < Number(amount)) {
    if (amount.includes('.')) {
      const [value, decimals] = amount.split('.')

      const isDecimalsLengthGreaterThanMaximumDecimals = decimals.length > 4

      const formattedDecimals = isDecimalsLengthGreaterThanMaximumDecimals
        ? decimals.substring(0, 4)
        : decimals + new Array(4 - decimals.length).fill('0').join('')

      return value + '.' + formattedDecimals
    } else {
      return amount + '.0000'
    }
  } else {
    amount = Number(amount).toFixed(4)
  }

  if (Number(amount) < 0.0001) {
    return '< 0.0001'
  }

  return amount
}
