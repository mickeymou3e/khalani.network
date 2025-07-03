import React from 'react'

import { CloseIcon } from '@components/icons'
import { Snackbar as MuiSnackbar, SnackbarContent } from '@mui/material'

import { SnackbarProps } from './Snackbar.types'

const Snackbar: React.FC<SnackbarProps> = (props) => {
  const { open, onClose, message } = props

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    onClose()
  }

  return (
    <MuiSnackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={10000}
      onClose={handleClose}
    >
      <SnackbarContent
        message={message}
        action={
          <CloseIcon
            onClick={onClose}
            fill="#000"
            style={{ position: 'absolute', right: 24, top: 24 }}
          />
        }
        sx={{ '.MuiSnackbarContent-message': { flex: 1 } }}
      />
    </MuiSnackbar>
  )
}

export default Snackbar
