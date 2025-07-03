import React from 'react'

import OperationIcon from '@components/icons/history/OperationIcon'
import OperationTitle from '@components/icons/history/OperationTitle'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { IHistoryItemProps } from './HistoryItem.types'

const HistoryItem: React.FC<IHistoryItemProps> = ({
  title,
  description,
  status,
}) => (
  <Box display="flex" alignItems="center">
    <Box marginBottom="auto">
      <OperationIcon status={status} />
    </Box>

    <Box ml={2}>
      <OperationTitle status={status} text={title} />

      <Typography
        sx={{ paddingTop: 1 }}
        variant="paragraphTiny"
        color={(theme) => theme.palette.text.gray}
      >
        {description}
      </Typography>
    </Box>
  </Box>
)

export default HistoryItem
