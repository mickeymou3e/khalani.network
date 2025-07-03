import React from 'react'

import { Box, Card, Grid, ListItem, Typography } from '@mui/material'

import { ICardProps } from '../Card.types'
import { messages } from './BalanceCard.messages'

const BalanceCard: React.FC<ICardProps> = (cardProps) => {
  const { row, onRowClick, ...rest } = cardProps
  return (
    <Card onClick={() => onRowClick?.(row.id)} elevation={2} {...rest}>
      <ListItem alignItems="center">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            {row.cells.assets.value}
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography
                variant="caption"
                color={(theme) => theme.palette.text.secondary}
              >
                {messages.BALANCE}
              </Typography>
              <Box width="100%">{row.cells.balance.value}</Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography
                variant="caption"
                color={(theme) => theme.palette.text.secondary}
              >
                {messages.APY}
              </Typography>
              <Typography variant="paragraphBig">
                {row.cells.APY.value}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="flex-start"
              gap={2}
            >
              <Typography
                variant="caption"
                color={(theme) => theme.palette.text.secondary}
              >
                {messages.CAN_BE_COLLATERAL}
              </Typography>
              {row.cells.canBeCollateral.value}
            </Box>
          </Grid>
        </Grid>
      </ListItem>
    </Card>
  )
}
export default BalanceCard
