import React, { ReactNode } from 'react'

import { getTokenIconComponent, IPoolToken } from '@hadouken-project/ui'
import { PoolType } from '@interfaces/pool'
import { Box, Grid } from '@mui/material'
import { BigDecimal } from '@utils/math'

import { LpTokenCalculationResult } from './WithdrawContainer.types'

export const calculateMaxAvailableUserLpTokenBalance = (
  poolType: PoolType,
  lpToken: IPoolToken,
  totalShare: BigDecimal,
  userLpTokenBalance: BigDecimal,
): LpTokenCalculationResult => {
  if (poolType === PoolType.Weighted || poolType === PoolType.WeightedBoosted) {
    const absMaxBpt = totalShare
      .mul(BigDecimal.from(30, lpToken.decimals))
      .div(BigDecimal.from(100, lpToken.decimals), lpToken.decimals)

    const isUserShareGreaterThanMaximumShare = userLpTokenBalance.gt(absMaxBpt)

    const userMaxLpTokenBalance = isUserShareGreaterThanMaximumShare
      ? absMaxBpt
      : userLpTokenBalance

    return {
      userMaxLpTokenBalance,
      isUserShareGreaterThanMaximumShare,
    }
  }

  return {
    userMaxLpTokenBalance: userLpTokenBalance,
    isUserShareGreaterThanMaximumShare: false,
  }
}

export const renderIconForProportional = (
  withdrawTokens: { id: string; symbol: string }[],
): ReactNode => (
  <Box display="flex">
    {withdrawTokens?.map(({ id, symbol }, index) => {
      const Icon = getTokenIconComponent(symbol)
      return (
        <Grid
          key={id}
          item
          xs={1}
          width={15}
          bgcolor="none"
          pl={index !== 0 ? 1 : 0}
        >
          <Icon key={id} />
        </Grid>
      )
    })}
  </Box>
)
