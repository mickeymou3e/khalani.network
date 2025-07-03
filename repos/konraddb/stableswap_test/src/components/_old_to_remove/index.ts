import { BigNumber } from 'ethers'

import { IDisplayValue } from '@interfaces/data'
import { convertIntegerDecimalToDecimal, truncateDecimals } from '@utils/string'

// Change decimals to required, displayDecimals to optional
export const getDisplayValue = (
  value: BigNumber,
  displayDecimals: number,
  _decimals?: number,
): IDisplayValue => {
  const decimals = _decimals ? _decimals : 0

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

export const addDisplayValues = (
  displayValue1: IDisplayValue,
  displayValue2: IDisplayValue,
  displayDecimals: number,
): IDisplayValue => {
  const decimals1 = displayValue1.decimals ?? 1
  const decimals2 = displayValue2.decimals ?? 1
  const resultDecimals = Math.max(decimals1, decimals2)
  const resultDecimalsDenominator = Math.min(decimals1, decimals2)

  const value1 = displayValue1.value.mul(BigNumber.from(10).pow(decimals2))
  const value2 = displayValue2.value.mul(BigNumber.from(10).pow(decimals1))
  const resultValue = value1
    .add(value2)
    .div(BigNumber.from(10).pow(resultDecimalsDenominator))

  const resultDisplayValue = getDisplayValue(
    resultValue,
    displayDecimals,
    resultDecimals,
  )

  return resultDisplayValue
}
