import { BigNumber } from 'ethers'

import { TypographyProps } from '@mui/material'

export interface BigNumberWithTooltipProps {
  value: BigNumber
  roundingDecimals?: number
  decimals: number
  showDollars?: boolean
  color?: string
  isFetching?: boolean
  textAlign?: TypographyProps['textAlign']
  variant?: TypographyProps['variant']
}
