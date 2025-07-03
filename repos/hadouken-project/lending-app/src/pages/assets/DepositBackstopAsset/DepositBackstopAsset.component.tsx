import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import { BigNumber } from 'ethers'
import numbro from 'numbro'

import { ActionInProgressBanner } from '@components/banners/ActionInProgressBanner'
import { ActionInProgress } from '@constants/Action'
import {
  Button,
  ButtonLayout,
  convertBigNumberToDecimal,
  SummaryLabel,
  TokenInput,
} from '@hadouken-project/ui'
import HelpIcon from '@mui/icons-material/Help'
import {
  Box,
  IconButton,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material'
import { backstopSelectors } from '@store/backstop/backstop.selector'
import { balancesSelectors } from '@store/balances/balances.selector'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { StoreDispatch } from '@store/store.types'
import { errorMessages } from '@utils/errors'
import { useGoBack, usePushHistoryInternal } from '@utils/navigation'
import { checkIsSupportedNetworkInUrl } from '@utils/network'
import { formatNetworkName } from '@utils/stringOperations'
import { testIds } from '@utils/tests'

import { useGetBackstopAssetFromSlug, useOnActionCompleted } from '../hooks'
import { messages } from './DepositBackstopAsset.messages'

const DepositBackstopAssetPage: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const goBack = useGoBack()
  const history = usePushHistoryInternal()
  const [amount, setAmount] = useState<BigNumber | undefined>()
  const { pathname } = useLocation()
  const isNetworkInUrl = checkIsSupportedNetworkInUrl(pathname)

  const clearAmount = useCallback(() => {
    setAmount(undefined)
  }, [setAmount])

  const selectBackstopById = useSelector(backstopSelectors.selectById)
  const actionInProgress = useSelector(contractsSelectors.actionInProgress)
  const selectDepositBalance = useSelector(
    balancesSelectors.selectUserDepositBalance,
  )

  useOnActionCompleted(
    ActionInProgress.BackstopDeposit,
    actionInProgress,
    clearAmount,
  )

  const reserveToken = useGetBackstopAssetFromSlug()
  const backstopPool = selectBackstopById(reserveToken?.address)

  const userHTokenBalance =
    selectDepositBalance(reserveToken?.aTokenAddress)?.value ??
    BigNumber.from(0)

  const userBackstopBalance = backstopPool?.userBalance ?? BigNumber.from(0)

  const currentDepositLabelValue = numbro(
    convertBigNumberToDecimal(userBackstopBalance, reserveToken?.decimals ?? 0),
  ).format('0.0000')

  const newDepositLabelValue = numbro(
    convertBigNumberToDecimal(
      userBackstopBalance.add(amount || BigNumber.from(0)),
      reserveToken?.decimals ?? 0,
    ),
  ).format('0.0000')

  const isValidInput = amount === undefined || amount?.lte(userHTokenBalance)

  const isValidSubmit =
    actionInProgress === undefined &&
    isValidInput &&
    amount?.gt(BigNumber.from(0))

  const onDepositRequest = () => {
    if (amount && reserveToken?.address) {
      dispatch(
        providerActions.backstopDepositRequest({
          amount: amount,

          assetAddress: reserveToken?.address,
        }),
      )
    }
  }

  const onAmountChange = (value: BigNumber) => {
    setAmount(value)
  }

  const NavigateToDepositPage = () => {
    history(`/deposit/${reserveToken?.symbol}`)
  }

  const tooltipText = `You may further boost your ${reserveToken?.symbol} deposits by depositing h${reserveToken?.symbol} into the backstop. Funds in the backstop will be used to perform liquidations, resulting in pro-rated liquidation bonuses for all depositors. You may receive other tokens depending on which types of positions are liquidated.`

  return (
    <Box maxWidth="616px" display="flex" flexDirection="column" margin="auto">
      <Paper elevation={3} sx={{ padding: 1, marginBottom: 2 }}>
        {reserveToken === undefined && (
          <Redirect
            push
            to={`/${formatNetworkName(isNetworkInUrl?.name ?? '/')}/backstop`}
          />
        )}

        <ActionInProgressBanner
          actionInProgress={actionInProgress}
          currentAction={ActionInProgress.BackstopDeposit}
        />

        <Box>
          <Typography variant="h4Bold">{messages.DEPOSIT_TITLE}</Typography>

          {!reserveToken ? (
            <Skeleton sx={{ mt: 1 }} variant="rectangular" height={20} />
          ) : (
            <>
              <Box pt={1} display="flex" alignItems="center">
                <Typography
                  variant="caption"
                  color={(theme) => theme.palette.text.secondary}
                >
                  Why does the backstop only take h{reserveToken?.symbol}{' '}
                </Typography>
                <Tooltip title={tooltipText}>
                  <IconButton
                    sx={{
                      ml: 1,
                      width: 16,
                      height: 16,
                      color: (theme) => theme.palette.tertiary.main,
                    }}
                  >
                    <HelpIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
        </Box>
        <Box py={4}>
          <TokenInput
            error={!isValidInput ? errorMessages.NOT_ENOUGH_ASSETS : undefined}
            token={
              reserveToken
                ? {
                    address: reserveToken?.aTokenAddress,
                    decimals: reserveToken?.decimals,
                    id: reserveToken?.address,
                    name: reserveToken?.symbol,
                    symbol: `H${reserveToken?.symbol}`,
                    source: '',
                    displayName: reserveToken?.displayName,
                  }
                : undefined
            }
            amount={amount}
            maxAmount={userHTokenBalance}
            onAmountChange={onAmountChange}
            onMaxRequest={() => onAmountChange(userHTokenBalance)}
            isFetchingMaxAmount={!reserveToken}
          />
        </Box>
        <Box
          display="flex"
          alignContent="center"
          justifyContent="center"
          flexDirection="column"
        >
          <SummaryLabel
            label={messages.CURRENT_DEPOSIT_BALANCE}
            value={`${currentDepositLabelValue} ${reserveToken?.symbol || ''}`}
          />
          <SummaryLabel
            label={messages.NEW_DEPOSIT_BALANCE}
            value={`${newDepositLabelValue} ${reserveToken?.symbol || ''}`}
          />
        </Box>

        <Box pt={2}>
          {!reserveToken ? (
            <Skeleton variant="rectangular" height={40} />
          ) : (
            <Box display="inline">
              <Typography
                variant="paragraphTiny"
                sx={{
                  display: 'inline',
                  color: (theme) => theme.palette.text.gray,
                }}
              >
                If you have {reserveToken?.symbol} in your wallet, click
              </Typography>
              <Typography
                variant="paragraphTiny"
                onClick={NavigateToDepositPage}
                sx={{
                  display: 'inline',
                  cursor: 'pointer',
                  ml: 1,
                  mr: 1,
                  color: (theme) => theme.palette.text.quaternary,
                }}
              >
                here
              </Typography>
              <Typography
                variant="paragraphTiny"
                sx={{
                  display: 'inline',
                  color: (theme) => theme.palette.text.gray,
                }}
              >
                to deposit your {reserveToken?.symbol} and get h
                {reserveToken?.symbol}, which you can then further boost by
                depositing into the backstop.
              </Typography>
            </Box>
          )}
        </Box>
        <Box pt={4}>
          <ButtonLayout>
            <Button
              variant="outlined"
              size="medium"
              text={messages.CANCEL}
              onClick={goBack}
              sx={{
                width: (theme) => ({
                  sm: theme.spacing(16),
                }),
              }}
            />
            <Button
              data-testid={testIds.DEPOSIT_BUTTON}
              variant="contained"
              size="medium"
              isFetching={actionInProgress === ActionInProgress.BackstopDeposit}
              text={messages.DEPOSIT}
              onClick={onDepositRequest}
              disabled={!isValidSubmit}
              sx={{
                width: (theme) => ({
                  sm: theme.spacing(16),
                }),
              }}
            />
          </ButtonLayout>
        </Box>
      </Paper>
    </Box>
  )
}

export default DepositBackstopAssetPage
