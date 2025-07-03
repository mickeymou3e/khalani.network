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
    <IconButton
      sx={{
        background: (theme) => theme.palette.tertiary.main,
        '&:hover': {
          background: (theme) => theme.palette.tertiary.light,
        },
      }}
      onClick={onClick}
    >
      <Badge
        badgeContent={operationsInProgress > 0 ? operationsInProgress : 0}
        sx={{
          '.MuiBadge-badge': {
            color: (theme) => theme.palette.primary.main,
            backgroundColor: (theme) => theme.palette.common.white,
          },
        }}
      >
        <BellIcon fill={theme.palette.common.black} />
      </Badge>
    </IconButton>
  )
}

export default HistoryBadge
