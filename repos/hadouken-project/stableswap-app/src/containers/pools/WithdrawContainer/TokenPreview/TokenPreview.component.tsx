import React from 'react'

import { getTokenIconWithChainComponent } from '@hadouken-project/ui'
import { Box, Skeleton, Typography } from '@mui/material'

import { ITokenPreview } from './TokenPreview.types'

export const TokenPreview: React.FC<ITokenPreview> = ({
  symbol,
  displayName,
  balance,
  valueUSD,
  percentage,
  isFetchingBalances,
  source,
}) => {
  const TokenIcon = getTokenIconWithChainComponent(symbol, source ?? '')

  const tokenName = percentage ? `${displayName} ${percentage} %` : displayName

  return (
    <Box
      display="flex"
      p={2}
      alignItems="center"
      bgcolor={(theme) => theme.palette.background.default}
    >
      {TokenIcon ? (
        <TokenIcon height={40} width={40} />
      ) : (
        <Skeleton height={40} width={40} />
      )}
      <Box
        ml={2}
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="paragraphBig">{tokenName}</Typography>

        <Box display="flex" flexDirection="column" alignItems="flex-end">
          {isFetchingBalances && (
            <Skeleton variant="rectangular" width={25} height={15} />
          )}
          {!isFetchingBalances && (
            <Typography variant="paragraphSmall">{balance}</Typography>
          )}

          {isFetchingBalances && (
            <Skeleton
              sx={{ mt: 1 }}
              variant="rectangular"
              width={75}
              height={15}
            />
          )}
          {!isFetchingBalances && (
            <Typography variant="paragraphTiny" color="text.gray">
              ${valueUSD}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default TokenPreview
