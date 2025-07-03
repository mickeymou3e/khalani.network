import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import { BigNumber } from 'ethers'
import numbro from 'numbro'

import { ActionInProgressBanner } from '@components/banners/ActionInProgressBanner'
import { ActionInProgress } from '@constants/Action'
import { BorrowType } from '@constants/Lending'
import {
  Button,
  ButtonLayout,
  convertBigNumberToDecimal,
  SummaryLabel,
} from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { balancesSelectors } from '@store/balances/balances.selector'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { StoreDispatch } from '@store/store.types'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { useGoBack } from '@utils/navigation'
import { checkIsSupportedNetworkInUrl } from '@utils/network'
import { formatNetworkName } from '@utils/stringOperations'
import { bigNumberPercentage } from '@utils/table'
import {
  getBorrowType,
  getBorrowTypeName,
  getNextBorrowTypeName,
} from '@utils/token'

import { useGetAssetFromSlug, useQuery } from '../hooks'
import { useDebtTokenByInterestType } from './InterestSwap.hooks'
import { messages } from './InterestSwap.messages'

const InterestSwapPage: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const queryInterestType = useQuery().get('interestType')

  const currentInterestType = queryInterestType
    ? getBorrowType(queryInterestType)
    : undefined

  const { pathname } = useLocation()
  const isNetworkInUrl = checkIsSupportedNetworkInUrl(pathname)

  const actionInProgress = useSelector(contractsSelectors.actionInProgress)
  const token = useGetAssetFromSlug()
  const goBack = useGoBack()
  const reserveById = useSelector(reservesSelectors.selectById)
  const reserve = reserveById(token?.address)
  const debtTokenById = useSelector(tokenSelectors.selectById)

  const debtTokenAddress = useDebtTokenByInterestType(
    token?.address,
    currentInterestType,
  )
  const debtToken = debtTokenById(debtTokenAddress)
  const balances = useSelector(balancesSelectors.selectUserBalances)

  const balance = debtToken ? balances?.balances[debtToken?.address] : undefined

  const stableInterestRate = reserve?.stableBorrowRate ?? BigNumber.from(0)
  const variableInterestRate = reserve?.variableBorrowRate ?? BigNumber.from(0)

  const currentInterestRate =
    currentInterestType === BorrowType.variable
      ? variableInterestRate
      : stableInterestRate

  const nextInterestRate =
    currentInterestType === BorrowType.variable
      ? stableInterestRate
      : variableInterestRate

  const currentInterestRateLabel = bigNumberPercentage(currentInterestRate)

  const nextInterestRateLabel = bigNumberPercentage(nextInterestRate)

  const onSwapBorrowModeRequest = () => {
    if (balance != undefined && currentInterestType !== undefined && token) {
      dispatch(
        providerActions.swapBorrowModeRequest({
          amount: balance.value,
          assetAddress: token.address,
          borrowType: currentInterestType,
        }),
      )
    }
  }

  const amount = balance?.value

  const amountLabel = numbro(
    convertBigNumberToDecimal(
      amount ?? BigNumber.from(0),
      token?.decimals ?? 0,
    ),
  )
    .format('$0.00a')
    .slice(1)

  const shouldRedirect =
    !currentInterestType ||
    token === undefined ||
    amount?.eq(BigNumber.from('0'))

  return (
    <Box maxWidth="750px" display="flex" flexDirection="column" margin="auto">
      {shouldRedirect && (
        <Redirect
          push
          to={`/${formatNetworkName(isNetworkInUrl?.name ?? '/')}/dashboard`}
        />
      )}

      {token && (
        <Paper elevation={3} sx={{ padding: 1, marginBottom: 2 }}>
          <ActionInProgressBanner
            actionInProgress={actionInProgress}
            currentAction={ActionInProgress.SwapBorrowMode}
          />

          <>
            <Box textAlign="left" display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="flex-end" gap={1}>
                <Typography variant="h4Bold">
                  {messages.INTEREST_SWAP_TITLE}
                </Typography>
                <Typography
                  variant="h4Bold"
                  color={(theme) => theme.palette.text.quaternary}
                >
                  {getNextBorrowTypeName(currentInterestType).toUpperCase()}
                </Typography>
              </Box>
              <Typography color={(theme) => theme.palette.text.secondary}>
                {messages.INTEREST_SWAP_DESCRIPTION}
              </Typography>
            </Box>

            <Box
              pt={3}
              display="flex"
              alignContent="center"
              justifyContent="center"
              flexDirection="column"
            >
              <SummaryLabel
                showTopBorder
                label={messages.AMOUNT}
                value={
                  <Box display="flex" alignItems="center">
                    <Typography paddingLeft={1} variant="paragraphSmall">
                      {amountLabel}
                    </Typography>
                    <Typography paddingLeft={1} variant="paragraphSmall">
                      {token?.symbol}
                    </Typography>
                  </Box>
                }
              />
              <SummaryLabel
                label={messages.CURRENT_BORROW_TYPE(
                  currentInterestType
                    ? getBorrowTypeName(currentInterestType)
                    : '-',
                )}
                value={currentInterestRateLabel}
              />

              <SummaryLabel
                label={messages.NEXT_BORROW_TYPE(
                  currentInterestType
                    ? getNextBorrowTypeName(currentInterestType)
                    : '-',
                )}
                value={nextInterestRateLabel}
              />
              <Box pt={2}>
                <Typography
                  color={(theme) => theme.palette.text.gray}
                  variant="paragraphTiny"
                >
                  {messages.INTEREST_SWAP_TOOLTIP}
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
                  isFetching={
                    actionInProgress === ActionInProgress.SwapBorrowMode
                  }
                  text={messages.SUBMIT}
                  onClick={onSwapBorrowModeRequest}
                  disabled={actionInProgress !== undefined}
                  sx={{
                    width: (theme) => ({
                      sm: theme.spacing(16),
                    }),
                  }}
                />
              </ButtonLayout>
            </Box>
          </>
        </Paper>
      )}
    </Box>
  )
}

export default InterestSwapPage
