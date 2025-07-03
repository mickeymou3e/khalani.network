import { Environments } from '@hadouken-project/lending-contracts'
import { BigNumber } from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

export const ENVIRONMENT = process.env.CONFIG as Environments

export const RAY = BigNumber.from(10).pow(27)
export const HALF_RAY = RAY.div(2)
export const SECONDS_PER_YEAR = 31556926
export const MAX_BIG_NUMBER = BigNumber.from(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
)
export const ETH_DECIMALS = 18
export const PERCENTAGE_DECIMAL = 4
export const HEALTH_FACTOR_DECIMAL = 18
export const PRICE_DECIMALS = 9
export const PERCENTAGE_FACTOR = BigNumber.from(1e4) //percentage plus two decimals
export const HALF_PERCENT = PERCENTAGE_FACTOR.div(2)
export const LIQUIDATION_CLOSE_FACTOR_PERCENT = 5 * 10 ** 3
export const WAIT_TRANSACTION_IN_BLOCKS = 2
