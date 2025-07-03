import React from 'react'

import { OperationStatus } from '@interfaces/core'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled'
import { CircularProgress, useTheme } from '@mui/material'

import { IOperationIconProps } from './OperationIcon.types'

const OperationIcon: React.FC<IOperationIconProps> = ({ status }) => {
  const theme = useTheme()
  switch (status) {
    case OperationStatus.Pending:
      return (
        <CircularProgress
          style={{ color: theme.palette.primary.main, width: 24, height: 24 }}
        />
      )
    case OperationStatus.Success:
      return <CheckCircleIcon style={{ color: theme.palette.success.main }} />
    case OperationStatus.Fail:
      return <ErrorIcon style={{ color: theme.palette.error.main }} />
    case OperationStatus.Aborted:
      return <CancelIcon style={{ color: theme.palette.error.main }} />
    case OperationStatus.Waiting:
      return (
        <PauseCircleFilledIcon
          style={{ color: theme.palette.secondary.main }}
        />
      )
    default:
      return <div>Icon not found</div>
  }
}

export default OperationIcon
