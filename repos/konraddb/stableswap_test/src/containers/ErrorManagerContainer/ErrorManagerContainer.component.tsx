import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Toast, ToastVariant } from '@hadouken-project/ui'
import { Snackbar } from '@mui/material'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { contractsActions } from '@store/contracts/contracts.slice'

const ErrorManagerContainer: React.FC = () => {
  const dispatch = useDispatch()
  const errorMessage = useSelector(contractsSelectors.errorMessage)

  const handleClose = () => {
    dispatch(contractsActions.clearError())
  }
  return (
    <Snackbar
      open={errorMessage !== null}
      autoHideDuration={20000}
      sx={{ maxWidth: '400px' }}
    >
      {errorMessage ? (
        <Toast
          variant={ToastVariant.Error}
          message={errorMessage}
          onClick={handleClose}
        />
      ) : (
        <div></div>
      )}
    </Snackbar>
  )
}

export default ErrorManagerContainer
