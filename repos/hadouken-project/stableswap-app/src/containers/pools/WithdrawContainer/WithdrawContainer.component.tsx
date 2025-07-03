import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import PercentageSlider from '@components/PercentageSlider/PercentageSlider.component'
import SlippageSelector from '@components/SlippageSelector'
import ActionInProgressBanner from '@components/banners/ActionInProgressBanner/ActionInProgressBanner.component'
import WithdrawPreviewContainer from '@containers/preview/WithdrawPreview'
import {
  Button,
  ErrorBanner,
  Modal,
  ModalHeader,
  TokenModelBalanceWithIcon,
  TokenSelectorInput,
  WarningBanner,
  convertNumberToStringWithCommas,
} from '@hadouken-project/ui'
import { ActionInProgress } from '@interfaces/action'
import { PoolType } from '@interfaces/pool'
import InfoIcon from '@mui/icons-material/Info'
import {
  Box,
  Checkbox,
  Divider,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { StoreDispatch } from '@store/store.types'
import { userSharesSelectors } from '@store/userShares/userShares.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { withdrawSelectors } from '@store/withdraw/withdraw.selector'
import { withdrawActions } from '@store/withdraw/withdraw.slice'
import { BigDecimal } from '@utils/math'
import { sortAssetsByBusinessOrder } from '@utils/token'

import TokenPreview from './TokenPreview'
import { PROPORTIONAL_TOKEN } from './WithdrawContainer.constants'
import { messages } from './WithdrawContainer.messages'
import { IWithdrawContainer } from './WithdrawContainer.types'
import { renderIconForProportional } from './WithdrawContainer.utils'

const WithdrawContainer: React.FC<IWithdrawContainer> = ({ poolId }) => {
  const dispatch = useDispatch<StoreDispatch>()

  const {
    openModal,
    withdrawAmount,
    percentage,
    priceImpact,
    slippage,
    composablePoolProportionalBalances,
    displayImbalanceComposablePoolWithSignificantUserHoldingBanner,
    selectedToken,
    tokensMaxBalance,
    buttonDisabled,
    isUserShareGreaterThanMaximumShare,
    showWrappedCheckbox,
    showWrappedTokens,
    withdrawTokens,
    loading,
  } = useSelector(withdrawSelectors.withdrawEditor)

  const proportionalToken = useMemo(() => {
    return {
      ...PROPORTIONAL_TOKEN,
      icon: renderIconForProportional(withdrawTokens),
    }
  }, [withdrawTokens])

  const actionInProgress = useSelector(contractsSelectors.actionInProgress)

  const selectUserPoolShare = useSelector(
    userSharesSelectors.selectUserPoolShare,
  )

  const userPoolShare = selectUserPoolShare(poolId)

  const withdrawAmountExceedsBalance = useSelector(
    withdrawSelectors.withdrawAmountExceedsBalance,
  )

  const withdrawTotalValueUSD = useSelector(
    withdrawSelectors.withdrawTotalValueUSD,
  )

  const userAddress = useSelector(walletSelectors.userAddress)
  const selectManyPricesByIds = useSelector(pricesSelector.selectManyByIdsNEW)

  const depositTokenBalances = useSelector(
    userSharesSelectors.depositTokenBalances,
  )

  const selectPoolModelById = useSelector(poolsModelsSelector.selectById)

  const poolModel = selectPoolModelById(poolId)

  const isProportionalWithdraw = useSelector(
    withdrawSelectors.isProportionalWithdraw,
  )

  const isCalculatingPreview = useSelector(
    withdrawSelectors.isCalculatingPreview,
  )

  const calculateShares =
    poolModel?.pool.poolType === PoolType.ComposableStable ||
    (poolModel?.pool.poolType === PoolType.WeightedBoosted && showWrappedTokens)

  const withdrawTokensWithBalance: TokenModelBalanceWithIcon[] = useMemo(() => {
    return [...withdrawTokens]
      .sort((tokenA, tokenB) =>
        sortAssetsByBusinessOrder(tokenA.symbol, tokenB.symbol),
      )
      .map((token) => ({
        ...token,
        balance: tokensMaxBalance?.[token.address] ?? BigNumber.from(0),
        hideBalance: true,
        source: token.source ?? '',
      }))
  }, [tokensMaxBalance, withdrawTokens])

  const withdrawTokensSelectorInput: TokenModelBalanceWithIcon[] = [
    ...(proportionalToken ? [proportionalToken] : []),
    ...(poolModel?.pool.poolType === PoolType.WeightedBoosted
      ? []
      : withdrawTokensWithBalance),
  ]

  useEffect(() => {
    if (poolId && userAddress) {
      dispatch(
        withdrawActions.withdrawInitializeRequest({
          poolId,
        }),
      )
    }

    return () => {
      dispatch(withdrawActions.resetWithdrawState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, poolId, userAddress])

  const prices = selectManyPricesByIds(
    withdrawTokens?.map(({ id }) => id) ?? [],
  )

  const handleClose = () => dispatch(withdrawActions.openModal(false))

  const handleWithdrawPreviewRequest = () => {
    dispatch(withdrawActions.withdrawPreviewRequest())
  }

  const onTokenChange = (token: TokenModelBalanceWithIcon) =>
    dispatch(withdrawActions.setSelectedToken(token))

  const onPercentageChange = (val: number) => {
    dispatch(withdrawActions.setPercentage(val))

    if (calculateShares) {
      dispatch(withdrawActions.draggingSlider(true))
    }
  }

  const onPercentageCommitted = (value: number) => {
    if (calculateShares) {
      dispatch(
        withdrawActions.calculateComposablePoolProportionalWithdrawRequest({
          percentage: value,
          poolId: poolId,
        }),
      )

      dispatch(withdrawActions.draggingSlider(false))
    }
  }

  const onSlippageChange = useCallback(
    (value: BigNumber) => {
      dispatch(withdrawActions.setSlippage(BigDecimal.from(value, 4)))
    },
    [dispatch],
  )

  const onWrappedTokensChange = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      dispatch(withdrawActions.wrappedTokenChangeRequest(checked))
    },
    [dispatch],
  )

  return (
    <Box>
      <Box pl={3} pb={2} display="flex" alignItems="center">
        <Typography variant="h1">{messages.TITLE}</Typography>
      </Box>
      <Box>
        <Box pb={6}>
          <Paper
            elevation={3}
            sx={{
              paddingX: { xs: 2, md: 3 },
            }}
          >
            <Box>
              <ActionInProgressBanner
                actionInProgress={actionInProgress}
                currentAction={ActionInProgress.Withdraw}
              />
            </Box>

            <Box pt={3}>
              <Box pb={3}>
                <TokenSelectorInput
                  tokens={
                    !isCalculatingPreview ? withdrawTokensSelectorInput : []
                  }
                  selectedToken={selectedToken}
                  onTokenChange={onTokenChange}
                  disabled={isProportionalWithdraw}
                  onAmountChange={(amount) => {
                    if (selectedToken) {
                      dispatch(
                        withdrawActions.amountChangeRequest(
                          BigDecimal.from(
                            amount ?? BigNumber.from(0),
                            selectedToken.decimals,
                          ),
                        ),
                      )
                    }
                  }}
                  amount={
                    withdrawAmount.gt(BigDecimal.from(0))
                      ? withdrawAmount.toBigNumber()
                      : undefined
                  }
                />
                {!isProportionalWithdraw && (
                  <>
                    {withdrawAmountExceedsBalance && (
                      <Box mt={2}>
                        <ErrorBanner>{messages.EXCEEDS_BALANCE}</ErrorBanner>
                      </Box>
                    )}
                    {isUserShareGreaterThanMaximumShare && (
                      <Box mt={2}>
                        <WarningBanner
                          title={messages.WARNING}
                          description={messages.WITHDRAW_WARNING_DESCRIPTION}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Box>
              {isProportionalWithdraw && (
                <Box width="100%">
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="paragraphTiny">
                        {messages.PROPORTIONAL_WITHDRAW}
                      </Typography>
                      <Typography variant="paragraphTiny">{`${percentage}%`}</Typography>
                    </Box>
                    <PercentageSlider
                      value={percentage}
                      onChange={onPercentageChange}
                      onChangeCommitted={onPercentageCommitted}
                    />
                  </Box>
                  {withdrawTokens &&
                    withdrawTokens.map(
                      ({
                        id,
                        decimals,
                        symbol,
                        address,
                        displayName,
                        weight,
                        source,
                      }) => {
                        const balance = poolModel
                          ? depositTokenBalances[poolModel.address]?.[
                              address
                            ] ?? BigDecimal.from(0, decimals)
                          : BigDecimal.from(0, decimals)

                        const proportionalWithdrawBalance = calculateShares
                          ? composablePoolProportionalBalances?.[address] ??
                            BigDecimal.from(0, decimals)
                          : balance.mul(BigDecimal.from(percentage, 2))

                        const tokenBalanceInUSD = prices[address]?.price
                          ? proportionalWithdrawBalance.mul(
                              prices[address]?.price,
                            )
                          : BigDecimal.from(0)

                        const tokenBalance =
                          proportionalWithdrawBalance
                            ?.toBigNumber()
                            .mul(BigNumber.from(10).pow(decimals))
                            .div(
                              BigNumber.from(10).pow(
                                proportionalWithdrawBalance.decimals,
                              ),
                            ) ?? BigNumber.from(0)

                        return (
                          <Box pt={2} key={id}>
                            <TokenPreview
                              isFetchingBalances={isCalculatingPreview}
                              symbol={symbol}
                              displayName={displayName}
                              balance={convertNumberToStringWithCommas(
                                BigDecimal.from(
                                  tokenBalance,
                                  decimals,
                                ).toNumber(),
                                4,
                                true,
                              )}
                              percentage={
                                weight && weight.gt(BigDecimal.from(0))
                                  ? weight
                                      .mul(BigDecimal.from(100, 0))
                                      .toFixed(2)
                                  : undefined
                              }
                              valueUSD={convertNumberToStringWithCommas(
                                tokenBalanceInUSD?.toNumber() ?? 0.0,
                              )}
                              source={source}
                            />
                          </Box>
                        )
                      },
                    )}
                </Box>
              )}

              {displayImbalanceComposablePoolWithSignificantUserHoldingBanner && (
                <Box pt={2}>
                  <WarningBanner
                    title={messages.IMBALANCE_POOL_WITHDRAW_TITLE}
                    description={messages.IMBALANCE_POOL_WITHDRAW_DESCRIPTION}
                  />
                </Box>
              )}

              <Box pt={3}>
                <SlippageSelector
                  slippage={slippage?.toBigNumber()}
                  onSlippageChange={onSlippageChange}
                />
              </Box>
            </Box>

            {showWrappedCheckbox && (
              <Box
                width="100%"
                pt={2}
                display="flex"
                alignItems="center"
                justifyContent="end"
              >
                <Checkbox
                  checked={showWrappedTokens}
                  onChange={onWrappedTokensChange}
                  color="secondary"
                  disabled={isCalculatingPreview}
                />
                <Typography variant="paragraphTiny">
                  {messages.WRAPPED_TOKENS}
                </Typography>
              </Box>
            )}

            <Divider />

            <Box display="flex" justifyContent="end">
              <Box
                mr={2}
                display="flex"
                justifyContent="space-between"
                alignItems="flex-end"
                flexDirection="column"
                width="100%"
              >
                <Box display="flex">
                  <Typography textAlign="right" variant="h5">
                    Total $
                  </Typography>
                  {!isCalculatingPreview && (
                    <Typography textAlign="right" variant="h5">
                      {convertNumberToStringWithCommas(
                        withdrawTotalValueUSD.toNumber(),
                      )}
                    </Typography>
                  )}

                  {isCalculatingPreview && (
                    <Skeleton sx={{ ml: 0.5 }} width={100} />
                  )}
                </Box>

                {poolModel?.pool.poolType !== PoolType.ComposableStable && (
                  <Box display="flex" alignItems="center">
                    <InfoIcon
                      style={{
                        color: '#FFC834',
                        width: '16px',
                        height: '16px',
                        marginRight: '8px',
                      }}
                    />
                    <Typography textAlign="right" variant="paragraphTiny">
                      {`Price impact: ${priceImpact}`}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Button
                variant="contained"
                size="large"
                text="Preview"
                onClick={handleWithdrawPreviewRequest}
                disabled={
                  buttonDisabled ||
                  Boolean(actionInProgress) ||
                  !userPoolShare ||
                  userPoolShare.toBigNumber().eq(BigNumber.from(0))
                }
                isFetching={
                  loading || actionInProgress === ActionInProgress.Withdraw
                }
              />
            </Box>
          </Paper>
        </Box>
      </Box>
      <Modal open={openModal} handleClose={handleClose}>
        <ModalHeader title={messages.TITLE} />
        <WithdrawPreviewContainer onClose={handleClose} />
      </Modal>
    </Box>
  )
}

export default WithdrawContainer
