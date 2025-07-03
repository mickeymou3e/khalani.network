import React from 'react'

import Button from '@components/buttons/Button'
import { NotFoundIcon } from '@components/icons/business/NotFound'
import { Box, Typography } from '@mui/material'

import { messages } from './NotFoundPage.messages'
import { INotFoundPageProps } from './NotFoundPage.types'

export const NotFoundPage: React.FC<INotFoundPageProps> = ({ onRedirect }) => {
  return (
    <Box>
      <Box
        marginTop={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={{ xs: 50, sm: 100, md: 120 }}
      >
        <NotFoundIcon />
      </Box>
      <Box
        display="flex"
        textAlign="center"
        flexDirection="column"
        alignItems="center"
      >
        <Typography
          variant="h1"
          sx={{
            '&&': {
              fontSize: { xs: 64, md: 128 },
            },
          }}
        >
          404
        </Typography>
        <Typography variant="h2">{messages.TITLE}</Typography>
        <Typography
          variant="paragraphMedium"
          color={(theme) => theme.palette.text.gray}
          maxWidth={{ xs: 300, md: 400 }}
          mt={2}
        >
          {messages.DESCRIPTION}
        </Typography>
        <Button
          text={<Typography variant="buttonMedium">{messages.BACK}</Typography>}
          variant="contained"
          sx={{ marginTop: 6 }}
          onClick={onRedirect}
        />
      </Box>
    </Box>
  )
}
