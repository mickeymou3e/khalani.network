import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import { BigNumber } from 'ethers'

import errorPatternBackgroundImage from '@assets/error-pattern.svg'
import { ActionInProgressBanner } from '@components/banners/ActionInProgressBanner'
import { LimitBanner } from '@components/banners/LimitBanner'
import HealthCheckSlider from '@components/sliders/HealthCheckSlider'
import { ActionInProgress } from '@constants/Action'
import { MAX_BIG_NUMBER } from '@constants/Ethereum'
import { BorrowType, HEALTH_FACTOR_DECIMAL } from '@constants/Lending'
import {
  Button,
  ButtonLayout,
  ErrorBanner,
  Paragraph,
  TokenInput,
  convertBigNumberToDecimal,
  truncateToSpecificDecimals,
} from '@hadouken-project/ui'
import { Box, Paper, Theme, useMediaQuery } from '@mui/material'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { StoreDispatch } from '@store/store.types'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { useGoBack } from '@utils/navigation'
import { checkIsSupportedNetworkInUrl } from '@utils/network'
import { formatNetworkName } from '@utils/stringOperations'

import { useGetAssetFromSlug, useOnActionCompleted } from '../hooks'
import { BORROW_PERCENTAGE_DECIMALS } from './BorrowAsset.constants'
import { messages } from './BorrowAsset.messages'
import { MAX_HF, useUserAvailableToBorrow } from './BorrowAssets.hooks'

