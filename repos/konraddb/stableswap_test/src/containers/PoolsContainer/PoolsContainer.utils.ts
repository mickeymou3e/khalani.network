import { BigNumber } from 'ethers'

import { convertIntegerDecimalToDecimal, truncateDecimals } from '@utils/string'

// TODO: currently metrics (APY, volume) have own formatters and a part of IDisplayPool where Pool Name row is created inside PoolTable
// TODO: change to renderers
const NO_DATA_PLACEHOLDER = '-'

export function formatOptional<T>({
  value,
  formatter,
}: {
  value?: T
  formatter: (value: T) => string
}): string {
  return value ? formatter(value) : NO_DATA_PLACEHOLDER
}

export const formatVirtualPrice = (virtualPrice: BigNumber): string =>
  `${truncateDecimals(convertIntegerDecimalToDecimal(virtualPrice, 18), 4)}`

export const formatAPY = (apy: BigNumber): string =>
  `${truncateDecimals(convertIntegerDecimalToDecimal(apy, 18), 4)}`

export const formatVolume = (volume: BigNumber): string => {
  if (volume.gte(BigNumber.from(1_000_000))) {
    return `$${truncateDecimals(
      convertIntegerDecimalToDecimal(volume.div(100_000), 1),
      1,
    )}m`
  } else if (volume.gte(BigNumber.from(100_000))) {
    return `$${truncateDecimals(
      convertIntegerDecimalToDecimal(volume.div(100), 1),
      1,
    )}k`
  }

  return `$${volume.toBigInt().toLocaleString()}`
}
