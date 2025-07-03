import React from 'react'

import config from '@config'
import { Link, LinkEnum } from '@hadouken-project/ui'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, Typography } from '@mui/material'

import { messages } from './ConfirmationMessage.messages'
import { IConfirmationMessageProps } from './ConfirmationMessage.types'

const ConfirmationMessage: React.FC<IConfirmationMessageProps> = ({ tx }) => {
  return (
    <Box>
      <Box display="flex">
        <CheckCircleIcon />
        <Typography style={{ marginLeft: 8 }}>
          {messages.TRANSFER_PENDING}
        </Typography>
      </Box>
      <Link
        style={{ width: '100%', background: 'none' }}
        linkType={LinkEnum.External}
        target="_blank"
        url={`${config.explorerUrl.godwoken}/tx/${tx}`}
      >
        {messages.VIEW_IN_EXPLORER}
      </Link>
    </Box>
  )
}

export default ConfirmationMessage
