import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, IconButton, Snackbar } from '@mui/material'
import { ConfirmButton } from '@shared/components/index'
import { StoreDispatch } from '@store/store.types'
import {
  bigIntToString,
  CloseIcon,
  formatWithCommas,
  getTokenComponent,
  OperationIcon,
  OperationStatus,
  Typography,
  WithdrawBalanceModal,
} from '@tvl-labs/khalani-ui'
import {
  getDepositDestinationChain,
  withdrawIntentBalanceActions,
  withdrawIntentBalanceSelectors,
  withdrawMTokenActions,
  withdrawMTokenSelectors,
} from '@tvl-labs/sdk'

import { WithdrawContainerProps } from './WithdrawContainer.types'
import { createItem } from './WithdrawContainer.utils'

const WithdrawContainer: React.FC<WithdrawContainerProps> = (props) => {
  const {
    open,
    onClose,
    onSubmit,
    tokenSymbol,
    tokenDecimals,
    sourceChain,
    destinationChain,
    amount,
    outputAmount,
    successMessage,
    pendingMessage,
  } = props
  const dispatch = useDispatch<StoreDispatch>()

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [pendingSnackbarOpen, setPendingSnackbarOpen] = useState<boolean>(false)
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false)

  const isIntentBalanceInitialized = useSelector(
    withdrawIntentBalanceSelectors.isInitialized,
  )
  const isIntentBalanceSigned = useSelector(
    withdrawIntentBalanceSelectors.isSigned,
  )
  const withdrawIntentBalanceError = useSelector(
    withdrawIntentBalanceSelectors.error,
  )
  const withdrawMTokenError = useSelector(withdrawMTokenSelectors.error)

  const isMTokenInitialized = useSelector(withdrawMTokenSelectors.isInitialized)
  const isMTokenSigned = useSelector(withdrawMTokenSelectors.isSigned)

  useEffect(() => {
    if (isIntentBalanceInitialized || isMTokenInitialized) {
      setPendingSnackbarOpen(false)
      setSnackbarOpen(true)
      dispatch(withdrawIntentBalanceActions.clearState())
      dispatch(withdrawMTokenActions.clearState())
      onClose()
    }
  }, [isIntentBalanceInitialized, isMTokenInitialized])

  useEffect(() => {
    if (isIntentBalanceSigned || isMTokenSigned) {
      setPendingSnackbarOpen(true)
    }
  }, [isIntentBalanceSigned, isMTokenSigned])

  useEffect(() => {
    if (withdrawIntentBalanceError || withdrawMTokenError) {
      setErrorSnackbarOpen(true)
      dispatch(withdrawIntentBalanceActions.clearState())
      dispatch(withdrawMTokenActions.clearState())
    }
  }, [withdrawIntentBalanceError, withdrawMTokenError])

  const items = useMemo(
    () => [
      createItem(
        1,
        `Receive on ${destinationChain?.chainName}`,
        getTokenComponent(tokenSymbol, { width: 16, height: 16 }),
        bigIntToString(outputAmount, tokenDecimals),
      ),
    ],
    [destinationChain?.chainName, tokenSymbol, outputAmount, tokenDecimals],
  )

  const handleSubmit = () => {
    onSubmit()
  }

  if (!sourceChain) throw new Error('Source chain is undefined')
  if (!destinationChain) throw new Error('Destination chain is undefined')
  return (
    <>
      <WithdrawBalanceModal
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        tokenSymbol={tokenSymbol}
        tokenDecimals={tokenDecimals}
        sourceChain={sourceChain}
        destinationChain={destinationChain}
        amount={formatWithCommas(amount, 18)}
        summaryItems={items}
        buttonComponent={
          <ConfirmButton
            onClick={handleSubmit}
            text={'Withdraw'}
            size="medium"
            expectedNetwork={getDepositDestinationChain()}
            disabled={pendingSnackbarOpen}
          />
        }
      />
      <Snackbar
        sx={{
          '.MuiPaper-root': {
            bgcolor: (theme) => theme.palette.elevation.main,
          },
        }}
        open={snackbarOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={10000}
        onClose={() => setSnackbarOpen(false)}
        message={
          <Box display="flex" alignItems="center" gap={1}>
            <OperationIcon status={OperationStatus.Success} />
            <Typography text={successMessage} variant="body2" />
          </Box>
        }
        action={
          <IconButton color="primary" onClick={() => setSnackbarOpen(false)}>
            <CloseIcon />
          </IconButton>
        }
      />
      <Snackbar
        sx={{
          '.MuiPaper-root': {
            bgcolor: (theme) => theme.palette.elevation.main,
          },
        }}
        open={pendingSnackbarOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={10000}
        onClose={() => setPendingSnackbarOpen(false)}
        message={
          <Box display="flex" alignItems="center" gap={1}>
            <OperationIcon status={OperationStatus.Pending} />
            <Typography text={pendingMessage} variant="body2" />
          </Box>
        }
        action={
          <IconButton
            color="primary"
            onClick={() => setPendingSnackbarOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        }
      />
      <Snackbar
        sx={{
          '.MuiPaper-root': {
            bgcolor: (theme) => theme.palette.elevation.main,
          },
        }}
        open={errorSnackbarOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={10000}
        onClose={() => setErrorSnackbarOpen(false)}
        message={
          <Box display="flex" alignItems="center" gap={1}>
            <OperationIcon status={OperationStatus.Fail} />
            <Typography text={'Withdraw transaction failed'} variant="body2" />
          </Box>
        }
        action={
          <IconButton color="primary" onClick={() => setSnackbarOpen(false)}>
            <CloseIcon />
          </IconButton>
        }
      />
    </>
  )
}

export default WithdrawContainer
