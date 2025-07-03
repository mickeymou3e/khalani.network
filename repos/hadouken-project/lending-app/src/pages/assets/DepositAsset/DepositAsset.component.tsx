import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import { BigNumber } from 'ethers'

import { ActionInProgressBanner } from '@components/banners/ActionInProgressBanner'
import { LimitBanner } from '@components/banners/LimitBanner'
import { ActionInProgress } from '@constants/Action'
import {
  CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS,
  ETH_DECIMALS,
} from '@constants/Lending'
import {
  Button,
  ButtonLayout,
  Paragraph,
  SummaryLabel,
  TokenInput,
  convertBigNumberToDecimal,
  getDisplayingValue,
} from '@hadouken-project/ui'
import { Box, Paper, Tooltip, Typography } from '@mui/material'
import { balancesSelectors } from '@store/balances/balances.selector'
import { pricesSelectors } from '@store/prices/prices.selector'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { StoreDispatch } from '@store/store.types'
import { userDataSelector } from '@store/userData/userData.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { errorMessages } from '@utils/errors'
import { calculateHealthFactor, maxAmountWithCap } from '@utils/math'
import { useGoBack } from '@utils/navigation'
import { checkIsSupportedNetworkInUrl } from '@utils/network'
import {
  formatNetworkName,
  getHealthFactorLabel,
} from '@utils/stringOperations'
import { testIds } from '@utils/tests'

import { useGetAssetFromSlug, useOnActionCompleted } from '../hooks'
import { messages } from './DepositAsset.messages'

