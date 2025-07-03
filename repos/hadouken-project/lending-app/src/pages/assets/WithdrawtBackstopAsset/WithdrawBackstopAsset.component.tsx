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
  Paragraph,
  SummaryLabel,
  TokenInput,
} from '@hadouken-project/ui'
import { Box, Paper } from '@mui/material'
import { backstopSelectors } from '@store/backstop/backstop.selector'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { StoreDispatch } from '@store/store.types'
import { errorMessages } from '@utils/errors'
import { useGoBack } from '@utils/navigation'
import { checkIsSupportedNetworkInUrl } from '@utils/network'
import { formatNetworkName } from '@utils/stringOperations'

import { useGetBackstopAssetFromSlug, useOnActionCompleted } from '../hooks'
import { messages } from './WithdrawBackstopAsset.messages'

const WithdrawBackstopAssetPage: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const goBack = useGoBack()
  const isFetchingBackstop = useSelector(backstopSelectors.isFetching)
  const [amount, setAmount] = useState<BigNumber | undefined>()
  const { pathname } = useLocation()
  const isNetworkInUrl = checkIsSupportedNetworkInUrl(pathname)

  const clearAmount = useCallback(() => {
    setAmount(undefined)
  }, [setAmount])

  const selectBackstopById = useSelector(backstopSelectors.selectById)
  const actionInProgress = useSelector(contractsSelectors.actionInProgress)

  useOnActionCompleted(
    ActionInProgress.BackstopWithdraw,
    actionInProgress,
    clearAmount,
  )

  const reserveToken = useGetBackstopAssetFromSlug()
  const backstopPool = selectBackstopById(reserveToken?.address)

  const userBackstopBalance = backstopPool?.userBalance ?? BigNumber.from(0)

  const currentWithdrawLabelValue = numbro(
    convertBigNumberToDecimal(userBackstopBalance, reserveToken?.decimals ?? 0),
  ).format('0.0000')

  const newWithdrawLabelValue = numbro(
    convertBigNumberToDecimal(
      userBackstopBalance.sub(amount || BigNumber.from(0)),
      reserveToken?.decimals ?? 0,
    ),
  ).format('0.0000')

  const isValidInput = amount === undefined || amount?.lte(userBackstopBalance)

  const isValidSubmit =
    actionInProgress === undefined &&
    isValidInput &&
    amount?.gt(BigNumber.from(0))

  const onWithdrawRequest = () => {
    if (amount && reserveToken?.address) {
      dispatch(
        providerActions.backstopWithdrawRequest({
          amount: amount,
          assetAddress: reserveToken?.address,
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
        {reserveToken === undefined && (
          <Redirect
            push
            to={`/${formatNetworkName(isNetworkInUrl?.name ?? '/')}/backstop`}
          />
        )}

        <ActionInProgressBanner
          actionInProgress={actionInProgress}
          currentAction={ActionInProgress.BackstopWithdraw}
        />

        <Paragraph
          title={messages.WITHDRAW_TITLE}
          description={messages.WITHDRAW_DESCRIPTION}
          textAlign="left"
        />
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
            maxAmount={userBackstopBalance}
            onAmountChange={onAmountChange}
            onMaxRequest={() => onAmountChange(userBackstopBalance)}
            isFetchingMaxAmount={!reserveToken || isFetchingBackstop}
          />
        </Box>
        <Box
          display="flex"
          alignContent="center"
          justifyContent="center"
          flexDirection="column"
        >
          <SummaryLabel
            label={messages.CURRENT_WITHDRAW_BALANCE}
            value={`${currentWithdrawLabelValue} ${reserveToken?.symbol || ''}`}
          />
          <SummaryLabel
            label={messages.NEW_WITHDRAW_BALANCE}
            value={`${newWithdrawLabelValue} ${reserveToken?.symbol || ''}`}
          />
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
              isFetching={
                actionInProgress === ActionInProgress.BackstopWithdraw
              }
              text={messages.WITHDRAW}
              onClick={onWithdrawRequest}
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

export default WithdrawBackstopAssetPage
