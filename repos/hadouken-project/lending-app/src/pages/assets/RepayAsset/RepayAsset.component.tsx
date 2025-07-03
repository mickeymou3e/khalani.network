import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import { BigNumber } from 'ethers'

import { ActionInProgressBanner } from '@components/banners/ActionInProgressBanner'
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
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { userDataSelector } from '@store/userData/userData.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { calculateHealthFactor } from '@utils/math'
import { useGoBack } from '@utils/navigation'
import { checkIsSupportedNetworkInUrl } from '@utils/network'
import {
  formatNetworkName,
  getHealthFactorLabel,
} from '@utils/stringOperations'

import { useGetAssetFromSlug, useOnActionCompleted, useQuery } from '../hooks'
import { useUserBorrowTokenBalanceOverTime } from './RepayAsset.hooks'
import { messages } from './RepayAsset.messages'

const RepayAssetPage: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const [amount, setAmount] = useState<BigNumber | undefined>()

  const [shouldRepayAll, setShouldRepayAll] = useState(false)
  const { pathname } = useLocation()
  const isNetworkInUrl = checkIsSupportedNetworkInUrl(pathname)
  const query = useQuery()
  const actionInProgress = useSelector(contractsSelectors.actionInProgress)
  const token = useGetAssetFromSlug()
  const priceSelector = useSelector(pricesSelectors.selectById)
  const goBack = useGoBack()

  const isConnectedToSupportedNetwork = useSelector(
    walletSelectors.isConnectedToSupportedNetwork,
  )

  const clearAmount = useCallback(() => {
    setAmount(undefined)
  }, [setAmount])

  useOnActionCompleted(ActionInProgress.Repay, actionInProgress, clearAmount)

  const price = token?.symbol
    ? priceSelector(token.symbol)?.price || BigNumber.from(0)
    : BigNumber.from(0)

  const reserveById = useSelector(reservesSelectors.selectById)

  const reserve = token?.address ? reserveById(token.address) : undefined

  const debtTokenById = useSelector(tokenSelectors.selectById)
  const borrowType = Number(query.get('borrowType'))

  const debtToken = reserve
    ? debtTokenById(
        borrowType === 2
          ? reserve.variableDebtTokenAddress
          : reserve.stableDebtTokenAddress,
      )
    : undefined

  const balances = useSelector(balancesSelectors.selectUserBalances)
  const balance = debtToken?.address
    ? balances?.balances[debtToken.address]
    : undefined

  const userErc20Balance =
    token?.address && balances?.balances[token.address]
      ? balances?.balances[token.address].value || BigNumber.from(0)
      : BigNumber.from(0)

  const userDebt = useUserBorrowTokenBalanceOverTime(debtToken?.address)

  const userMaxAmount = userDebt.gt(userErc20Balance)
    ? userErc20Balance
    : userDebt

  const userDataInfo = useSelector(userDataSelector.userDataInfo)
  const healthFactor = useSelector(userDataSelector.userHealthFactor)

  const parseBalance = (value?: BigNumber) =>
    value && token?.decimals
      ? value
          ?.mul(BigNumber.from(10).pow(ETH_DECIMALS - token?.decimals))
          .mul(price)
          .div(
            BigNumber.from(10).pow(CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS),
          )
      : BigNumber.from(0)

  const newHealthFactor = shouldRepayAll
    ? calculateHealthFactor(
        userDataInfo.totalBorrow.sub(parseBalance(userMaxAmount)),
        userDataInfo.totalCollateral,
        userDataInfo.currentLiquidationThreshold,
      )
    : calculateHealthFactor(
        userDataInfo.totalBorrow.sub(parseBalance(amount)),
        userDataInfo.totalCollateral,
        userDataInfo.currentLiquidationThreshold,
      )

  const onRepayRequest = () => {
    if (amount !== undefined && token) {
      dispatch(
        providerActions.repayRequest({
          amount: amount,
          assetAddress: token.address,
          borrowType: borrowType,
          repayAll: shouldRepayAll,
          slippage: 0.5,
        }),
      )
    }
  }

  const onAmountChange = (input: BigNumber) => {
    const value = input || BigNumber.from(0)

    if (value.eq(BigNumber.from(-1))) {
      setShouldRepayAll(true)
      setAmount(userMaxAmount)
      return
    }

    if (!shouldRepayAll && value?.gte(userDebt)) {
      setShouldRepayAll(true)
    } else if (shouldRepayAll && value?.lt(userDebt)) {
      setShouldRepayAll(false)
    }

    setAmount(input)
  }

  const remainAmountValue =
    shouldRepayAll ||
    userDebt?.eq(0) ||
    (amount && userDebt && amount.gt(userDebt))
      ? BigNumber.from(0)
      : userDebt.sub(amount ?? BigNumber.from(0))

  const remainAmount = Number(
    convertBigNumberToDecimal(remainAmountValue, token?.decimals ?? 0),
  )

  const remainAmountLabel =
    getDisplayingValue(remainAmount, 3) + ` ${token?.symbol || ''}`

  const oldHealthFactorLabelValue = getHealthFactorLabel(healthFactor)
  const newHealthFactorLabelValue = getHealthFactorLabel(newHealthFactor)

  const isValidInput =
    amount && amount.gt(BigNumber.from(0)) && amount.lte(userDebt)

  const shouldRedirect =
    token === undefined ||
    (token !== undefined && token !== null && balance?.value === undefined) ||
    (balance && balance.value && balance.value.eq(0))

  useEffect(() => {
    if (amount?.gt(userMaxAmount)) {
      setAmount(userMaxAmount)
    }
  }, [amount, userMaxAmount])

  return (
    <Box maxWidth="616px" display="flex" flexDirection="column" margin="auto">
      <Paper elevation={3} sx={{ padding: 1, marginBottom: 2 }}>
        <ActionInProgressBanner
          actionInProgress={actionInProgress}
          currentAction={ActionInProgress.Repay}
        />

        {shouldRedirect && (
          <Redirect
            push
            to={`/${formatNetworkName(isNetworkInUrl?.name ?? '/')}/dashboard`}
          />
        )}

        <Paragraph
          title={messages.REPAY_TITLE}
          description={messages.REPAY_DESCRIPTION}
        />
        <Box py={(theme) => ({ xs: theme.spacing(2), md: theme.spacing(3) })}>
          <TokenInput
            token={token ?? undefined}
            amount={amount}
            maxAmount={userMaxAmount}
            onAmountChange={onAmountChange}
            onMaxRequest={() => setAmount(BigNumber.from(-1))}
            maxInputDisabled={userErc20Balance.lte(0)}
          />
        </Box>

        <Box
          display="flex"
          alignContent="center"
          justifyContent="center"
          flexDirection="column"
        >
          <SummaryLabel
            label={messages.REPAY_ALL}
            value={
              <Typography
                paddingLeft={1}
                color={(theme) =>
                  shouldRepayAll
                    ? theme.palette.success.main
                    : theme.palette.error.main
                }
              >
                {shouldRepayAll ? 'Yes' : 'No'}
              </Typography>
            }
          />
          <SummaryLabel
            showTopBorder
            label={messages.REMAIN_TO_REPAY}
            value={
              <Tooltip title={remainAmount}>
                <Typography paddingLeft={1} variant="paragraphSmall">
                  {remainAmountLabel}
                </Typography>
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
              variant="contained"
              size="medium"
              isFetching={actionInProgress === ActionInProgress.Repay}
              text={messages.REPAY}
              onClick={onRepayRequest}
              disabled={
                actionInProgress !== undefined ||
                !isValidInput ||
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
    </Box>
  )
}

export default RepayAssetPage
