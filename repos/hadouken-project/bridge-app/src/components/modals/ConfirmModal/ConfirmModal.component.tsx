import React from 'react'

import { Button, Modal, ModalHeader } from '@hadouken-project/ui'
import { Box, Divider, Typography } from '@mui/material'

import { IConfirmModalProps } from '.'
import { messages } from './ConfirmModal.messages'

const ConfirmModal: React.FC<IConfirmModalProps> = ({
  open,
  handleClose,
  title,
  description,
  handleAction,
}) => {
  return (
    <>
      <Modal open={open} handleClose={handleClose}>
        <Box minWidth="404px">
          <ModalHeader title={title} />
          <Box display="flex" alignItems="center" pt={3}>
            <Typography variant="caption" color="gray">
              {description}
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" gap={1} width="100%">
            <Button
              fullWidth
              variant="outlined"
              text={messages.CANCEL}
              onClick={handleClose}
            />
            <Button
              fullWidth
              variant="contained"
              text={messages.CONFIRM}
              onClick={handleAction}
            />
          </Box>
        </Box>
      </Modal>
    </>
  )
}
export default ConfirmModal
