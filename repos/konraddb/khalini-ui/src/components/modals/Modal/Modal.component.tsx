import React from 'react'

import { Theme, useMediaQuery } from '@mui/material'
import Dialog from '@mui/material/Dialog'

import { IModalProps } from './Modal.types'

const Modal: React.FC<IModalProps> = ({ children, open, handleClose }) => {
  const upMD = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  return (
    <Dialog
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiDialog-paper': {
          padding: 3,
        },
        '& .MuiDialog-container': {
          width: { xs: '100%', lg: '500px' },
        },
        '& .MuiPaper-root': {
          borderRadius: 3,
          maxWidth: { xs: '100%', md: '600px' },
        },
      }}
      fullScreen={upMD ? false : true}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
      disableRestoreFocus
    >
      {(children as unknown) as JSX.Element}
    </Dialog>
  )
}

export default Modal
