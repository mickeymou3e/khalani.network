import React from 'react'

import { Box, Card, Typography } from '@mui/material'

import { ICardProps } from '../Card.types'
import { messages } from './UserDepositCard.messages'

const UserDepositCard: React.FC<ICardProps> = (cardProps) => {
  const { row, onRowClick, ...rest } = cardProps
  return (
    <Card onClick={() => onRowClick?.(row.id)} elevation={2} {...rest}>
      <Box alignItems="center" sx={{ paddingBottom: 2 }}>
        {row.cells.assets.value}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        width="100%"
        gap={2}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="caption"
            color={(theme) => theme.palette.text.secondary}
          >
            {messages.DEPOSITED}
          </Typography>
          <Box width="50%">{row.cells.balance.value}</Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="caption"
            color={(theme) => theme.palette.text.secondary}
          >
            {messages.APY}
          </Typography>
          <Typography variant="paragraphMedium">
            {row.cells.APY.value}
          </Typography>
        </Box>
        <Box
          display="inline-flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Typography
            variant="caption"
            color={(theme) => theme.palette.text.secondary}
          >
            {messages.COLLATERAL}
          </Typography>
          {row.cells.collateral.value}
        </Box>
        <Box>{row.cells.button.value}</Box>
      </Box>
    </Card>
  )
}
export default UserDepositCard
