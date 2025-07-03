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
          variant="paragraphSmall"
        >
          {text}
        </Typography>
      )
    case OperationStatus.Success:
      return (
        <Typography
          color={(theme) => theme.palette.quaternary.main}
          variant="paragraphSmall"
        >
          {text}
        </Typography>
      )
    case OperationStatus.Fail:
      return (
        <Typography
          color={(theme) => theme.palette.error.main}
          variant="paragraphSmall"
        >
          {text}
        </Typography>
      )
    case OperationStatus.Aborted:
      return (
        <Typography
          color={(theme) => theme.palette.error.main}
          variant="paragraphSmall"
        >
          {text}
        </Typography>
      )
    case OperationStatus.Waiting:
      return (
        <Typography
          color={(theme) => theme.palette.tertiary.main}
          variant="paragraphSmall"
        >
          {text}
        </Typography>
      )
    default:
      return <Typography variant="paragraphSmall">{text}</Typography>
  }
}

export default OperationTitle
