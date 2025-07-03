import React from 'react'

import {
  convertNumberToStringWithCommas,
  getTokenIconWithChainComponent,
} from '@hadouken-project/ui'
import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

import { ITokenPreviewProps } from './TokensPreview.type'

const TokensPreview: React.FC<ITokenPreviewProps> = ({ tokens }) => {
  return (
    <>
      {tokens.map((token) => {
        const Icon = getTokenIconWithChainComponent(token.symbol, token.source)
        return (
          <Box
            key={token.id}
            display="flex"
            justifyContent="space-between"
            p={2}
            bgcolor={(theme) => theme.palette.background.default}
            minWidth={(theme) => theme.spacing(40)}
            gap={2}
          >
            <Box overflow="hidden" display="flex" alignItems="center" gap={2}>
              <Box minHeight={45} minWidth={40}>
                <Icon width={40} height={40} />
              </Box>

              <Typography
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                variant="paragraphBig"
              >
                {`${convertNumberToStringWithCommas(
                  token.amount.toNumber(),
                  4,
                  true,
                )} ${token.displayName}`}
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
            >
              <Typography variant="paragraphSmall" textAlign="end">
                ${convertNumberToStringWithCommas(token.amountUSD.toNumber())}
              </Typography>
              <Typography
                variant="paragraphTiny"
                textAlign="end"
                color={(theme) => alpha(theme.palette.text.primary, 0.7)}
              >
                {token.percentage.toFixed(2)}%
              </Typography>
            </Box>
          </Box>
        )
      })}
    </>
  )
}

export default TokensPreview
