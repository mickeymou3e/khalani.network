import React from 'react'

import Modal from '@components/modals/Modal'
import ModalHeader from '@components/modals/ModalHeader'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { messages } from './AuthorizeWalletModal.messages'
import { IAuthorizeWalletModalProps } from './AuthorizeWalletModal.types'

const AuthorizeWalletModal: React.FC<IAuthorizeWalletModalProps> = ({
  open,
  title = messages.TITLE,
  description = messages.DESCRIPTION,
  handleClose,
}) => (
  <Modal open={open} handleClose={handleClose}>
    <ModalHeader title={title} />
    <Box
      alignItems="start"
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box paddingTop={2} paddingBottom={3} maxWidth={{ xs: 'none', md: 414 }}>
        <Typography
          textAlign="start"
          variant="caption"
          color={(theme) => theme.palette.text.gray}
        >
          {description}
        </Typography>
      </Box>

      <Button fullWidth onClick={handleClose} variant="contained" size="medium">
        Close window
      </Button>
    </Box>
  </Modal>
)

export default AuthorizeWalletModal
