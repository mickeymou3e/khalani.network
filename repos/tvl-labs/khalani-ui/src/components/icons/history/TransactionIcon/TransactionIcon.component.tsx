import React from 'react'

import { ETransactionStatus } from '@interfaces/core'
import Typography from '@mui/material/Typography'

import { messages } from './TransactionIcon.messages'
import { CustomizedTransactionIcon } from './TransactionIcon.styled'
import { ITransactionIconProps } from './TransactionIcon.types'

const TransactionIcon: React.FC<ITransactionIconProps> = ({ status }) => {
  switch (status) {
    case ETransactionStatus.Pending:
      return (
        <CustomizedTransactionIcon className="pending">
          <Typography variant="caption">{messages.PENDING}</Typography>
        </CustomizedTransactionIcon>
      )
    case ETransactionStatus.Success:
      return (
        <CustomizedTransactionIcon className="success">
          <Typography variant="caption">{messages.SUCCESS}</Typography>
        </CustomizedTransactionIcon>
      )
    case ETransactionStatus.Fail:
      return (
        <CustomizedTransactionIcon className="fail">
          <Typography variant="caption">{messages.FAILED}</Typography>
        </CustomizedTransactionIcon>
      )
    default:
      return <div>{messages.WRONG_STATUS}</div>
  }
}

export default TransactionIcon
