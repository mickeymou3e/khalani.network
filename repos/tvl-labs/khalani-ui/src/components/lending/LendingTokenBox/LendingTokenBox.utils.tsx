import React, { ReactElement } from 'react'

import { StkBusdIcon, StkUsdcIcon, StkUsdtIcon } from '@components/icons'
import { Skeleton } from '@mui/material'

export const getStakeTokenIcon = (
  tokenSymbol: string,
  size?: {
    width: number
    height: number
  },
): ReactElement => {
  const iconParams = { style: { height: 40, width: 40, ...size } }
  switch (tokenSymbol) {
    case 'stkUSDC':
      return <StkUsdcIcon {...iconParams} />
    case 'stkUSDT':
      return <StkUsdtIcon {...iconParams} />
    case 'stkBUSD':
      return <StkBusdIcon {...iconParams} />

    default:
      return <Skeleton variant="circular" width={24} height={24} />
  }
}
