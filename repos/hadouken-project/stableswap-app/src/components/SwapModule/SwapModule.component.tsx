import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { BigNumber } from 'ethers'

import SlippageSelector from '@components/SlippageSelector'
import ActionInProgressBanner from '@components/banners/ActionInProgressBanner/ActionInProgressBanner.component'
import {
  Button,
  SwapIcon,
  TokenModelBalance,
  TokenSelectorInput,
  WarningBanner,
} from '@hadouken-project/ui'
import { ActionInProgress } from '@interfaces/action'
import {
  Box,
  Divider,
  Paper,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { networkSelectors } from '@store/network/network.selector'
import { swapSelectors } from '@store/swap/swap.selector'
import { swapActions } from '@store/swap/swap.slice'
import { BigDecimal, SLIPPAGE_DECIMALS } from '@utils/math'

import { Page, PAGES_PATH } from '../../App'
import { formatNetworkName } from '../../utils/network'
import { useSwapTokens } from './SwapModule.hooks'
import { messages } from './SwapModule.messages'
import { ISwapModuleProps } from './SwapModule.types'

const SwapModule: React.FC<ISwapModuleProps> = ({
  tokens,
  isFetchingBalances,
}) => {
  const theme = useTheme()
  const history = useHistory()
  const dispatch = useDispatch()

  const {
    baseToken,
    quoteToken,
    sortedTokens,
    quoteTokenOptions,
  } = useSwapTokens(tokens)

  const actionInProgress = useSelector(contractsSelectors.actionInProgress)

  const baseTokenValue = useSelector(swapSelectors.baseTokenValue)

  const slippage = useSelector(swapSelectors.slippage)

  const quotePrice = useSelector(swapSelectors.quotePrice)

  const swapDisabled = useSelector(swapSelectors.swapDisabled)

  const disabledSwapIcon = useSelector(swapSelectors.disabledSwapIcon)

  const swapLoading = useSelector(swapSelectors.swapLoading)

  const swap = useSelector(swapSelectors.swap)

  const applicationNetworkName = useSelector(
    networkSelectors.applicationNetworkName,
  )

  const onBaseTokenAmountChange = (value: BigNumber | undefined): void => {
    if (baseToken && quoteToken) {
      dispatch(
        swapActions.onInputChange(
          value ? BigDecimal.from(value, baseToken.decimals) : undefined,
        ),
      )
    }
  }

  const onBaseTokenChange = (token: TokenModelBalance) => {
    if (baseToken && quoteToken && token.address === quoteToken.address) {
      dispatch(swapActions.reverseSwapTokens())
    } else {
      dispatch(swapActions.setBaseToken(token.address))
    }
  }

  const onQuoteTokenChange = (token: TokenModelBalance) => {
    dispatch(swapActions.setQuoteToken(token.address))
  }

  const swapBaseAndQuoteTokens = (): void => {
    if (quoteToken && baseToken && !swapLoading) {
      dispatch(swapActions.reverseSwapTokens())
    }
  }

  const onSlippageChangeHandler = useCallback(
    (value: BigNumber) => {
      if (slippage.toBigNumber().eq(value)) return

      const slippageBigDecimal = BigDecimal.from(value, SLIPPAGE_DECIMALS)

      dispatch(swapActions.setSlippage(slippageBigDecimal))
    },
    [dispatch, slippage],
  )

  const onPreviewRequest = () => {
    if (applicationNetworkName) {
      history.push(
        `/${formatNetworkName(applicationNetworkName)}` +
          PAGES_PATH[Page.SwapPreview],
      )
    }
  }

  return (
    <Box width={{ xs: '100%', md: 'inherit' }} maxWidth={616}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Box>
          <ActionInProgressBanner
            actionInProgress={actionInProgress}
            currentAction={ActionInProgress.Swap}
          />
        </Box>
        <Typography variant="h4Bold">{messages.TRADE_LABEL}</Typography>

        <Box pt={3} display="flex" flexDirection="column">
          <Box>
            <TokenSelectorInput
              tokens={sortedTokens}
              amount={baseTokenValue?.toBigNumber()}
              selectedToken={baseToken}
              onAmountChange={onBaseTokenAmountChange}
              onTokenChange={onBaseTokenChange}
              isFetching={isFetchingBalances && !baseToken}
            />
          </Box>

          <Box display="flex">
            <Box
              width="100%"
              display="flex"
              ml={2}
              justifyContent="space-between"
            >
              <Button
                variant="text"
                onClick={swapBaseAndQuoteTokens}
                sx={{
                  ...theme.typography.breadCrumbs,
                  color: (theme) => theme.palette.common.white,
                  '&:disabled': {
                    color: theme.palette.grey[800],
                  },
                }}
                disabled={disabledSwapIcon}
                startIcon={
                  <SwapIcon
                    fill={
                      !disabledSwapIcon
                        ? theme.palette.common.white
                        : theme.palette.grey[800]
                    }
                    style={{
                      transform: 'rotate(90deg)',
                    }}
                  />
                }
                text={messages.BUTTON_NAME}
              />

              <Box display="flex" justifyContent="flex-end" width="100%">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Typography
                    variant="paragraphTiny"
                    display="flex"
                    alignItems="center"
                    color={(theme) => theme.palette.text.secondary}
                  >
                    {quotePrice &&
                      !swapLoading &&
                      messages.EXCHANGE_RATE(
                        baseToken?.displayName ?? '',
                        quoteToken?.displayName ?? '',
                        quotePrice,
                      )}
                    {swapLoading && (
                      <>
                        1 {baseToken?.displayName} =
                        <Skeleton
                          width={40}
                          height={20}
                          sx={{ marginInline: 1 }}
                        />
                        {quoteToken?.displayName}
                      </>
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box>
            <TokenSelectorInput
              disabled
              tokens={quoteTokenOptions}
              amount={swap?.outTokenAmount?.toBigNumber()}
              selectedToken={quoteToken}
              onTokenChange={onQuoteTokenChange}
              isFetching={(!quoteToken && isFetchingBalances) || swapLoading}
            />
          </Box>
        </Box>

        {swap.isUnderPerformance &&
          baseTokenValue &&
          baseTokenValue.gt(BigDecimal.from(0)) && (
            <Box pt={3}>
              <WarningBanner
                title={messages.HIGH_PRICE_IMPACT_TITLE}
                description={messages.HIGH_PRICE_IMPACT_DESCRIPTION}
              />
            </Box>
          )}

        {swap.isInsufficientLiquidity &&
          baseTokenValue &&
          baseTokenValue.gt(BigDecimal.from(0)) && (
            <Box pt={3}>
              <WarningBanner
                title={messages.INSUFFICIENT_LIQUIDITY_TITLE}
                description={messages.INSUFFICIENT_LIQUIDITY_DESCRIPTION}
              />
            </Box>
          )}

        <Box pt={3}>
          <SlippageSelector
            slippage={slippage?.toBigNumber()}
            onSlippageChange={onSlippageChangeHandler}
          />
        </Box>
        <Divider />
        <Box display="flex" justifyContent="end">
          <Button
            disabled={swapDisabled || Boolean(actionInProgress)}
            isFetching={actionInProgress === ActionInProgress.Swap}
            onClick={onPreviewRequest}
            size="large"
            variant="contained"
            text="Preview"
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default SwapModule
