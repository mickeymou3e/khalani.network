import React from 'react'

import { TransactionStatus } from '@interfaces/core'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { messages } from './TransactionIcon.messages'
import { ITransactionIconProps } from './TransactionIcon.types'

const TransactionIcon: React.FC<ITransactionIconProps> = ({ status }) => {
  switch (status) {
    case TransactionStatus.Pending:
      return (
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.common.white,
          }}
          px={1.5}
        >
          <Typography
            color={(theme) => theme.palette.common.black}
            variant="breadCrumbs"
          >
            {messages.PENDING}
          </Typography>
        </Box>
      )
    case TransactionStatus.Success:
      return (
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.common.white,
          }}
          px={1.5}
        >
          <Typography
            color={(theme) => theme.palette.common.black}
            variant="breadCrumbs"
          >
            {messages.SUCCESS}
          </Typography>
        </Box>
      )
    case TransactionStatus.Fail:
      return (
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.common.white,
          }}
          px={1.5}
        >
          <Typography
            color={(theme) => theme.palette.common.black}
            variant="breadCrumbs"
          >
            {messages.FAILED}
          </Typography>
        </Box>
      )
    default:
      return <div>{messages.WRONG_STATUS}</div>
  }
}

export default TransactionIcon
