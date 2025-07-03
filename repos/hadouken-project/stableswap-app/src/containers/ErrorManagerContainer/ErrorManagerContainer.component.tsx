import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Toast, ToastVariant } from '@hadouken-project/ui'
import { Box, Snackbar } from '@mui/material'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { contractsActions } from '@store/contracts/contracts.slice'

import { ERROR_AUTO_HIDE_TIME } from './ErrorManagerContainer.constants'

const ErrorManagerContainer: React.FC = () => {
  const dispatch = useDispatch()
  const errorMessage = useSelector(contractsSelectors.errorMessage)

  const handleClose = () => {
    dispatch(contractsActions.clearError())
  }

  if (!errorMessage) return null

  return (
    <Snackbar
      open
      autoHideDuration={ERROR_AUTO_HIDE_TIME}
      sx={{
        width: {
          sm: '280px',
          md: '320px',
        },
      }}
      onClose={handleClose}
    >
      <Box width="100%">
        <Toast
          variant={ToastVariant.Error}
          message={errorMessage}
          onClick={handleClose}
        />
      </Box>
    </Snackbar>
  )
}

export default ErrorManagerContainer
