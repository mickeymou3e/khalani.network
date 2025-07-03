import React from 'react'

import { Box, Card, Typography } from '@mui/material'

import { ICardProps } from '../Card.types'
import { messages } from './UserBorrowCard.messages'

const UserBorrowCard: React.FC<ICardProps> = (cardProps) => {
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
            {messages.BORROWED}
          </Typography>
          <Box width="50%">{row.cells.borrowed.value}</Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="caption"
            color={(theme) => theme.palette.text.secondary}
          >
            {messages.APY}
          </Typography>
          <Typography variant="paragraphBig">{row.cells.APY.value}</Typography>
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
            {messages.APY_TYPE}
          </Typography>
          {row.cells.APYType.value}
        </Box>
        <Box>{row.cells.button.value}</Box>
      </Box>
    </Card>
  )
}

export default UserBorrowCard
