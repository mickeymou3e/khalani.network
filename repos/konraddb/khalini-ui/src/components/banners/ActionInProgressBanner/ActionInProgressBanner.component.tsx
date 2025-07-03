import React from 'react'

import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

import { messages } from './ActionInProgressBanner.messages'
import { IActionInProgressBannerProps } from './ActionInProgressBanner.types'

export const ActionInProgressBanner: React.FC<IActionInProgressBannerProps> = ({
  inProgress,
  actionName,
}) => {
  return (
    <>
      {inProgress ? (
        <Box pb={3}>
          <Box
            p={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor={(theme) => theme.palette.tertiary.main}
          >
            <CircularProgress
              style={{
                width: '16px',
                height: '16px',
              }}
              sx={{
                marginRight: '12px',
                color: (theme) => theme.palette.common.black,
              }}
              variant="indeterminate"
              disableShrink
            />
            <Typography
              variant="caption"
              color={(theme) => theme.palette.common.black}
            >
              {messages.ANOTHER_ACTION_IN_PROGRESS(actionName ?? 'action')}
            </Typography>
          </Box>
        </Box>
      ) : null}
    </>
  )
}

export default ActionInProgressBanner
