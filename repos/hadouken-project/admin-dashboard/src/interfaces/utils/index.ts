import { BigNumber } from 'ethers'

import { TypographyProps } from '@mui/system'

export interface BigNumberWithTooltipProps {
  value: BigNumber
  decimals: number
  showDollars?: boolean
  color?: string
  textAlign?: TypographyProps['textAlign']
}
