import React from 'react'

import OperationIcon from '@components/icons/history/OperationIcon'
import OperationTitle from '@components/icons/history/OperationTitle'
import { Paper } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { IHistoryItemProps } from './HistoryItem.types'

const HistoryItem: React.FC<IHistoryItemProps> = ({
  title,
  description,
  status,
}) => (
  <Paper elevation={1} sx={{ border: 'none', p: 1, borderRadius: 1 }}>
    <Box display="flex" alignItems="center">
      <Box marginBottom="auto">
        <OperationIcon status={status} />
      </Box>

      <Box ml={1.5}>
        <OperationTitle status={status} text={title} />

        <Typography
          variant="body2"
          color={(theme) => theme.palette.text.secondary}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  </Paper>
)

export default HistoryItem
