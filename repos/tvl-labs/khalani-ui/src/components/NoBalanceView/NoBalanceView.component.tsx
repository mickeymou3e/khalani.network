import React from 'react'

import Typography from '@components/Typography'
import SecondaryButton from '@components/buttons/SecondaryButton'
import { Box, Stack } from '@mui/material'

import { NoBalanceViewProps } from './NoBalanceView.types'

const NoBalanceView: React.FC<NoBalanceViewProps> = (props) => {
  const { onClick } = props

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Stack gap={4} alignItems="center">
        <Typography text={'You Currently have no balances'} variant="h6" />
        <SecondaryButton text={'Add a New Balance'} onClick={onClick} />
      </Stack>
    </Box>
  )
}

export default NoBalanceView
