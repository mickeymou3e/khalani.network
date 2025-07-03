import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Grid, IconButton, Paper, Snackbar, Stack } from '@mui/material'
import ConfirmButton from '@shared/components/buttons/ConfirmButton'
import { useUSDAmount } from '@shared/hooks'
import { StoreDispatch } from '@store/store.types'
import {
  CloseIcon,
  OperationIcon,
  OperationStatus,
  SingleChainSelector,
  TokenInput,
  TokenSelector,
  TransferIcon,
  Typography,
} from '@tvl-labs/khalani-ui'
import { depositActions, depositSelectors, Network } from '@tvl-labs/sdk'

import {
  useChainSelector,
  useProvideLiquidity,
  useTokenSelector,
} from './DepositTokensContainer.hooks'

const DepositTokensContainer: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [pendingSnackbarOpen, setPendingSnackbarOpen] = useState<boolean>(false)
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false)

  const isInitialized = useSelector(depositSelectors.isInitialized)
  const isLoading = useSelector(depositSelectors.isLoading)
  const error = useSelector(depositSelectors.error)

  useEffect(() => {
    if (error) {
      setPendingSnackbarOpen(false)
      setSnackbarOpen(false)
      setErrorSnackbarOpen(true)
      dispatch(depositActions.clearState())
    }
  }, [error])

  useEffect(() => {
    if (isInitialized) {
      setPendingSnackbarOpen(false)
      setSnackbarOpen(true)
      dispatch(depositActions.clearState())
    }
  }, [isInitialized])

  useEffect(() => {
    if (isLoading) {
      setPendingSnackbarOpen(true)
    }
  }, [isLoading])

  const { chains, selectedChain, handleChainChange } = useChainSelector()
  const { tokens, selectedToken, handleTokenChange } = useTokenSelector(
    selectedChain,
  )
  const { amount, tokenBalance, handleAmountChange } = useProvideLiquidity(
    selectedToken,
  )
  const { baseUSDAmount } = useUSDAmount(
    selectedToken?.id,
    amount,
    selectedToken?.decimals,
  )

  const insufficientBalance = useMemo(
    () => (amount ?? 0n) > (tokenBalance ?? 0n),
    [amount, tokenBalance],
  )

  const handleConfirm = useCallback(() => {
    if (!selectedToken) throw new Error('Selected token is undefined')
    if (!amount) throw new Error('Selected token amount is undefined')

    const payload = {
      srcAddress: selectedToken.address,
      srcAmount: amount,
    }

    dispatch(depositActions.request(payload))
  }, [dispatch, selectedToken, amount])

  return (
    <Grid container display="flex" alignItems="center" justifyContent="center">
      <Grid item xs={12} md={9} lg={7} xl={5} sx={{ maxWidth: { xl: 550 } }}>
        <Paper sx={{ p: 4, position: 'relative' }} elevation={1}>
          <Stack mb={4} direction="row" alignItems="center" gap={1}>
            <TransferIcon />
            <Typography
              variant="h6"
              color="text.secondary"
              text={'Deposit Tokens'}
            />
          </Stack>
          <Stack direction="row" gap={2}>
            <Box width="100%">
              <SingleChainSelector
                chains={chains}
                selectedChain={selectedChain}
                handleChainChange={handleChainChange}
              />
            </Box>
            <Box width="100%">
              <TokenSelector
                tokens={tokens}
                selectedToken={selectedToken}
                handleTokenChange={handleTokenChange}
              />
            </Box>
          </Stack>
          <Box mt={2}>
            <TokenInput
              token={selectedToken}
              amount={amount}
              maxAmount={tokenBalance}
              usdAmount={baseUSDAmount}
              topLabel={'Amount'}
              onAmountChange={handleAmountChange}
              onMaxRequest={() =>
                tokenBalance && handleAmountChange(tokenBalance)
              }
              hideTokenButton
            />
            <Box mt={2}>
              <ConfirmButton
                onClick={handleConfirm}
                disabled={!amount || insufficientBalance || pendingSnackbarOpen}
                text={'Deposit'}
                expectedNetwork={
                  selectedChain?.chainId ?? Network.ArbitrumSepolia
                }
                insufficientBalance={insufficientBalance}
              />
            </Box>
          </Box>
        </Paper>
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
              <Typography
                text="Tokens Deposited Successfully"
                variant="body2"
              />
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
          autoHideDuration={null}
          onClose={() => setPendingSnackbarOpen(false)}
          message={
            <Box display="flex" alignItems="center" gap={1}>
              <OperationIcon status={OperationStatus.Pending} />
              <Typography text="Depositing Tokens…" variant="body2" />
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
              <Typography text={'Deposit Tokens Failed'} variant="body2" />
            </Box>
          }
          action={
            <IconButton
              color="primary"
              onClick={() => setErrorSnackbarOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          }
        />
      </Grid>
    </Grid>
  )
}

export default DepositTokensContainer
