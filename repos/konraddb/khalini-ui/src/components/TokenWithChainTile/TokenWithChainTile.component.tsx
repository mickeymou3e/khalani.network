import React from 'react'

import { Avatar, Box, Paper, Typography } from '@mui/material'

import { ITokenWithChainTileProps } from './TokenWithChainTile.types'

const TokenWithChainTile: React.FC<ITokenWithChainTileProps> = (props) => {
  const { chainLogo, tokenName, amount } = props

  return (
    <Paper elevation={3} sx={{ margin: 0 }}>
      <Box display="flex" alignItems="center" gap={1.25}>
        <Avatar src={chainLogo} sx={{ width: 30, height: 30 }} />
        <Typography>{tokenName}</Typography>
      </Box>
      <Typography sx={{ ml: 5 }}>{amount}</Typography>
    </Paper>
  )
}

export default TokenWithChainTile