const DepositAssetPage: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const goBack = useGoBack()

  const { pathname } = useLocation()
  const isNetworkInUrl = checkIsSupportedNetworkInUrl(pathname)

  const actionInProgress = useSelector(contractsSelectors.actionInProgress)
  const isConnectedToSupportedNetwork = useSelector(
    walletSelectors.isConnectedToSupportedNetwork,
  )

  const [amount, setAmount] = useState<BigNumber | undefined>()

  const clearAmount = useCallback(() => {
    setAmount(undefined)
  }, [setAmount])

  useOnActionCompleted(ActionInProgress.Deposit, actionInProgress, clearAmount)

  const depositToken = useGetAssetFromSlug()
  const selectTokenBalance = useSelector(
    balancesSelectors.selectUserTokenBalance,
  )
  const tokenDepositBalance = useSelector(
    balancesSelectors.selectUserDepositBalance,
  )

  const reserves = useSelector(reservesSelectors.selectById)

  const reserve = depositToken?.address
    ? reserves(depositToken.address)
    : undefined

  const depositCap =
    reserve?.depositCap?.mul(BigNumber.from(10).pow(reserve.decimals)) ||
    BigNumber.from(0)

  const userTokenBalance = depositToken?.address
    ? selectTokenBalance(depositToken?.address)?.value ?? BigNumber.from(0)
    : BigNumber.from(0)

  const totalBorrowed =
    reserve?.totalStableDebt.add(reserve.totalVariableDebt) || BigNumber.from(0)
  const marketSize = reserve?.availableLiquidity.add(totalBorrowed)
  const maxAmount = maxAmountWithCap(marketSize, depositCap, userTokenBalance)

  const userDepositBalance =
    depositToken?.address && reserve?.aTokenAddress
      ? tokenDepositBalance(reserve.aTokenAddress)?.value || BigNumber.from(0)
      : BigNumber.from(0)

  const priceSelector = useSelector(pricesSelectors.selectById)

  const price = depositToken?.symbol
    ? priceSelector(depositToken?.symbol)?.price || BigNumber.from(0)
    : BigNumber.from(0)

  const userDataInfo = useSelector(userDataSelector.userDataInfo)
  const healthFactor = useSelector(userDataSelector.userHealthFactor)

  const userDeposit = userDataInfo?.depositAssets?.find(
    (deposit) => deposit.TokenBalance.tokenAddress === reserve?.address,
  )

  const isCollateral =
    userDeposit?.isCollateral && !reserve?.ltv.eq(BigNumber.from(0))

  const parsedBalance =
    depositToken?.decimals && amount !== null
      ? amount
          ?.mul(BigNumber.from(10).pow(ETH_DECIMALS - depositToken?.decimals))
          .mul(price)
          .div(
            BigNumber.from(10).pow(CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS),
          )
      : BigNumber.from(0)

  const newHealthFactor =
    isCollateral && reserve?.ltv?.gt(BigNumber.from(0))
      ? calculateHealthFactor(
          userDataInfo.totalBorrow,
          userDataInfo.totalCollateral.add(parsedBalance ?? BigNumber.from(0)),
          userDataInfo.currentLiquidationThreshold,
        )
      : healthFactor

  const oldHealthFactorLabelValue = getHealthFactorLabel(healthFactor)
  const newHealthFactorLabelValue = getHealthFactorLabel(newHealthFactor)

  const currentDepositValue = Number(
    convertBigNumberToDecimal(userDepositBalance, depositToken?.decimals ?? 0),
  )

  const currentDepositValueLabel =
    getDisplayingValue(currentDepositValue, 3) +
    ` ${depositToken?.symbol || ''}`

  const depositValue = Number(
    convertBigNumberToDecimal(
      userDepositBalance.add(amount || BigNumber.from(0)),
      depositToken?.decimals ?? 0,
    ),
  )

  const depositValueLabel =
    getDisplayingValue(depositValue, 3) + ` ${depositToken?.symbol || ''}`

  const isValidInput = amount === undefined || amount?.lte(userTokenBalance)

  const isValidSubmit =
    actionInProgress === undefined &&
    isValidInput &&
    amount?.gt(BigNumber.from(0))

  const onDepositRequest = () => {
    if (amount !== undefined && depositToken) {
      dispatch(
        providerActions.depositRequest({
          amount: amount,
          assetAddress: depositToken.address,
        }),
      )
    }
  }

  const onAmountChange = (value: BigNumber) => {
    setAmount(value)
  }

  return (
    <Box maxWidth="616px" display="flex" flexDirection="column" margin="auto">
      <Paper elevation={3} sx={{ padding: 1, marginBottom: 2 }}>
        {depositToken === undefined && (
          <Redirect
            push
            to={`/${formatNetworkName(isNetworkInUrl?.name ?? '/')}/deposit`}
          />
        )}

        <ActionInProgressBanner
          actionInProgress={actionInProgress}
          currentAction={ActionInProgress.Deposit}
        />

        <Paragraph
          title={messages.DEPOSIT_TITLE}
          description={messages.DEPOSIT_DESCRIPTION}
          textAlign="left"
        />
        <Box py={3}>
          <TokenInput
            error={!isValidInput ? errorMessages.NOT_ENOUGH_ASSETS : undefined}
            token={depositToken ?? undefined}
            amount={amount}
            maxAmount={maxAmount}
            onAmountChange={onAmountChange}
            onMaxRequest={() => onAmountChange(maxAmount)}
            isFetchingMaxAmount={!depositToken}
            maxInputDisabled={userTokenBalance.lte(0)}
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
            value={
              <Tooltip title={currentDepositValue.toString()}>
                <Typography>{currentDepositValueLabel}</Typography>
              </Tooltip>
            }
          />
          <SummaryLabel
            label={messages.NEW_DEPOSIT_BALANCE}
            value={
              <Tooltip title={depositValue.toString()}>
                <Typography>{depositValueLabel}</Typography>
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
          <Box pt={3}>
            <Typography
              color={(theme) => theme.palette.text.gray}
              variant="paragraphTiny"
            >
              {messages.HEALTH_FACTOR_TIP}
            </Typography>
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
              data-testid={testIds.DEPOSIT_BUTTON}
              variant="contained"
              size="medium"
              isFetching={actionInProgress === ActionInProgress.Deposit}
              text={messages.DEPOSIT}
              onClick={onDepositRequest}
              disabled={!isValidSubmit || !isConnectedToSupportedNetwork}
              sx={{
                width: (theme) => ({
                  sm: theme.spacing(16),
                }),
              }}
            />
          </ButtonLayout>
        </Box>
      </Paper>
      <LimitBanner
        display={
          maxAmount.lt(userTokenBalance) && !depositCap.eq(BigNumber.from(0))
        }
        action={ActionInProgress.Deposit}
        decimals={reserve?.decimals}
        userLimit={maxAmount}
        limit={depositCap}
      />
    </Box>
  )
}

export default DepositAssetPage
