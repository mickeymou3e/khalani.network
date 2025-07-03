import React from 'react'

import { Box, Card, Grid, ListItem, Typography } from '@mui/material'

import { ICardProps } from '../Card.types'
import { messages } from './BorrowCard.messages'

const BorrowCard: React.FC<ICardProps> = (cardProps) => {
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
                {messages.VARIABLE_APY}
              </Typography>
              <Typography variant="paragraphMedium">
                {row.cells.VariableAPY.value}
              </Typography>
            </Box>
          </Grid>

          {/* <Grid item xs={6}> // TODO-HDK-652 bring back stable borrow
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography
                variant="caption"
                color={(theme) => theme.palette.text.secondary}
              >
                {messages.STABLE_APY}
              </Typography>
              <Typography variant="paragraphMedium">
                {row.cells.StableAPY.value}
              </Typography>
            </Box>
          </Grid> */}
        </Grid>
      </ListItem>
    </Card>
  )
}
export default BorrowCard
