import React from 'react'

import { Box, Input, Typography } from '@mui/material'

import { messages } from './WithdrawalAddress.messages'
import { IWithdrawalAddressProps } from './WithdrawalAddress.types'

const WithdrawalAddress: React.FC<IWithdrawalAddressProps> = (props) => {
  const { destinationChainName, onAddressChange } = props

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    onAddressChange(event.currentTarget.value)
  }

  return (
    <Box mt={4}>
      <Typography sx={{ mb: 1, opacity: 0.7 }} variant="paragraphMedium">
        {messages.WITHDRAWAL_INPUT_PLACEHOLDER}
      </Typography>
      <Input
        placeholder={`Enter ${destinationChainName} address`}
        onChange={handleChange}
        fullWidth
      />
    </Box>
  )
}

export default WithdrawalAddress
