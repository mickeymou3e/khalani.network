import React from 'react'

import { OperationStatus } from '@interfaces/core'
import Typography from '@mui/material/Typography'

import { IOperationTitleProps } from './OperationTitle.types'

const OperationTitle: React.FC<IOperationTitleProps> = ({ status, text }) => {
  switch (status) {
    case OperationStatus.Pending:
      return (
        <Typography
          color={(theme) => theme.palette.common.white}
          variant="subtitle2"
        >
          {text}
        </Typography>
      )
    case OperationStatus.Success:
      return (
        <Typography
          color={(theme) => theme.palette.success.main}
          variant="subtitle2"
        >
          {text}
        </Typography>
      )
    case OperationStatus.Fail:
      return (
        <Typography
          color={(theme) => theme.palette.error.main}
          variant="subtitle2"
        >
          {text}
        </Typography>
      )
    case OperationStatus.Aborted:
      return (
        <Typography
          color={(theme) => theme.palette.error.main}
          variant="subtitle2"
        >
          {text}
        </Typography>
      )
    case OperationStatus.Waiting:
      return (
        <Typography
          color={(theme) => theme.palette.secondary.main}
          variant="subtitle2"
        >
          {text}
        </Typography>
      )
    default:
      return <Typography variant="subtitle2">{text}</Typography>
  }
}

export default OperationTitle
