import React from 'react'

import Modal from '@components/modals/Modal'
import ModalHeader from '@components/modals/ModalHeader'
import { Button, Divider } from '@mui/material'
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
    <ModalHeader title={title} handleClose={handleClose} />
    <Box
      alignItems="start"
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Typography
        textAlign="start"
        variant="body2"
        color={(theme) => theme.palette.text.secondary}
      >
        {description}
      </Typography>

      <Divider sx={{ my: 2 }} />
      <Button
        onClick={handleClose}
        variant="contained"
        size="large"
        sx={{ ml: 'auto' }}
      >
        Close window
      </Button>
    </Box>
  </Modal>
)

export default AuthorizeWalletModal
