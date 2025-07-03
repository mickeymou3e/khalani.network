import React from 'react'

import { BigNumber } from 'ethers'

import errorPatternBackgroundImage from '@assets/error-pattern.svg'
import { ErrorBanner } from '@hadouken-project/ui'
import { Theme, useMediaQuery } from '@mui/material'
import { bigNumberToString } from '@utils/stringOperations'

import { messages } from './LimitBanner.messages'
import { ILimitBannerProps } from './LimitBanner.types'

export const LimitBanner: React.FC<ILimitBannerProps> = ({
  display,
  action,
  userLimit,
  limit,
  decimals,
  displayDecimals = 3,
}) => {
  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const userLimitLabel = decimals
    ? bigNumberToString(userLimit, decimals, displayDecimals)
    : '0.000'
  const limitLabel = decimals
    ? bigNumberToString(limit, decimals, displayDecimals)
    : '0.000'
  const message = userLimit.eq(BigNumber.from(0))
    ? messages.LIMIT_REACHED
    : messages.LIMIT(limitLabel, userLimitLabel, action)
  return (
    <>
      {display && (
        <ErrorBanner
          backgroundImageUrl={errorPatternBackgroundImage}
          noFill={isMobile}
          text={message}
        />
      )}
    </>
  )
}

export default LimitBanner
