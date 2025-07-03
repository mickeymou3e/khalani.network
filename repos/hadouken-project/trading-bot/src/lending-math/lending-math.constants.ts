import { BigNumber, ethers } from 'ethers'

export const SECONDS_PER_YEAR = 31556926
export const RAY = BigNumber.from(10).pow(27)
export const HALF_RAY = RAY.div(2)
export const HEALTH_FACTOR_DECIMAL = 18
export const PERCENTAGE_DECIMAL = 4
export const MAX_BIG_NUMBER = ethers.constants.MaxInt256

export const SAFE_HEALTH_FACTOR_VALUE = BigNumber.from(10).pow(
  HEALTH_FACTOR_DECIMAL,
)

export const PERCENTAGE_FACTOR = BigNumber.from(1e4) //percentage plus two decimals
export const HALF_PERCENT = PERCENTAGE_FACTOR.div(2)
export const LIQUIDATION_CLOSE_FACTOR_PERCENT = 5 * 10 ** 3
