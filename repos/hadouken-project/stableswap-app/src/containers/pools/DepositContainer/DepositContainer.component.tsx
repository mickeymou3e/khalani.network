import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import SlippageSelector from '@components/SlippageSelector'
import ActionInProgressBanner from '@components/banners/ActionInProgressBanner/ActionInProgressBanner.component'
import DepositPreviewContainer from '@containers/preview/DepositPreview'
import {
  Button,
  Modal,
  ModalHeader,
  TokenInput,
  WarningBanner,
} from '@hadouken-project/ui'
import { ActionInProgress } from '@interfaces/action'
import { PoolType } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import InfoIcon from '@mui/icons-material/Info'
import {
  Box,
  Checkbox,
  Divider,
  Paper,
  Typography,
  useTheme,
} from '@mui/material'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { depositSelectors } from '@store/deposit/deposit.selector'
import { depositActions } from '@store/deposit/deposit.slice'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { StoreDispatch } from '@store/store.types'
import { BigDecimal } from '@utils/math'
import { sortAssetsByBusinessOrder } from '@utils/token'

import { messages } from './DepositContainer.messages'
import { IDepositContainer } from './DepositContainer.types'

const DepositContainer: React.FC<IDepositContainer> = ({ poolId }) => {
  const dispatch = useDispatch<StoreDispatch>()
  const theme = useTheme()

  const actionInProgress = useSelector(contractsSelectors.actionInProgress)

  useEffect(() => {
    if (poolId) {
      dispatch(depositActions.initializeDepositRequest(poolId))
    }

    return () => {
      dispatch(depositActions.resetDepositState())
    }
  }, [dispatch, poolId])

  const depositEditorState = useSelector(depositSelectors.depositEditor)

  const depositTokens = useSelector(depositSelectors.depositTokens)

  const selectUserTokensBalances = useSelector(
    userBalancesSelectors.selectUserTokensBalances,
  )
  const selectPoolModelById = useSelector(poolsModelsSelector.selectById)
  const poolModel = selectPoolModelById(poolId)

  const {
    isLoadingPreview,
    stakeToBackstop,
    showDepositPreviewModal,
    showWrappedTokens,
    slippage,
    showLowLiquidityBanner,
    buttonDisabled,
    priceImpact,
    showWrappedCheckbox,
    proportionalCalculationForToken,
  } = depositEditorState

  const sortedDepositTokens = useMemo(() => {
    return depositTokens.sort((tokenA, tokenB) =>
      sortAssetsByBusinessOrder(tokenA.symbol, tokenB.symbol),
    )
  }, [depositTokens])

  const tokenBalances = selectUserTokensBalances(
    sortedDepositTokens.map((token) => {
      if (token.isLendingToken) {
        return token.unwrappedAddress ?? ''
      }
      return token.address
    }),
  )

  const isFetching =
    depositEditorState.isFetchingTokens || tokenBalances === null

  const onSlippageChange = useCallback(
    (value: BigNumber) => {
      dispatch(depositActions.onSlippageChange(BigDecimal.from(value, 4)))
    },
    [dispatch],
  )

  const onWrappedTokensChange = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      dispatch(depositActions.wrappedTokenChangeRequest(checked))
    },
    [dispatch],
  )

  const onStakeToBackstopChange = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      dispatch(depositActions.stakeToBackstopChange(checked))
    },
    [dispatch],
  )

  const setDepositTokenAmount = useCallback(
    (amount: BigNumber | undefined, tokenAddress: IToken['address']) => {
      dispatch(
        depositActions.amountChangeRequest({
          amount: amount,
          tokenAddress: tokenAddress,
        }),
      )
    },
    [dispatch],
  )

  const getDepositTokenAmount = useCallback(
    (tokenAddress: IToken['address']) => {
      return sortedDepositTokens.find(
        (deposit) => deposit.address === tokenAddress,
      )
    },
    [sortedDepositTokens],
  )

  const onInputFocus = (tokenAddress: string) => {
    dispatch(depositActions.tokenInputFocus(tokenAddress))
  }

  const onDepositPreviewRequest = () => {
    dispatch(depositActions.depositPreviewRequest())
  }

  const onProportionalSuggestionRequest = (tokenAddress: string) => {
    dispatch(depositActions.proportionalSuggestionRequest(tokenAddress))
  }

  const handleModalClose = () => {
    dispatch(depositActions.depositPreviewModalChange(false))
  }

  const tokensNameWithZeroBalance: string[] = []

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
                currentAction={ActionInProgress.Deposit}
              />
            </Box>

            <Box pt={3}>
              {isFetching && (
                <Box>
                  <Box pb={3}>
                    <TokenInput isFetchingMaxAmount={true} />
                  </Box>
                  <Box pb={3}>
                    <TokenInput isFetchingMaxAmount={true} />
                  </Box>
                </Box>
              )}

              {!isFetching &&
                sortedDepositTokens
                  .filter((token) => {
                    const userTokenBalance = token.isLendingToken
                      ? tokenBalances?.[token.unwrappedAddress ?? '']
                      : tokenBalances?.[token.address]

                    if (
                      userTokenBalance &&
                      userTokenBalance.gt(BigDecimal.from(0, token.decimals))
                    ) {
                      return true
                    }

                    tokensNameWithZeroBalance.push(token.displayName)

                    return false
                  })
                  .map(
                    ({
                      id,
                      address: tokenAddress,
                      name,
                      symbol,
                      decimals,
                      displayName,
                      source,
                      isLendingToken,
                      unwrappedAddress,
                    }) => {
                      const userTokenBalance = isLendingToken
                        ? tokenBalances?.[unwrappedAddress ?? '']
                        : tokenBalances?.[tokenAddress]

                      const showProportional =
                        proportionalCalculationForToken === tokenAddress

                      return (
                        <Box
                          onFocus={() => onInputFocus(tokenAddress)}
                          pb={showProportional ? 0 : 4}
                          key={id}
                        >
                          <TokenInput
                            maxAmount={
                              userTokenBalance
                                ? userTokenBalance.toBigNumber()
                                : BigNumber.from(0)
                            }
                            onMaxRequest={(address) =>
                              setDepositTokenAmount(
                                userTokenBalance
                                  ? userTokenBalance.toBigNumber()
                                  : BigNumber.from(0),
                                address,
                              )
                            }
                            amount={
                              getDepositTokenAmount(tokenAddress)?.amount ??
                              undefined
                            }
                            onAmountChange={(amount) =>
                              setDepositTokenAmount(amount, tokenAddress)
                            }
                            token={{
                              address: tokenAddress,
                              decimals,
                              name,
                              symbol,
                              id,
                              displayName: displayName ?? name,
                              source: source ?? '',
                            }}
                          />
                          {showProportional && (
                            <Box
                              display="flex"
                              height={32}
                              pr={2}
                              width="100%"
                              alignItems="center"
                              textAlign="end"
                            >
                              <Typography
                                onClick={() =>
                                  onProportionalSuggestionRequest(tokenAddress)
                                }
                                color="text.quaternary"
                                variant="paragraphTiny"
                                sx={{
                                  cursor: 'pointer',
                                  ml: 'auto',
                                  '&:hover': {
                                    color: (theme) =>
                                      theme.palette.tertiary.light,
                                  },
                                }}
                              >
                                {messages.PROPORTIONAL_LABEL}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )
                    },
                  )}

              {tokensNameWithZeroBalance.length ===
              sortedDepositTokens.length ? (
                <Typography variant="paragraphSmall" align="center" pb={2}>
                  {messages.NO_WALLET_BALANCE}
                </Typography>
              ) : (
                <>
                  {tokensNameWithZeroBalance.length > 0 && (
                    <Typography
                      variant="paragraphSmall"
                      mb={2}
                      align="center"
                      sx={{ wordBreak: 'break-word' }}
                    >
                      {messages.NO_TOKEN_BALANCE}
                      {tokensNameWithZeroBalance.join(', ')}
                    </Typography>
                  )}
                </>
              )}

              {showLowLiquidityBanner && (
                <Box>
                  <WarningBanner
                    title={messages.LOW_LIQUIDITY_WARNING_TITLE}
                    description={messages.LOW_LIQUIDITY_WARNING_DESCRIPTION}
                  />
                </Box>
              )}
              <Box pt={3}>
                <SlippageSelector
                  slippage={slippage.toBigNumber()}
                  onSlippageChange={onSlippageChange}
                />
              </Box>

              <Box display="flex" justifyContent="end" gap={1}>
                {poolModel?.pool.poolType === PoolType.WeightedBoosted && (
                  <Box
                    pt={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="end"
                  >
                    <Checkbox
                      checked={stakeToBackstop}
                      onChange={onStakeToBackstopChange}
                      color="secondary"
                    />
                    <Typography variant="paragraphTiny">
                      {messages.STAKE_TO_BACKSTOP}
                    </Typography>
                  </Box>
                )}

                {showWrappedCheckbox && (
                  <Box
                    pt={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="end"
                  >
                    <Checkbox
                      checked={showWrappedTokens}
                      onChange={onWrappedTokensChange}
                      color="secondary"
                    />
                    <Typography variant="paragraphTiny">
                      {messages.WRAPPED_TOKENS}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Divider />
              <Box display="flex" justifyContent="end" alignItems="center">
                <Box
                  mr={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-end"
                  flexDirection="column"
                  width="100%"
                >
                  <Typography textAlign="right" variant="h5">
                    {`${
                      messages.TOTAL_DEPOSIT
                    } ${depositEditorState.totalDepositValueUSD.toFixed(2)}$`}
                  </Typography>
                  {poolModel?.pool.poolType === PoolType.Weighted && (
                    <Box display="flex" alignItems="center">
                      <InfoIcon
                        style={{
                          color: theme.palette.tertiary.main,
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
                  isFetching={
                    isLoadingPreview ||
                    actionInProgress === ActionInProgress.Deposit
                  }
                  disabled={buttonDisabled || Boolean(actionInProgress)}
                  text={messages.DEPOSIT_PREVIEW_BUTTON_LABEL}
                  onClick={onDepositPreviewRequest}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
      <Modal open={showDepositPreviewModal} handleClose={handleModalClose}>
        <ModalHeader title={messages.INVESTMENT_PREVIEW_LABEL} />
        <DepositPreviewContainer onClose={handleModalClose} />
      </Modal>
    </Box>
  )
}

export default DepositContainer
