import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { BigNumber } from 'ethers'

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
  ErrorIcon,
  Paragraph,
  SummaryLabel,
  convertBigNumberToDecimal,
} from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { balancesSelectors } from '@store/balances/balances.selector'
import { pricesSelectors } from '@store/prices/prices.selector'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { userDataSelector } from '@store/userData/userData.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { addDecimals, calculateHealthFactor } from '@utils/math'
import { useGoBack } from '@utils/navigation'
import {
  formatNetworkName,
  getHealthFactorLabel,
} from '@utils/stringOperations'

import { useGetAssetFromSlug, useQuery } from '../hooks'
import { messages } from './CollateralSwitch.messages'

const CollateralSwitchPage: React.FC = () => {
  const priceSelector = useSelector(pricesSelectors.selectById)
  const token = useGetAssetFromSlug()
  const dispatch = useDispatch()
  const applicationNetworkName = useSelector(
    walletSelectors.applicationNetworkName,
  )

  const price = priceSelector(token?.symbol)?.price || BigNumber.from(0)
  const userDeposits = useSelector(balancesSelectors.selectUserDepositBalances)
  const userDeposit = userDeposits?.find(
    (deposit) => deposit.symbol === token?.symbol,
  )
  const queryIsCollateral = useQuery().get('isCollateral')
  const useAsCollateral = queryIsCollateral === 'true'
  const userDataInfo = useSelector(userDataSelector.userDataInfo)
  const oldHealthFactor = useSelector(userDataSelector.userHealthFactor)
  const reserveSelector = useSelector(reservesSelectors.selectById)
  const reserve = reserveSelector(token?.address)

  const isConnectedToSupportedNetwork = useSelector(
    walletSelectors.isConnectedToSupportedNetwork,
  )

  const goBack = useGoBack()
  const balanceInWei = addDecimals(
    userDeposit?.value || BigNumber.from(0),
    ETH_DECIMALS - (token?.decimals || 0),
  )
  const balanceInDollars = balanceInWei
    .mul(price)
    .div(BigNumber.from(10).pow(CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS))

  const totalCollateral = useAsCollateral
    ? userDataInfo.totalCollateral.add(balanceInDollars)
    : userDataInfo.totalCollateral.sub(balanceInDollars)

  const newHealthFactor = calculateHealthFactor(
    userDataInfo.totalBorrow,
    totalCollateral,
    userDataInfo.currentLiquidationThreshold,
  )
  const actionInProgress = useSelector(contractsSelectors.actionInProgress)
  const oldHealthFactorLabelValue = getHealthFactorLabel(oldHealthFactor)
  const newHealthFactorLabelValue = getHealthFactorLabel(newHealthFactor)

  const onSubmitHandle = () =>
    dispatch(
      providerActions.collateralRequest({
        asset: token?.address || '',
        amount: userDeposit?.value || BigNumber.from(0),
        useAsCollateral,
      }),
    )

  const canSubmit =
    Number(convertBigNumberToDecimal(newHealthFactor, HEALTH_FACTOR_DECIMAL)) >
    1

  const shouldRedirect =
    token === undefined ||
    (reserve && reserve.ltv.eq(BigNumber.from(0))) ||
    (token !== undefined && token !== null && userDeposits?.length === 0) ||
    (queryIsCollateral !== 'true' && queryIsCollateral !== 'false') ||
    userDeposit?.isCollateral === useAsCollateral

  return (
    <Box maxWidth="616px" display="flex" flexDirection="column" margin="auto">
      {shouldRedirect && (
        <Redirect
          push
          to={`/${formatNetworkName(applicationNetworkName ?? '/')}`}
        />
      )}
      {token && (
        <Paper elevation={3} sx={{ padding: 1, marginBottom: 2 }}>
          <ActionInProgressBanner
            actionInProgress={actionInProgress}
            currentAction={ActionInProgress.CollateralSwitch}
          />

          <>
            <Paragraph
              title={messages.COLLATERAL_TITLE(token.symbol)}
              description={messages.COLLATERAL_SUBTITLE}
              textAlign="left"
            />

            <Box
              pt={4}
              display="flex"
              alignContent="center"
              justifyContent="center"
              flexDirection="column"
            >
              <SummaryLabel
                showTopBorder
                label={messages.USE_AS_COLLATERAL}
                value={
                  <Typography
                    color={(theme) =>
                      useAsCollateral
                        ? theme.palette.success.main
                        : theme.palette.error.main
                    }
                    variant="paragraphSmall"
                  >
                    {useAsCollateral ? 'Yes' : 'No'}
                  </Typography>
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
                  {messages.COLLATERAL_DESCRIPTION}
                </Typography>
              </Box>
            </Box>

            <Box pt={4}>
              <ButtonLayout>
                {!canSubmit ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ErrorIcon />
                    <Typography
                      sx={{ ml: 2 }}
                      variant="paragraphTiny"
                      color="error"
                    >
                      {messages.HEALTH_FACTOR_TOO_LOW}
                    </Typography>
                  </Box>
                ) : null}
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
                    actionInProgress === ActionInProgress.CollateralSwitch
                  }
                  text={messages.SUBMIT}
                  onClick={onSubmitHandle}
                  disabled={
                    !!actionInProgress ||
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
          </>
        </Paper>
      )}
    </Box>
  )
}

export default CollateralSwitchPage
