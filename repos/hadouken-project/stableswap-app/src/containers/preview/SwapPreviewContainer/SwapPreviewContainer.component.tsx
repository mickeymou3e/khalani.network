import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { setPoolIdToSlug } from '@containers/pools/utils'
import {
  Button,
  ButtonLayout,
  convertNumberToStringWithCommas,
  getTokenIconWithChainComponent,
  SummaryLabel,
  SwapRight,
  TradeRoute,
  ValueLabel,
} from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { StoreDispatch } from '@store/store.types'
import { swapSelectors } from '@store/swap/swap.selector'
import { swapActions } from '@store/swap/swap.slice'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { BigDecimal } from '@utils/math'
import { formatNetworkName } from '@utils/network'

import { Page, PAGES_PATH } from '../../../App'

const TokenPreview: React.FC<{
  symbol: string
  source?: string
  name: string
  value: string
  valueUSD: string
}> = ({ symbol, name, source, value, valueUSD }) => {
  const Icon = getTokenIconWithChainComponent(symbol, source ?? '')
  return (
    <Box
      width="100%"
      p={2}
      display="flex"
      bgcolor={(theme) => theme.palette.background.default}
    >
      <Icon height={40} width={40} />
      <Box ml={2}>
        <Typography variant="paragraphSmall">
          {value} {name}
        </Typography>
        <Typography
          variant="paragraphTiny"
          color={(theme) => theme.palette.text.gray}
        >
          ${valueUSD}
        </Typography>
      </Box>
    </Box>
  )
}

