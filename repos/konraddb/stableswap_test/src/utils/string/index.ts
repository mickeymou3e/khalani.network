import { BigNumber } from 'ethers'
import numeral from 'numeral'

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

export const getRepresentativeValue = (text: string, decimals = 2): string => {
  const truncatedText = truncateDecimals(text, decimals)

  const decimalFormat = decimals > 0 ? '.' + '0'.repeat(decimals) : ''

  return numeral(truncatedText).format('0,0' + decimalFormat)
}

export const getDisplayValue = (
  value: BigNumber | null,
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

export const decimalStringToBigNumber = (
  value: string,
  decimals: number,
): BigNumber => {
  const [value1, value2] = value.split('.')
  if (!value2) {
    return BigNumber.from(value1).mul(BigNumber.from(10).pow(decimals))
  }
  const zeroPadding =
    decimals - value2.length > 0 ? '0'.repeat(decimals - value2.length) : ''
  const value2cropped =
    decimals - value2.length < 0 ? value2.slice(0, decimals) : value2

  return BigNumber.from(value1 + value2cropped + zeroPadding)
}
