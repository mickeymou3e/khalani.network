import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CloseIcon from '@mui/icons-material/Close'
import { IconButton, Snackbar } from '@mui/material'
import { StoreDispatch } from '@store/store.types'
import { Network } from '@tvl-labs/sdk'

import { historySelector, historyActions } from '../../store'
import ConfirmationMessage from './ConfirmationMessage'

const TxConfirmationContainer: React.FC = () => {
  const [open, setOpen] = useState(false)
  const tx = useSelector(historySelector.lastTx)
  const dispatch = useDispatch<StoreDispatch>()

  useEffect(() => {
    if (tx) {
      setOpen(true)
    }
  }, [tx])

  const handleClose = () => {
    setOpen(false)
    dispatch(historyActions.setLastTx(null))
  }

  return (
    <Snackbar
      sx={{
        '.MuiPaper-root': {
          bgcolor: (theme) => theme.palette.elevation.main,
        },
      }}
      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={12000}
      onClose={handleClose}
      message={
        <ConfirmationMessage
          tx={tx ?? ''}
          destinationChain={Network.ArbitrumSepolia}
        />
      }
      action={
        <IconButton color="secondary" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      }
    />
  )
}

export default TxConfirmationContainer