const SwapPreviewContainer: React.FC = () => {
  const history = useHistory()
  const dispatch = useDispatch<StoreDispatch>()

  const selectTokenById = useSelector(tokenSelectors.selectById)
  const swap = useSelector(swapSelectors.swap)
  const isSingleSwapThroughLinear = useSelector(
    swapSelectors.isSingleSwapThroughLinear,
  )

  const selectPriceById = useSelector(pricesSelector.selectById)
  const applicationNetworkName = useSelector(
    networkSelectors.applicationNetworkName,
  )

  const quotePrice = useSelector(swapSelectors.quotePrice)

  const isSwapInProgress = useSelector(swapSelectors.isSwapInProgress)

  const slippage = swap.slippage

  const baseTokenPrice = swap?.inToken
    ? selectPriceById(swap?.inToken)
    : undefined

  const quoteTokenPrice = swap?.outToken
    ? selectPriceById(swap?.outToken)
    : undefined

  const baseToken = swap?.inToken ? selectTokenById(swap?.inToken) : undefined

  const baseTokenAmount =
    swap?.inTokenAmount && baseToken
      ? BigDecimal.from(swap?.inTokenAmount.toBigNumber(), baseToken.decimals)
      : BigDecimal.from(0)

  const baseTokenAmountValueUSD =
    baseTokenPrice?.price && baseTokenAmount?.mul(baseTokenPrice.price)

  const quoteToken = swap?.outToken
    ? selectTokenById(swap?.outToken)
    : undefined

  const quoteTokenAmount =
    swap?.outTokenAmount && quoteToken
      ? BigDecimal.from(swap?.outTokenAmount.toBigNumber(), quoteToken.decimals)
      : BigDecimal.from(0)

  const quoteTokenAmountWithSlippage =
    swap?.outTokenAmountWithSlippage && quoteToken
      ? BigDecimal.from(
          swap?.outTokenAmountWithSlippage.toBigNumber(),
          quoteToken.decimals,
        )
      : BigDecimal.from(0)

  const quoteTokenAmountValueUSD =
    quoteTokenPrice?.price && quoteTokenAmount?.mul(quoteTokenPrice.price)

  const swappedTokenPriceText = useMemo(() => {
    const priceImpactString =
      swap.priceImpact < 0.01 ? '< 0.01' : swap.priceImpact.toFixed(2)

    return `${convertNumberToStringWithCommas(
      quoteTokenAmountValueUSD?.toNumber() ?? 0,
    )} / Price impact: ${priceImpactString}%`
  }, [quoteTokenAmountValueUSD, swap.priceImpact])

  const onGoBack = () => {
    history.goBack()
  }
  const onSwapHandler = () => {
    dispatch(swapActions.swapRequest())
  }

  const handleClick = (poolId: string) => {
    if (!isSingleSwapThroughLinear)
      window.open(
        setPoolIdToSlug(
          `/${formatNetworkName(applicationNetworkName)}` +
            PAGES_PATH[Page.Pool],
          poolId,
        ),
      )
  }

  const poolsWithSortedTokens = useSelector(
    poolsModelsSelector.selectPoolsWithSortedTokens,
  )
  return (
    <Box>
      <Box pl={3} pb={2}>
        <Typography variant="h1">Preview trade</Typography>
      </Box>
      <Paper
        elevation={3}
        sx={{
          paddingX: { xs: 2, md: 3 },
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h4Bold">Effective price</Typography>
          <Typography variant="paragraphSmall" color="textSecondary">
            1 {baseToken?.displayName} = {quotePrice} {quoteToken?.displayName}
          </Typography>
        </Box>

        <Box pt={3} display="flex" alignItems="center" width="100%">
          <TokenPreview
            symbol={baseToken?.symbol ?? ''}
            name={baseToken?.displayName ?? ''}
            source={baseToken?.source ?? ''}
            value={convertNumberToStringWithCommas(
              swap.inTokenAmount.toNumber(),
              4,
              true,
            )}
            valueUSD={convertNumberToStringWithCommas(
              baseTokenAmountValueUSD?.toNumber() ?? 0,
            )}
          />

          <Box mx={2}>
            <SwapRight />
          </Box>

          <TokenPreview
            symbol={quoteToken?.symbol ?? ''}
            name={quoteToken?.displayName ?? ''}
            source={quoteToken?.source ?? ''}
            value={convertNumberToStringWithCommas(
              swap.outTokenAmount.toNumber(),
              4,
              true,
            )}
            valueUSD={swappedTokenPriceText}
          />
        </Box>
        <Box pt={3}>
          <Typography variant="h4Bold">
            Trade from {baseToken?.displayName} details
          </Typography>
        </Box>

        <Box
          pt={3}
          pb={3}
          display="flex"
          alignContent="center"
          justifyContent="center"
          flexDirection="column"
        >
          <SummaryLabel
            label="Total expected after fees"
            value={
              <Box maxWidth={{ xs: 60, sm: 85, md: 155, xl: 200 }}>
                <ValueLabel
                  value={convertNumberToStringWithCommas(
                    quoteTokenAmount.toNumber(),
                    4,
                    true,
                  )}
                  label={quoteToken?.displayName}
                />
              </Box>
            }
          />

          <SummaryLabel
            label={`The least you’ll get at ${slippage.toString()}% slippage`}
            value={
              <Box maxWidth={{ xs: 60, sm: 85, md: 155, xl: 200 }}>
                <ValueLabel
                  value={convertNumberToStringWithCommas(
                    quoteTokenAmountWithSlippage.toNumber(),
                    4,
                    true,
                  )}
                  label={quoteToken?.displayName}
                />
              </Box>
            }
          />
        </Box>

        <Box pt={3} pb={6}>
          {baseToken && quoteToken && (
            <TradeRoute
              inToken={{
                ...baseToken,
                balance: convertNumberToStringWithCommas(
                  baseTokenAmountValueUSD?.toNumber() ?? 0,
                ),
                displayName: baseToken.displayName ?? baseToken.name,
                source: baseToken.source ?? '',
              }}
              outToken={{
                ...quoteToken,
                balance: convertNumberToStringWithCommas(
                  quoteTokenAmountValueUSD?.toNumber() ?? 0,
                ),
                displayName: quoteToken.displayName ?? quoteToken.name,
                source: quoteToken.source ?? '',
              }}
              inTokenValue={convertNumberToStringWithCommas(
                swap.inTokenAmount.toNumber(),
                4,
                true,
              )}
              outTokenValue={convertNumberToStringWithCommas(
                swap.outTokenAmount.toNumber(),
                4,
                true,
              )}
              onRouteNodeClick={handleClick}
              routes={swap.swapNodes}
              poolsWithSortedTokens={poolsWithSortedTokens}
            />
          )}
        </Box>

        <ButtonLayout>
          <Button
            onClick={onGoBack}
            size="large"
            variant="outlined"
            text="Cancel"
          />
          <Button
            size="large"
            variant="contained"
            text="Confirm trade"
            onClick={onSwapHandler}
            isFetching={isSwapInProgress}
          />
        </ButtonLayout>
      </Paper>
    </Box>
  )
}

export default SwapPreviewContainer
