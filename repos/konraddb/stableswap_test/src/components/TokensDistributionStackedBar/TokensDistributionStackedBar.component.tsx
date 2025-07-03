import React from 'react'

import { Box } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'

import TokenBar from './TokenBar'
import { ITokenPreview } from './TokenBar/TokenBar.types'

export interface ITokensDistributionStackedBarProps {
  loading?: boolean
  tokens: ITokenPreview[] | null
}
export const colors = ['#FFC700', '#50B5FF', '#50FF6C', '#FB71E5']

const TokensDistributionStackedBar: React.FC<ITokensDistributionStackedBarProps> = ({
  loading,
  tokens,
}) => {
  return (
    <Box
      display="flex"
      width="100%"
      padding={0.5}
      height={56}
      sx={{
        '& > *:not(:last-child)': {
          marginRight: 0.5,
        },
        border: (theme) => `1px solid ${theme.palette.primary.light}`,
      }}
    >
      {tokens &&
      tokens.length > 0 &&
      !(loading !== undefined && loading === true) ? (
        tokens.map(({ symbol, percentage }, index) => (
          <TokenBar
            key={symbol}
            symbol={symbol}
            color={colors[index % (colors.length - 1)]}
            percentage={percentage}
          />
        ))
      ) : (
        <Skeleton variant="rectangular" width="100%" height="100%" />
      )}
    </Box>
  )
}

export default TokensDistributionStackedBar