// TODO-HDK-652 bring back stable borrow
const BorrowAssetPage: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const borrowToken = useGetAssetFromSlug()
  const actionInProgress = useSelector(contractsSelectors.actionInProgress)
  const goBack = useGoBack()

  const { pathname } = useLocation()
  const isNetworkInUrl = checkIsSupportedNetworkInUrl(pathname)
  // TODO-HDK-652 bring back stable borrow
  // const [interestRate, setInterestRate] = useState(BorrowType.variable)
  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const previousAction = useRef(actionInProgress)
  const isConnectedToSupportedNetwork = useSelector(
    walletSelectors.isConnectedToSupportedNetwork,
  )

  const {
    availableToBorrow,
    healthFactor,
    amount,
    percentage,
    setUserAmount,
    borrowIsCapped,
    stableBorrowLimited,
  } = useUserAvailableToBorrow(borrowToken?.address, BorrowType.variable)

  const clearAmount = useCallback(() => {
    setUserAmount(undefined)
  }, [setUserAmount])

  const reservesSelector = useSelector(reservesSelectors.selectById)
  const reserve = reservesSelector(borrowToken?.address)

  // TODO-HDK-652 bring back stable borrow
  // const userDeposits = useSelector(userDataSelector.userDeposits)
  // const userDeposit = userDeposits.find(
  //   (x) => x.TokenBalance.tokenAddress === borrowToken?.address,
  // )
  // const depositBalance = reserve
  //   ? convertDecimalToIntegerDecimal(
  //       userDeposit?.TokenBalance.balance || '0',
  //       reserve?.decimals,
  //     )
  //   : BigNumber.from(0)

  const borrowCap =
    reserve?.borrowCap?.mul(BigNumber.from(10).pow(reserve.decimals)) ||
    BigNumber.from(0)

  useOnActionCompleted(ActionInProgress.Borrow, actionInProgress, clearAmount)

  const hideHealthFactor = healthFactor.eq(MAX_BIG_NUMBER)

  const isValidInput =
    amount && amount.gt(BigNumber.from(0)) && amount.lte(availableToBorrow)

  // TODO-HDK-652 bring back stable borrow
  // const cantBorrowOnStable =
  //   interestRate == BorrowType.stable &&
  //   userDeposit?.isCollateral &&
  //   reserve?.ltv !== BigNumber.from(0) &&
  //   (amount || BigNumber.from(0))?.lte(depositBalance)

  const canSubmit =
    isValidInput &&
    // !cantBorrowOnStable &&
    Number(convertBigNumberToDecimal(healthFactor, HEALTH_FACTOR_DECIMAL)) > 1

  const onBorrowRequest = async () => {
    if (borrowToken) {
      dispatch(
        providerActions.borrowRequest({
          amount: amount || BigNumber.from('0'),
          assetAddress: borrowToken.address,
          borrowType: Number(BorrowType.variable),
        }),
      )
    }
  }

  const onAmountChange = (value: BigNumber) => {
    setUserAmount(value)
  }

  // TODO-HDK-652 bring back stable borrow
  // const onInterestRateChange = (
  //   _: React.ChangeEvent<HTMLElement>,
  //   value: string,
  // ) => {
  //   setInterestRate((value as unknown) as BorrowType)
  // }

  useEffect(() => {
    if (
      previousAction.current === ActionInProgress.Borrow &&
      actionInProgress === undefined
    ) {
      setUserAmount(undefined)
    }

    previousAction.current = actionInProgress
  }, [setUserAmount, actionInProgress])

  useEffect(() => {
    if (amount?.gt(availableToBorrow)) {
      setUserAmount(availableToBorrow)
    }
  }, [amount, availableToBorrow, setUserAmount])

  return (
    <Box maxWidth="616px" display="flex" flexDirection="column" margin="auto">
      <Paper elevation={3} sx={{ padding: 1, marginBottom: 2 }}>
        {borrowToken === undefined && (
          <Redirect
            push
            to={`/${formatNetworkName(isNetworkInUrl?.name ?? '/')}/borrow`}
          />
        )}

        <ActionInProgressBanner
          actionInProgress={actionInProgress}
          currentAction={ActionInProgress.Borrow}
        />

        <Paragraph
          title={messages.BORROW_TITLE}
          description={messages.BORROW_DESCRIPTION}
          textAlign="left"
        />

        {/* <Box // TODO-HDK-652 bring back stable borrow
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="flex-start"
          py={4}
          gap={2}
        >
          <Typography variant="paragraphBig">
            {messages.INTEREST_RATE}
          </Typography>
          <FormControl required>
            <RadioGroup value={interestRate} onChange={onInterestRateChange}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={2}
              >
                {RADIO_OPTIONS.map((option) => (
                  <RadioButton
                    key={option.id}
                    value={option.id}
                    label={option.name}
                    disabled={
                      !reserve?.isStableBorrowingEnable && option.id === '1'
                    }
                  />
                ))}
              </Box>
            </RadioGroup>
          </FormControl>
        </Box> */}

        <Box pt={2}>
          <TokenInput
            token={borrowToken ?? undefined}
            amount={amount}
            maxAmount={availableToBorrow}
            onAmountChange={onAmountChange}
            onMaxRequest={() => onAmountChange(availableToBorrow)}
            maxInputDisabled={availableToBorrow.lte(0)}
          />
          <Box pt={3}>
            <HealthCheckSlider
              factorLabel={`${messages.HEALTH_FACTOR}:`}
              factorValueLabel={
                hideHealthFactor
                  ? 'N/A'
                  : truncateToSpecificDecimals(
                      convertBigNumberToDecimal(
                        healthFactor,
                        HEALTH_FACTOR_DECIMAL,
                      ),
                      4,
                    )
              }
              leftLabel={messages.SAFER}
              rightLabel={messages.RISKIER}
              value={percentage}
              step={10 ** (BORROW_PERCENTAGE_DECIMALS - 2)}
              max={(MAX_HF - 1) * 10 ** BORROW_PERCENTAGE_DECIMALS}
              disabled
            />
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
              isFetching={actionInProgress === ActionInProgress.Borrow}
              text={messages.BORROW}
              onClick={onBorrowRequest}
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
      {stableBorrowLimited && (
        <Box paddingBottom={2}>
          <ErrorBanner
            backgroundImageUrl={errorPatternBackgroundImage}
            noFill={isMobile}
            text={messages.STABLE_BORROW_LIMITED}
          />
        </Box>
      )}
      {/* // TODO-HDK-652 bring back stable borrow
      {cantBorrowOnStable && (
        <Box paddingBottom={2}>
          <ErrorBanner
            backgroundImageUrl={errorPatternBackgroundImage}
            noFill={isMobile}
            text={messages.STABLE_BORROW_SAME_AS_COLLATERAL}
          />
        </Box>
      )} */}
      <LimitBanner
        display={borrowIsCapped && !borrowCap.eq(BigNumber.from(0))}
        action={ActionInProgress.Borrow}
        decimals={reserve?.decimals}
        userLimit={availableToBorrow}
        limit={borrowCap}
      />
    </Box>
  )
}

export default BorrowAssetPage
