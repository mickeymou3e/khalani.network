import React from 'react'

import { Theme, useMediaQuery } from '@mui/material'

import { CustomizedDialog } from './Modal.styled'
import { IModalProps } from './Modal.types'

const Modal: React.FC<IModalProps> = ({ children, open, handleClose }) => {
  const upMD = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  return (
    <CustomizedDialog
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
    </CustomizedDialog>
  )
}

export default Modal
