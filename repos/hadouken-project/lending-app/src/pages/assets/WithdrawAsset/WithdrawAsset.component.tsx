import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import { BigNumber } from 'ethers'

import errorPatternBackgroundImage from '@assets/error-pattern.svg'
import { ActionInProgressBanner } from '@components/banners/ActionInProgressBanner'
import { ActionInProgress } from '@constants/Action'
import {
  CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS,
  ETH_DECIMALS,
  HEALTH_FACTOR_DECIMAL,
} from '@constants/Lending'
import {
  Button,
  ButtonLayout,
  ErrorBanner,
  Paragraph,
  SummaryLabel,
  TokenInput,
  convertBigNumberToDecimal,
  getDisplayingValue,
} from '@hadouken-project/ui'
import {
  Box,
  Paper,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { pricesSelectors } from '@store/prices/prices.selector'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { StoreDispatch } from '@store/store.types'
import { userDataSelector } from '@store/userData/userData.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import {
  calculateHealthFactor,
  calculateUserAssetMaxWithdrawAmount,
} from '@utils/math'
import { useGoBack } from '@utils/navigation'
import { checkIsSupportedNetworkInUrl } from '@utils/network'
import {
  formatNetworkName,
  getHealthFactorLabel,
} from '@utils/stringOperations'
import { testIds } from '@utils/tests'

import { balancesSelectors } from '../../../store/balances/balances.selector'
import { useGetAssetFromSlug, useOnActionCompleted } from '../hooks'
import { useDepositTokenBalanceOverTime } from './WithdrawAsset.hooks'
import { messages } from './WithdrawAsset.messages'

