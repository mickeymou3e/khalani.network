import React from 'react'

import { Box, Card, Grid, ListItem, Typography } from '@mui/material'

import { ICardProps } from '../Card.types'
import { messages } from './LandingCard.messages'

const LandingCard: React.FC<ICardProps> = (cardProps) => {
  const { row, onRowClick, ...rest } = cardProps
  return (
    <Card onClick={() => onRowClick?.(row.id)} elevation={0} {...rest}>
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
                {messages.MARKET}
              </Typography>
              <Box>{row.cells.market.value}</Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography
                variant="caption"
                color={(theme) => theme.palette.text.secondary}
              >
                {messages.BORROWED}
              </Typography>
              <Box>{row.cells.borrowed.value}</Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="space-between"
              height="100%"
            >
              <Typography
                variant="caption"
                color={(theme) => theme.palette.text.secondary}
              >
                {messages.DEPOSIT}
              </Typography>
              <Typography variant="paragraphMedium">
                {row.cells.apy.value}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="space-between"
              height="100%"
            >
              <Typography
                variant="caption"
                color={(theme) => theme.palette.text.secondary}
              >
                {messages.BORROW_VARIABLE}
              </Typography>
              <Typography variant="paragraphMedium">
                {row.cells.variableBorrow.value}
              </Typography>
            </Box>
          </Grid>

          {/* <Grid item xs={6}> // TODO-HDK-652 bring back stable borrow
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="space-between"
              height="100%"
            >
              <Typography
                variant="caption"
                color={(theme) => theme.palette.text.secondary}
              >
                {messages.BORROW_STABLE}
              </Typography>
              <Typography variant="paragraphMedium">
                {row.cells.stableBorrow.value}
              </Typography>
            </Box>
          </Grid> */}
        </Grid>
      </ListItem>
    </Card>
  )
}

export default LandingCard
