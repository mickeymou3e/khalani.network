import React from 'react'

import { resolveNetworkName } from '@components/account/NetworkDetails/NetworkDetails.utils'
import TokenWithBackground from '@components/icons/TokenWithBackground'
import { Box, Typography } from '@mui/material'
import { formatFullTokenSymbol } from '@utils/tokens'

import { TokenWithNetwork } from '..'
import { RoundedBox } from './LiquidityHeader.styled'
import { ILiquidityHeaderProps } from './LiquidityHeader.types'

const LiquidityHeader: React.FC<ILiquidityHeaderProps> = (props) => {
  const { tokenSymbols, chainId } = props

  const tokenIconSize = { width: 40, height: 40 }
  const chainName = resolveNetworkName(chainId)

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <RoundedBox>
        {tokenSymbols.length === 1 ? (
          <TokenWithNetwork
            tokenSymbol={tokenSymbols[0]}
            chainId={chainId}
            tokenIconSize={tokenIconSize}
            networkIconSize={{ width: 24, height: 24 }}
          />
        ) : (
          tokenSymbols.map((tokenSymbol, i) => (
            <TokenWithBackground
              key={`${tokenSymbol}-${i}`}
              tokenSymbol={tokenSymbol}
              tokenIconSize={tokenIconSize}
            />
          ))
        )}
      </RoundedBox>
      <Typography variant="subtitle2">
        {formatFullTokenSymbol(tokenSymbols)} on {chainName}
      </Typography>
    </Box>
  )
}

export default LiquidityHeader
