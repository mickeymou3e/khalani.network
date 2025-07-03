import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Grid, IconButton, Paper, Snackbar, Stack } from '@mui/material'
import ConfirmButton from '@shared/components/buttons/ConfirmButton'
import { useUSDAmount } from '@shared/hooks'
import { StoreDispatch } from '@store/store.types'
import {
  ChainPicker,
  CloseIcon,
  FeesSelector,
  OperationIcon,
  OperationStatus,
  SingleChainSelector,
  TokenInput,
  TokenSelector,
  TransferIcon,
  Typography,
} from '@tvl-labs/khalani-ui'
import {
  createIntentActions,
  createIntentSelectors,
  Network,
} from '@tvl-labs/sdk'

import {
  useChainPicker,
  useChainSelector,
  useFeeSelector,
  useProvideLiquidity,
  useTokenSelector,
} from './ProvideLiquidityContainer.hooks'

const ProvideLiquidityContainer: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [pendingSnackbarOpen, setPendingSnackbarOpen] = useState<boolean>(false)
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false)

  const isInitialized = useSelector(createIntentSelectors.isInitialized)
  const isSigned = useSelector(createIntentSelectors.isSigned)
  const error = useSelector(createIntentSelectors.error)

  useEffect(() => {
    if (isInitialized) {
      setPendingSnackbarOpen(false)
      setSnackbarOpen(true)
      dispatch(createIntentActions.clearState())
    }
  }, [isInitialized])

  useEffect(() => {
    if (isSigned) {
      setPendingSnackbarOpen(true)
    }
  }, [isSigned])

  useEffect(() => {
    if (error) {
      setPendingSnackbarOpen(false)
      setErrorSnackbarOpen(true)
      dispatch(createIntentActions.clearState())
    }
  }, [error])

  const { chains, selectedChain, handleChainChange } = useChainSelector()
  const { tokens, selectedToken, handleTokenChange } = useTokenSelector(
    selectedChain,
  )
  const {
    selectedChains,
    handleChainDelete,
    handleChainSelect,
  } = useChainPicker()
  const {
    fees,
    selectedFee,
    handleFeeChange,
    handleTextFieldChange,
  } = useFeeSelector()
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

    const destChains = selectedChains.map(({ id }) => id)
    const payload = {
      srcToken: selectedToken.address,
      srcAmount: amount,
      destChains,
      feePercentage: +selectedFee,
    }

    dispatch(createIntentActions.request(payload))
  }, [dispatch, selectedToken, amount, selectedFee, selectedChains])

  return (
    <Grid container display="flex" alignItems="center" justifyContent="center">
      <Grid item xs={12} md={9} lg={7} xl={5} sx={{ maxWidth: { xl: 550 } }}>
        <Paper sx={{ p: 4, position: 'relative' }} elevation={1}>
          <Stack mb={4} direction="row" alignItems="center" gap={1}>
            <TransferIcon />
            <Typography
              variant="h6"
              color="text.secondary"
              text={'Liquidity'}
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
            <Stack mt={2} gap={1}>
              <Typography
                text={'Add chains to provide liquidity'}
                variant="button"
                color="text.secondary"
              />
              <ChainPicker
                selectedChains={selectedChains}
                chains={chains}
                buttonClickFn={handleChainDelete}
                chainSelectedFn={handleChainSelect}
              />
            </Stack>

            <Box mt={2}>
              <FeesSelector
                tokenSymbol={selectedToken?.symbol ?? ''}
                fees={fees}
                selectedFee={selectedFee}
                feeChangeFn={handleFeeChange}
                textFieldChangeFn={handleTextFieldChange}
                isFixedFee={false}
              />
            </Box>
            <Box mt={2}>
              <ConfirmButton
                onClick={handleConfirm}
                disabled={
                  !amount ||
                  selectedChains.length === 0 ||
                  insufficientBalance ||
                  pendingSnackbarOpen
                }
                text={'Add liquidity'}
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
              <Typography text="Liquidity Added Successfully" variant="body2" />
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
              <Typography text="Providing Liquidity…" variant="body2" />
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
              <Typography text={'Provide Liquidity Failed'} variant="body2" />
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

export default ProvideLiquidityContainer
