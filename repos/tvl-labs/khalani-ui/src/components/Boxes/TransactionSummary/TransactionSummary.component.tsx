import React from 'react'

import Typography from '@components/Typography'
import { Box, Divider, Stack } from '@mui/material'

import { ITransactionSummaryProps } from './TransactionSummary.types'

const TransactionSummary: React.FC<ITransactionSummaryProps> = (props) => {
  const { items } = props

  return (
    <>
      {items.map((item) => (
        <Box key={item.id}>
          <Stack direction="row" justifyContent="space-between" px={1.5} py={1}>
            <Typography
              text={item.label}
              variant="caption"
              color="text.secondary"
            />
            {item.value}
          </Stack>
          <Divider />
        </Box>
      ))}
    </>
  )
}

export default TransactionSummary
