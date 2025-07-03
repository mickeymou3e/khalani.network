import React from 'react'

import { CloseIcon } from '@components/icons'
import { TransactionIcon } from '@components/icons/history/TransactionIcon'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import Typography from '@mui/material/Typography'

import HistoryItem from '../HistoryItem'
import { IHistoryDropdownProps } from './HistoryDropdown.types'

const HistoryDropdown: React.FC<IHistoryDropdownProps> = ({
  title,
  status,
  width,
  operations,
  anchorElement,
  open,
  onClose,
}) => (
  <Menu
    anchorEl={anchorElement}
    onClose={onClose}
    open={open}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    elevation={2}
    disableScrollLock
  >
    <Box width={width} p={{ xs: 1, sm: 3.75 }}>
      <Box display="flex" alignItems="center">
        <Typography variant="h4Bold">{title}</Typography>
        <Box ml={2}>
          <TransactionIcon status={status} />
        </Box>

        <Box ml="auto" sx={{ cursor: 'pointer' }}>
          <CloseIcon onClick={() => onClose?.({}, 'backdropClick')} />
        </Box>
      </Box>

      <Divider />

      {operations?.map((operation, index) => (
        <Box pb={operations.length - 1 === index ? 0 : 2} key={operation.id}>
          <HistoryItem
            title={operation.title}
            description={operation.description}
            status={operation.status}
          />
        </Box>
      ))}
    </Box>
  </Menu>
)

export default HistoryDropdown
