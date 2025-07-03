import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CloseIcon from '@mui/icons-material/Close'
import { Box, Grid, Paper, IconButton, Snackbar, Stack } from '@mui/material'
import { ConfirmButton } from '@shared/components'
import { useUSDAmount, useResetInputValue } from '@shared/hooks'
import { useWallet } from '@shared/store'
import { StoreDispatch } from '@store/store.types'
import {
  ChainSelector,
  OperationIcon,
  OperationStatus,
  TokenInput,
  TokenSelectorInput,
  TransactionSummary,
  TransferIcon,
  Typography,
} from '@tvl-labs/khalani-ui'
import {
  TokenModelBalanceWithChain,
  createIntentNonce,
  createIntentDeadline,
  createIntentActions,
  createIntentSelectors,
  createRefineActions,
  Intent,
  QueryRefineErrors,
  Network,
} from '@tvl-labs/sdk'

import { BridgePreview } from '../../components'
import { RefinementStatus } from '../../enums/Refinement.enum'
import {
  useChains,
  useConfirmButton,
  useRefine,
  useTokenWithBalances,
  useTransactionSummary,
} from './BridgeModule.hooks'
import { findBusdToken, includesBusd } from './BridgeModule.utils'
import TransactionProcessing from './components/TransactionProcessing/TransactionProcessing.component'

