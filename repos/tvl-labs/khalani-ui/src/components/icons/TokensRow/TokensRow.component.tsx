import React from 'react'

import { Box } from '@mui/material'
import { getTokenComponent } from '@utils/icons'

import { TokensRowProps } from './TokensRow.types'

const TokensRow: React.FC<TokensRowProps> = (props) => {
  const { tokenSymbols } = props

  const iconParams = {
    width: 28,
    height: 29,
  }

  return (
    <Box display="flex" alignItems="center" ml={1.75}>
      {tokenSymbols.map((tokenSymbol) => (
        <Box key={tokenSymbol} ml={-1.75} lineHeight="initial">
          {getTokenComponent(tokenSymbol, iconParams)}
        </Box>
      ))}
    </Box>
  )
}

export default TokensRow
