import React from 'react'

import BellIcon from '@components/icons/business/Bell'
import { useTheme } from '@mui/material'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'

import { IHistoryBadgeProps } from './HistoryBadge.types'

const HistoryBadge: React.FC<IHistoryBadgeProps> = ({
  operationsInProgress,
  onClick,
}) => {
  const theme = useTheme()
  return (
    <Badge
      badgeContent={operationsInProgress > 0 ? operationsInProgress : 0}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <IconButton
        sx={{
          padding: 0,
          background: 'none',
          '&:hover': {
            background: 'none',
          },
        }}
        onClick={onClick}
      >
        <BellIcon fill={theme.palette.common.black} />
      </IconButton>
    </Badge>
  )
}

export default HistoryBadge