const BridgeModule: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const isCompleted = false
  const isInitialized = useSelector(createIntentSelectors.isInitialized)
  const isSigned = useSelector(createIntentSelectors.isSigned)
  const error = useSelector(createIntentSelectors.error)
  const depositId = useSelector(createIntentSelectors.depositId)

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [pendingSnackbarOpen, setPendingSnackbarOpen] = useState<boolean>(false)
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false)

  useEffect(() => {
    return () => {
      dispatch(createIntentActions.clearState())
    }
  }, [dispatch])

  useEffect(() => {
    if (isInitialized) {
      setPendingSnackbarOpen(false)
      setSnackbarOpen(true)
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

  const wallet = useWallet()

  const {
    chains,
    originChain,
    destinationChain,
    swapChains,
    handleOriginChainChange,
    handleDestinationChainChange,
  } = useChains()

  const {
    selectableTokens,
    selectedTokenValue,
    setSelectedTokenValue,
    originToken,
    setOriginToken,
    originTokenBalance,
    selectableDestinationTokens,
    destinationToken,
    destinationTokenBalance,
    setDestinationToken,
    destinationTokenValue,
    setDestinationTokenValue,
  } = useTokenWithBalances(originChain?.chainId, destinationChain.chainId)

  const { details } = useTransactionSummary()
  const { refinementStatus, queryRefineOutput, refinementNotFound } = useRefine(
    selectedTokenValue,
  )
  const { confirmButtonText } = useConfirmButton(
    refinementStatus,
    selectedTokenValue,
    refinementNotFound,
  )

  const { baseUSDAmount, additionalUSDAmount } = useUSDAmount(
    originToken?.id,
    selectedTokenValue,
    originToken?.decimals,
    destinationToken?.id,
    destinationTokenValue,
    destinationToken?.decimals,
  )

  const depositButtonDisabled =
    !originChain ||
    !selectedTokenValue ||
    !destinationTokenValue ||
    originChain?.chainId === destinationChain?.chainId ||
    (originTokenBalance ? selectedTokenValue > originTokenBalance : false) ||
    refinementStatus === RefinementStatus.INITIALIZED ||
    pendingSnackbarOpen

  const handleOriginTokenChange = (token: TokenModelBalanceWithChain) => {
    setOriginToken(token)
    if (includesBusd(token)) {
      setDestinationToken(findBusdToken(selectableDestinationTokens))
    }
  }

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setSelectedTokenValue(undefined)
  }, [originChain, wallet.network])

  const [payload, setPayload] = useState<
    | {
        srcToken: string
        srcAmount: bigint
        destTokens: string[]
        destChains: number[]
        selectedChain: Network
      }
    | undefined
  >()

  useEffect(() => {
    if (
      !originChain ||
      !originToken ||
      !destinationToken ||
      !selectedTokenValue ||
      !destinationChain ||
      wallet.network !== originChain.chainId
    )
      return

    setPayload({
      srcToken: originToken.address,
      srcAmount: selectedTokenValue,
      selectedChain: originChain.chainId,
      destTokens: [destinationToken.address],
      destChains: [destinationChain.id],
    })
  }, [
    wallet.network,
    originChain,
    originToken,
    selectedTokenValue,
    destinationToken,
    destinationChain,
  ])

  const handleConfirm = useCallback(() => {
    if (!payload) throw new Error('Provided payload is undefined')
    if (refinementStatus === RefinementStatus.COMPLETED && queryRefineOutput) {
      dispatch(createIntentActions.request(queryRefineOutput as Intent))
    }
  }, [dispatch, payload, queryRefineOutput, refinementStatus])

  const insufficientBalance = useMemo(
    () => (selectedTokenValue ?? 0n) > (originTokenBalance ?? 0n),
    [selectedTokenValue, originTokenBalance],
  )

  useEffect(() => {
    if (!payload || insufficientBalance) return
    dispatch(createRefineActions.request(payload))
  }, [dispatch, selectedTokenValue, payload, insufficientBalance])

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (!selectedTokenValue || !queryRefineOutput) {
      return
    }
    if (queryRefineOutput === QueryRefineErrors.RefinementNotFound) {
      return
    }
    setDestinationTokenValue(BigInt(queryRefineOutput.outcome.mAmounts[0]))
  }, [selectedTokenValue, originToken?.symbol, queryRefineOutput])

  useResetInputValue(setSelectedTokenValue, isCompleted)

  return (
    <Grid container display="flex" alignItems="center" justifyContent="center">
      <Grid item xs={12} md={9} lg={7} xl={5} sx={{ maxWidth: { xl: 550 } }}>
        {destinationToken && !!destinationTokenValue && (
          <Box mb={3}>
            <TransactionProcessing
              sourceChain={originChain}
              destinationChain={destinationChain}
              tokenSymbol={originToken?.symbol ?? ''}
              tokenDecimals={originToken?.decimals ?? 0}
              amount={selectedTokenValue ?? 0n}
              depositId={depositId}
              destinationTokenId={destinationToken.id}
              destinationTokenValue={destinationTokenValue}
              onSuccess={() => {
                dispatch(createIntentActions.clearState())
              }}
            />
          </Box>
        )}

        <Paper sx={{ p: 4, position: 'relative' }} elevation={1}>
          <Stack mb={4} direction="row" alignItems="center" gap={1}>
            <TransferIcon />
            <Typography variant="h6" color="text.secondary" text={'Transfer'} />
          </Stack>
          <ChainSelector
            originChains={chains}
            destinationChains={chains}
            selectedOriginChain={originChain}
            selectedDestinationChain={destinationChain}
            handleOriginChainChange={handleOriginChainChange}
            handleDestinationChainChange={handleDestinationChainChange}
            handleSwapButtonClick={swapChains}
          />
          {selectableTokens && (
            <Box display="flex" flexDirection="column" mt={2}>
              <TokenSelectorInput
                tokens={selectableTokens}
                amount={selectedTokenValue}
                maxAmount={originTokenBalance}
                selectedToken={originToken}
                onAmountChange={(value) => setSelectedTokenValue(value)}
                onTokenChange={handleOriginTokenChange}
                usdAmount={baseUSDAmount}
              />
            </Box>
          )}
          <Box mt={2}>
            <TransactionSummary items={details} />
          </Box>

          <Box display="flex" flexDirection="column" my={2}>
            <TokenInput
              token={destinationToken}
              amount={destinationTokenValue}
              maxAmount={destinationTokenBalance}
              usdAmount={additionalUSDAmount}
              topLabel={`Receive on ${destinationChain.chainName}`}
              hideMaxButton
            />
          </Box>

          <Box mt={2}>
            <ConfirmButton
              onClick={handleConfirm}
              text={confirmButtonText}
              disabled={
                depositButtonDisabled ||
                refinementStatus !== RefinementStatus.COMPLETED
              }
              expectedNetwork={originChain.chainId}
              isLoading={refinementStatus === RefinementStatus.INITIALIZED}
              insufficientBalance={insufficientBalance}
            />
          </Box>
        </Paper>
        {open && originToken && destinationToken && (
          <BridgePreview
            modalOpen={open}
            onModalClose={handleClose}
            tokens={[originToken, destinationToken]}
            amounts={[selectedTokenValue, destinationTokenValue]}
            payload={{
              author: wallet.account ?? '',
              sourceChain: parseInt(originChain.chainId),
              destinationChain: parseInt(destinationChain.chainId),
              sourceToken: originToken.address,
              destinationToken: destinationToken.address,
              srcAmount: selectedTokenValue ?? 0n,
              nonce: createIntentNonce(),
              ttl: createIntentDeadline(),
            }}
          />
        )}
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
                text="Your tokens have been successfully deposited and your intent has been created."
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
              <Typography
                text="Depositing tokens and creating an intent"
                variant="body2"
              />
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
              <Typography
                text={'Transaction failed: Provider Error'}
                variant="body2"
              />
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

export default BridgeModule