const WithdrawAssetPage: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const goBack = useGoBack()
  const [amount, setAmount] = useState<BigNumber | undefined>()
  const [shouldWithdrawAll, setShouldWithdrawAll] = useState(false)
  const withdrawToken = useGetAssetFromSlug()
  const { pathname } = useLocation()
  const isNetworkInUrl = checkIsSupportedNetworkInUrl(pathname)

  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const actionInProgress = useSelector(contractsSelectors.actionInProgress)
  const reserveSelector = useSelector(reservesSelectors.selectById)
  const isConnectedToSupportedNetwork = useSelector(
    walletSelectors.isConnectedToSupportedNetwork,
  )

  const clearAmount = useCallback(() => {
    setAmount(undefined)
  }, [setAmount])

  useOnActionCompleted(ActionInProgress.Withdraw, actionInProgress, clearAmount)

  const reserve = withdrawToken?.address
    ? reserveSelector(withdrawToken?.address)
    : null

  const priceSelector = useSelector(pricesSelectors.selectById)
  const price = reserve
    ? priceSelector(reserve?.symbol)?.price || BigNumber.from(0)
    : BigNumber.from(0)

  const userATokenBalance = useDepositTokenBalanceOverTime(reserve?.address)

  const userDataInfo = useSelector(userDataSelector.userDataInfo)
  const healthFactor = useSelector(userDataSelector.userHealthFactor)

  const userDeposit = userDataInfo?.depositAssets?.find(
    (deposit) => deposit.TokenBalance.tokenAddress === reserve?.address,
  )

  const parsedBalance =
    amount && reserve?.decimals
      ? amount
          ?.mul(BigNumber.from(10).pow(ETH_DECIMALS - reserve?.decimals))
          .mul(price)
          .div(
            BigNumber.from(10).pow(CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS),
          )
      : BigNumber.from(0)

  const userDepositSelector = useSelector(
    balancesSelectors.selectUserDepositBalance,
  )
  const depositBalance = userDepositSelector(reserve?.aTokenAddress)
  const liquidityLimited =
    depositBalance?.value &&
    reserve?.availableLiquidity &&
    depositBalance.value.gt(reserve.availableLiquidity)

  const maxWithdrawAmount = calculateUserAssetMaxWithdrawAmount(
    depositBalance,
    reserve,
    userDataInfo,
    price,
  )

  const newHealthFactor = userDeposit?.isCollateral
    ? calculateHealthFactor(
        userDataInfo.totalBorrow,
        userDataInfo.totalCollateral.sub(parsedBalance),
        userDataInfo.currentLiquidationThreshold,
      )
    : healthFactor

  const onWithdrawRequest = () => {
    if (amount !== undefined && reserve) {
      dispatch(
        providerActions.withdrawRequest({
          amount: amount,
          assetAddress: reserve.address,
          withdrawAll: shouldWithdrawAll,
        }),
      )
    }
  }

  const onAmountChange = (input: BigNumber) => {
    const userTotalDeposit = depositBalance?.value ?? BigNumber.from(0)
    const value = input || BigNumber.from(0)

    if (value.eq(BigNumber.from(-1))) {
      setShouldWithdrawAll(true)
      setAmount(maxWithdrawAmount)
      return
    }

    if (!shouldWithdrawAll && value?.gte(userTotalDeposit)) {
      setShouldWithdrawAll(true)
    } else if (shouldWithdrawAll && value?.lt(userTotalDeposit)) {
      setShouldWithdrawAll(false)
    }

    setAmount(input)
  }

  const isValidInput =
    amount && amount.gt(BigNumber.from(0)) && amount.lte(maxWithdrawAmount)

  const isCollateral =
    userDeposit && reserve
      ? userDeposit.isCollateral && !reserve.liquidityThreshold.isZero()
      : false
  const canSubmit =
    !isCollateral ||
    (isValidInput &&
      Number(
        convertBigNumberToDecimal(newHealthFactor, HEALTH_FACTOR_DECIMAL),
      ) >= 1)

  const oldHealthFactorLabelValue = getHealthFactorLabel(healthFactor)
  const newHealthFactorLabelValue = getHealthFactorLabel(newHealthFactor)

  const userDepositBalance = depositBalance?.value ?? BigNumber.from(0)

  const balanceAfterWithdraw = shouldWithdrawAll
    ? 0
    : Number(
        convertBigNumberToDecimal(
          userDepositBalance.sub(amount ?? 0),
          reserve?.decimals ?? 0,
        ),
      )

  const balanceAfterWithdrawLabel =
    getDisplayingValue(balanceAfterWithdraw, 3) +
    ` ${withdrawToken?.symbol || ''}`

  const shouldRedirect =
    withdrawToken === undefined ||
    (withdrawToken && userATokenBalance.eq(BigNumber.from(0))) ||
    (withdrawToken !== undefined &&
      withdrawToken !== null &&
      userDeposit === undefined &&
      userDataInfo.isInitialized)

  useEffect(() => {
    if (amount?.gt(maxWithdrawAmount)) {
      setAmount(maxWithdrawAmount)
    }
  }, [amount, maxWithdrawAmount])

  return (
    <Box maxWidth="616px" display="flex" flexDirection="column" margin="auto">
      <Paper elevation={3} sx={{ padding: 1, marginBottom: 2 }}>
        <ActionInProgressBanner
          actionInProgress={actionInProgress}
          currentAction={ActionInProgress.Withdraw}
        />

        {shouldRedirect && (
          <Redirect
            push
            to={`/${formatNetworkName(isNetworkInUrl?.name ?? '/')}/dashboard`}
          />
        )}

        <Paragraph
          title={messages.WITHDRAW_TITLE}
          description={messages.WITHDRAW_DESCRIPTION}
        />
        <Box py={(theme) => ({ xs: theme.spacing(2), md: theme.spacing(3) })}>
          <TokenInput
            token={withdrawToken ?? undefined}
            amount={amount}
            maxAmount={maxWithdrawAmount}
            onAmountChange={onAmountChange}
            onMaxRequest={() => setAmount(BigNumber.from(-1))}
            maxInputDisabled={maxWithdrawAmount.lte(0)}
          />
        </Box>
        <Box display="flex" alignContent="center" justifyContent="center">
          <Box width="100%">
            <SummaryLabel
              label={messages.WITHDRAW_ALL}
              value={
                <Typography
                  paddingLeft={1}
                  variant="paragraphSmall"
                  color={(theme) =>
                    shouldWithdrawAll
                      ? theme.palette.success.main
                      : theme.palette.error.main
                  }
                >
                  {shouldWithdrawAll === true ? 'Yes' : 'No'}
                </Typography>
              }
            />
            <SummaryLabel
              label={messages.REMAINING_TO_WITHDRAW}
              value={
                <Tooltip title={balanceAfterWithdraw}>
                  <Box display="flex" alignItems="center" justifyContent="end">
                    <Typography variant="paragraphSmall">
                      {balanceAfterWithdrawLabel}
                    </Typography>
                  </Box>
                </Tooltip>
              }
            />
            <SummaryLabel
              label={messages.OLD_HEALTH_FACTOR}
              value={oldHealthFactorLabelValue}
            />

            <SummaryLabel
              label={messages.NEW_HEALTH_FACTOR}
              value={newHealthFactorLabelValue}
            />

            <Box pt={2}>
              <Typography
                color={(theme) => theme.palette.text.gray}
                variant="paragraphTiny"
              >
                {messages.HEALTH_FACTOR_TOOLTIP}
              </Typography>
            </Box>
          </Box>
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
              data-testid={testIds.WITHDRAW_BUTTON}
              variant="contained"
              size="medium"
              isFetching={actionInProgress === ActionInProgress.Withdraw}
              text={messages.WITHDRAW}
              onClick={onWithdrawRequest}
              disabled={
                actionInProgress !== undefined ||
                !canSubmit ||
                !isConnectedToSupportedNetwork
              }
              sx={{
                width: (theme) => ({
                  sm: theme.spacing(16),
                }),
              }}
            />
          </ButtonLayout>
        </Box>
      </Paper>

      {liquidityLimited && amount?.gte(maxWithdrawAmount) && (
        <ErrorBanner
          backgroundImageUrl={errorPatternBackgroundImage}
          noFill={isMobile}
          text={messages.LIMITED_LIQUIDITY}
        />
      )}
    </Box>
  )
}

export default WithdrawAssetPage
