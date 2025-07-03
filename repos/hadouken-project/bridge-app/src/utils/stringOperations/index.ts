import { BigNumber } from 'ethers'

import { IDisplayValue } from '@interfaces/data'

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

export const addThousandSeparators = (text: string): string => {
  return text.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

export const convertIntegerDecimalToDecimal = (
  value: BigNumber,
  decimals: number,
): string => {
  if (value.eq(0)) {
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

export const removeInsignificantZeros = (decimalString: string) =>
  decimalString.replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1')

export const bigNumberToString = (
  value: BigNumber,
  decimals: number,
  displayDecimals: number,
): string =>
  truncateDecimals(convertBigNumberToDecimal(value, decimals), displayDecimals)

export const getDisplayValue = (
  value: BigNumber,
  displayDecimals: number,
  _decimals?: number,
): IDisplayValue => {
  const decimals = _decimals ? _decimals : 0

  if (!value) {
    const emptyValue = BigNumber.from(0)
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
