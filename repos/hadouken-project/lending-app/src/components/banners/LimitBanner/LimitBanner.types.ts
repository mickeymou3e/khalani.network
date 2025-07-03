import { BigNumber } from 'ethers'

import { ActionInProgress } from '@constants/Action'

export interface ILimitBannerProps {
  display?: boolean
  action?: ActionInProgress
  userLimit: BigNumber
  decimals?: number
  displayDecimals?: number
  limit: BigNumber
}
