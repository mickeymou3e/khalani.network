import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import CloseIcon from '@mui/icons-material/Close'
import { IconButton, Snackbar } from '@mui/material'
import { walletSelectors } from '@store/wallet/wallet.selector'

import ConfirmationMessage from './ConfirmationMessage'

const TxConfirmationContainer: React.FC = () => {
  const [open, setOpen] = useState(false)
  const tx = useSelector(walletSelectors.lastTx)

  useEffect(() => {
    if (tx) {
      setOpen(true)
    }
  }, [tx])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={12000}
      onClose={handleClose}
      message={<ConfirmationMessage tx={tx ?? ''} />}
      action={
        <IconButton color="inherit" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      }
    />
  )
}

export default TxConfirmationContainer
