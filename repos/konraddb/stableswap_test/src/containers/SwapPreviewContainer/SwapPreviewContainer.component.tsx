import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { BigNumber } from 'ethers'

import { useQuotePrice } from '@components/SwapModule/SwapModule.hooks'
import { Page } from '@constants/Page'
import { setPoolIdToSlug } from '@containers/pools/utils'
import {
  Button,
  ButtonLayout,
  getTokenIconComponent,
  SummaryLabel,
  SwapRight,
  TradeRoute,
  ValueLabel,
} from '@hadouken-project/ui'
import { IRouteNode } from '@interfaces/data'
import { Box, Paper, Typography } from '@mui/material'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { StoreDispatch } from '@store/store.types'
import { swapSelectors } from '@store/swap/swap.selector'
import { swapActions } from '@store/swap/swap.slice'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { BigDecimal } from '@utils/math'

import { PAGES_PATH } from '../../App'

const TokenPreview: React.FC<{
  symbol: string
  value: string
  valueUSD: string
}> = ({ symbol, value, valueUSD }) => {
  const Icon = getTokenIconComponent(symbol)
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
          {value} {symbol.toUpperCase()}
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

  const selectPoolModel = useSelector(poolsModelsSelector.selectById)
  const selectPriceById = useSelector(pricesSelector.selectById)

  const slippage = BigDecimal.from(swap.slippage, 2)
  const slippagePercent = slippage.mul(BigDecimal.from(100, 0))

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

  const quoteTokenAmountValueUSD =
    quoteTokenPrice?.price && quoteTokenAmount?.mul(quoteTokenPrice.price)

  const quoteTokenAmountWithSlippage = quoteTokenAmount.sub(
    quoteTokenAmount.mul(slippage),
  )

  const { quotePrice } = useQuotePrice({
    baseTokenDecimals: baseToken?.decimals ?? 0,
    baseTokenValue: swap.inTokenAmount.toBigNumber() ?? BigNumber.from(0),
    quoteTokenDecimals: quoteToken?.decimals ?? 0,
    quoteTokenValue: swap.outTokenAmount.toBigNumber() ?? BigNumber.from(0),
    precision: 3,
  })

  const onGoBack = () => {
    history.goBack()
  }
  const onSwapHandler = () => {
    dispatch(swapActions.swapRequest())
  }

  const handleClick = (poolId: string) => {
    history.push(setPoolIdToSlug(PAGES_PATH[Page.Pool], poolId))
  }

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
            1 {baseToken?.symbol} = {quotePrice} {quoteToken?.symbol}
          </Typography>
        </Box>

        <Box pt={3} display="flex" alignItems="center" width="100%">
          <TokenPreview
            symbol={baseToken?.symbol ?? ''}
            value={swap.inTokenAmount.toString()}
            valueUSD={baseTokenAmountValueUSD?.toFixed(2) ?? '0.00'}
          />

          <Box mx={2}>
            <SwapRight />
          </Box>

          <TokenPreview
            symbol={quoteToken?.symbol ?? ''}
            value={swap.outTokenAmount.toString()}
            valueUSD={quoteTokenAmountValueUSD?.toFixed(2) ?? '0.00'}
          />
        </Box>
        <Box pt={3}>
          <Typography variant="h4Bold">
            Trade from {baseToken?.symbol} details
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
            showTopBorder
            label="Trade fees"
            value={
              <Box maxWidth={{ xs: 60, sm: 85, md: 155, xl: 200 }}>
                <ValueLabel
                  value={swap.fee.toString()}
                  label={baseToken?.symbol}
                />
              </Box>
            }
          />

          <SummaryLabel
            label="Total expected after fees"
            value={
              <Box maxWidth={{ xs: 60, sm: 85, md: 155, xl: 200 }}>
                <ValueLabel
                  value={quoteTokenAmount.toString()}
                  label={quoteToken?.symbol}
                />
              </Box>
            }
          />

          <SummaryLabel
            label={`The least you’ll get at ${slippagePercent.toFixed(
              2,
            )}% slippage`}
            value={
              <Box maxWidth={{ xs: 60, sm: 85, md: 155, xl: 200 }}>
                <ValueLabel
                  value={quoteTokenAmountWithSlippage.toString()}
                  label={quoteToken?.symbol}
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
                balance: baseTokenAmountValueUSD?.toFixed(2) ?? '0.00',
              }}
              outToken={{
                ...quoteToken,
                balance: quoteTokenAmountValueUSD?.toFixed(2) ?? '0.00',
              }}
              inTokenValue={swap.inTokenAmount.toString()}
              outTokenValue={swap.outTokenAmount.toString()}
              onRouteNodeClick={handleClick}
              route={swap.sorSwaps.reduce((tradeRoute, swap) => {
                const poolModel = selectPoolModel(swap.poolId)
                return poolModel
                  ? {
                      ...tradeRoute,
                      [poolModel.id]: {
                        id: poolModel?.pool.id,
                        name: poolModel?.pool.name,
                        tokens: poolModel?.tokens
                          .filter((token) => token)
                          .map(({ symbol, id }) => ({
                            id,
                            symbol,
                          })),
                      },
                    }
                  : tradeRoute
              }, {} as { [id: string]: IRouteNode })}
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
          />
        </ButtonLayout>
      </Paper>
    </Box>
  )
}

export default SwapPreviewContainer
