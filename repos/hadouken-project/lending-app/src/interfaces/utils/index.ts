import { BigNumber } from 'ethers'

import { TypographyProps } from '@mui/material/Typography'

export interface BigNumberWithTooltipProps {
  value: BigNumber
  decimals: number
  showDollars?: boolean
  color?: string
  textAlign?: TypographyProps['textAlign']
  variant?: TypographyProps['variant']
}
