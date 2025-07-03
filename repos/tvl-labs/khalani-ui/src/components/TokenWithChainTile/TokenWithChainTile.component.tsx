import React from 'react'

import TokenWithBackground from '@components/icons/TokenWithBackground'
import TokenWithNetwork from '@components/icons/TokenWithNetwork'
import { Box, Typography } from '@mui/material'
import { formatWithCommas } from '@utils/text'

import { messages } from './TokenWithChainTile.messages'
import { CustomizedTile } from './TokenWithChainTile.styled'
import { ITokenWithChainTileProps } from './TokenWithChainTile.types'

const TokenWithChainTile: React.FC<ITokenWithChainTileProps> = (props) => {
  const {
    chainId,
    poolTokensSymbols,
    userPoolTokenBalanceUSD,
    liquidity,
    volume,
    poolId,
    apr,
    onClick,
  } = props

  const isCclp = poolTokensSymbols.length === 1

  return (
    <CustomizedTile
      elevation={2}
      sx={{ padding: 2, margin: 0 }}
      onClick={() => onClick(poolId)}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          {isCclp && chainId ? (
            <TokenWithNetwork
              chainId={chainId}
              tokenSymbol={poolTokensSymbols[0]}
            />
          ) : (
            poolTokensSymbols.map((symbol) => (
              <TokenWithBackground
                tokenSymbol={symbol}
                tokenIconSize={{ width: 24, height: 24 }}
                key={symbol}
              />
            ))
          )}

          <Box ml={1}>
            <Typography variant="subtitle2" color="text.primary">
              {poolTokensSymbols.join(' - ')}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Box display="flex" flexDirection="column">
            <Typography variant="caption" color="text.secondary">
              {messages.LIQUIDITY_LABEL}
            </Typography>
            <Typography variant="body2">
              ${formatWithCommas(liquidity, 18)}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="caption" color="text.secondary">
              {messages.VOLUME_LABEL}
            </Typography>
            <Typography variant="body2" textAlign="right">
              ${formatWithCommas(volume, 18)}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" flexDirection="column">
            <Typography variant="caption" color="text.secondary">
              {messages.APR_LABEL}
            </Typography>
            <Typography variant="body2">{apr}%</Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="caption" color="text.secondary">
              {messages.BALANCE_LABEL}
            </Typography>
            <Typography variant="body2" textAlign="right">
              ${userPoolTokenBalanceUSD}
            </Typography>
          </Box>
        </Box>
      </Box>
    </CustomizedTile>
  )
}

export default TokenWithChainTile
