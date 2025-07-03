import React from 'react'

import config from '@config'
import { Box, Paper, Typography } from '@mui/material'
import {
  Link,
  LinkEnum,
  OperationIcon,
  OperationStatus,
} from '@tvl-labs/khalani-ui'

import { messages } from './ConfirmationMessage.messages'
import { IConfirmationMessageProps } from './ConfirmationMessage.types'

const ConfirmationMessage: React.FC<IConfirmationMessageProps> = ({
  tx,
  destinationChain,
}) => (
  <Paper elevation={1} sx={{ border: 'none', p: 1, borderRadius: 1 }}>
    <Box display="flex">
      <OperationIcon status={OperationStatus.Success} />
      <Typography style={{ marginLeft: 8 }}>Swap intent has filled</Typography>
    </Box>
    <Link
      style={{ width: '100%', background: 'none' }}
      linkType={LinkEnum.External}
      target="_blank"
      url={`${
        config.explorer.blockExplorer[
          destinationChain as keyof typeof config.explorer.blockExplorer
        ]
      }/tx/${tx}`}
    >
      {messages.VIEW_IN_EXPLORER}
    </Link>
  </Paper>
)

export default ConfirmationMessage
