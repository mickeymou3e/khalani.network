import { BigNumber } from 'ethers'

import { MAX_BIG_NUMBER } from '@constants/Ethereum'
import { HEALTH_FACTOR_DECIMAL } from '@constants/Lending'
import { Environments } from '@hadouken-project/lending-contracts'
import {
  convertBigNumberToDecimal,
  getDisplayingValue,
  truncateToSpecificDecimals,
} from '@hadouken-project/ui'

export const ENVIRONMENT = (() => {
  const env = process.env.CONFIG as Environments

  return env
})()

export const bigNumberToString = (
  value: BigNumber,
  decimals: number,
  displayDecimals: number,
): string =>
  truncateToSpecificDecimals(
    convertBigNumberToDecimal(value, decimals),
    displayDecimals,
  )

const NO_BORROWS = 'N/A'

export const getHealthFactorLabel = (healthFactor: BigNumber): string =>
  healthFactor.eq(MAX_BIG_NUMBER)
    ? NO_BORROWS
    : getDisplayingValue(
        Number(convertBigNumberToDecimal(healthFactor, HEALTH_FACTOR_DECIMAL)),
        2,
      )

export const formatNetworkName = (name: string) =>
  name.split(' ').join('-').toLowerCase()
