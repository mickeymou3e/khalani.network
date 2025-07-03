import { IDisplayValue } from '@shared/interfaces'

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

export const convertIntegerDecimalToDecimal = (
  value: bigint,
  decimals: number,
): string => {
  if (value === BigInt(0)) {
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
    return decimal.replace(/0+$/, '')
  }
}

export const convertDecimalToIntegerDecimal = (
  value: string,
  decimals: number,
): bigint => {
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
    return BigInt(result || 0)
  } else {
    return BigInt(
      numbersBeforeDecimal.replace(/^0+/, '') + `${'0'.repeat(decimals)}`,
    )
  }
}

export const truncateDecimals = (text: string, decimals = 2): string => {
  if (!text) return ''

  const dotPlace = text.indexOf('.')

  if (dotPlace < 0) return text

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

export const getDisplayValue = (
  value: bigint | null,
  displayDecimals: number,
  _decimals?: number,
): IDisplayValue => {
  const decimals = _decimals ? _decimals : 0

  if (!value) {
    const emptyValue = BigInt(0)
    const emptyDisplayValue = truncateDecimals(
      convertIntegerDecimalToDecimal(emptyValue, decimals),
      displayDecimals,
    )

    return {
      value: emptyValue,
      displayValue: emptyDisplayValue,
      decimals,
    }
  }

  const displayValue = truncateDecimals(
    convertIntegerDecimalToDecimal(value, decimals),
    displayDecimals,
  )

  return {
    value,
    displayValue,
    decimals,
  }
}

export const formatEthAddress = (address: string): string => {
  if (!address || address.length !== 42) {
    return '-'
  }

  const start = address.slice(0, 4)
  const end = address.slice(-4)
  return `${start}..${end}`
}

export const formatAccountAddress = (address: string): string => {
  if (!address.startsWith('0x') || address.length < 10) {
    throw new Error('Invalid Ethereum address')
  }

  const prefix = address.slice(0, 6)
  const suffix = address.slice(-4)

  return `${prefix}...${suffix}`
}
