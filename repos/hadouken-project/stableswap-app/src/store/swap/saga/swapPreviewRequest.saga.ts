import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { apply, call, put, select } from 'typed-redux-saga'

import { QUOTE_PRICE_PRECISION } from '@components/SwapModule/SwapModule.constants'
import { messages } from '@components/SwapModule/SwapModule.messages'
import { isCustomLinearPool } from '@containers/pools/utils'
import {
  bigNumberToString,
  getTokenIconComponent,
  IRouteNode,
  ITradeRouteProps,
  truncateToSpecificDecimals,
} from '@hadouken-project/ui'
import { PoolType } from '@interfaces/pool'
import { IToken } from '@interfaces/token'
import { setContractError } from '@store/contracts/setError.saga'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { swapActions } from '@store/swap/swap.slice'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import {
  BigDecimal,
  calculatePriceImpactSwap,
  removeSlippageFromValue,
} from '@utils/math'

import { SwapToken, SwapTokenType, SwapV2 } from '../../../services/trade/types'
import { contractsSelectors } from '../../contracts/contracts.selectors'
import { lendingSelectors } from '../../lending/lending.selector'
import { PRICE_IMPACT_THRESHOLD } from '../swap.constants'
import { swapSelectors } from '../swap.selector'
import { ISwap, ISwapRequest } from '../swap.types'

type SwapRoute = SwapV2 & { poolType?: PoolType }

type SwapPath = {
  id: number
  amount: BigDecimal
  routes: SwapRoute[]
}

// Take all the routes from SOR and split it to paths
function* getSwapPaths(
  allRoutes: SwapV2[],
  tokens: string[],
  inTokenAddress: string,
): Generator<StrictEffect, SwapPath[]> {
  const selectTokenById = yield* select(tokenSelectors.selectById)
  const poolModels = yield* select(poolsModelsSelector.selectAll)
  const inToken = selectTokenById(inTokenAddress)

  let routes: SwapPath[] = []

  let pathIndex = 0

  for (const route of allRoutes) {
    const poolModel = poolModels.find((pool) => pool.id === route.poolId)
    const pool = poolModel?.pool

    if (tokens[route.assetInIndex] === inTokenAddress) {
      routes.push({
        id: pathIndex,
        amount: BigDecimal.from(route.amount, inToken?.decimals),
        routes: [
          {
            ...route,
            poolType: pool?.poolType,
          },
        ],
      })
      pathIndex++
    } else {
      let isRouteFound = false

      routes = routes.map((currentRoute) => {
        const isGoodRoute =
          currentRoute.routes[currentRoute.routes.length - 1].assetOutIndex ===
          route.assetInIndex

        if (isGoodRoute && !isRouteFound) {
          isRouteFound = true
          return {
            id: currentRoute.id,
            amount: currentRoute.amount.add(
              BigDecimal.from(route.amount, inToken?.decimals),
            ),

            routes: [
              ...currentRoute.routes,
              { ...route, poolType: pool?.poolType },
            ],
          }
        } else {
          return currentRoute
        }
      })
    }
  }

  return routes
}

// Generate the swap nodes for tradeRoute component
function* getSwapNodes(
  paths: SwapPath[],
  baseTokenAmount: BigDecimal,
): Generator<StrictEffect, ITradeRouteProps['routes']> {
  const selectPoolModel = yield* select(poolsModelsSelector.selectById)
  const applicationChainId = yield* select(networkSelectors.applicationChainId)

  return paths.map((path) => {
    const isOnlyLinear = path.routes.every(
      (route) => route.poolType === PoolType.AaveLinear,
    )

    const routesThroughCustomLinear = path.routes.reduce<boolean[]>(
      (total, route) => {
        const pool = selectPoolModel(route.poolId)

        if (pool) {
          total.push(isCustomLinearPool(applicationChainId, pool.address))
        }

        return total
      },
      [],
    )

    const isRouteOnlyThroughCustomLinear =
      routesThroughCustomLinear.length === path.routes.length &&
      routesThroughCustomLinear.every(
        (routeThroughCustomLinear) => routeThroughCustomLinear === true,
      )

    const pools: IRouteNode[] = path.routes.reduce((data, currentRoute) => {
      const poolModel = selectPoolModel(currentRoute.poolId)

      if (
        (isCustomLinearPool(
          applicationChainId,
          poolModel?.pool.address ?? '',
        ) &&
          !isRouteOnlyThroughCustomLinear) ||
        (poolModel?.pool.poolType === PoolType.AaveLinear && !isOnlyLinear) // remove after deploy new boosted pools
      ) {
        return data
      } else if (poolModel?.pool.poolType === PoolType.ComposableStable) {
        const specialTokens: IToken[] = []

        if (poolModel) {
          for (const token of poolModel?.tokens) {
            const isTokenLpToken = selectPoolModel(token.id)
            if (isTokenLpToken) {
              specialTokens.push(token)
            }
          }
        }

        data.push({
          id: currentRoute.poolId,
          name: poolModel?.pool.name ?? '',
          tokens:
            poolModel?.tokens.map((poolToken) => {
              if (
                specialTokens.find(
                  (specialToken) => specialToken.address === poolToken.address,
                )
              ) {
                return {
                  id: poolToken.id,
                  symbol: poolToken.symbol,
                  icon: getTokenIconComponent(poolToken.symbol),
                }
              }
              return {
                id: poolToken.id,
                symbol: poolToken.symbol,
              }
            }) ?? [],
        })
      } else {
        data.push({
          id: currentRoute.poolId,
          name: poolModel?.pool.name ?? '',
          tokens:
            poolModel?.tokens.map((poolToken) => ({
              id: poolToken.id,
              symbol: poolToken.symbol,
            })) ?? [],
        })
      }
      return data
    }, [] as IRouteNode[])

    return {
      pools: pools,
      percentage: truncateToSpecificDecimals(
        String(
          (Number(
            path.amount.mul(BigDecimal.from(100, 0)).div(baseTokenAmount),
          ) *
            100) /
            100,
        ),
        2,
      ),
    }
  })
}

export function* swapPreviewRequestSaga(
  swapPreviewRequest: ISwapRequest,
): Generator<StrictEffect, ISwap> {
  const reserveSelector = yield* select(
    lendingSelectors.selectReserveByWrappedId,
  )
  const lendingOutToken = reserveSelector(swapPreviewRequest.outToken)
  const lendingInToken = reserveSelector(swapPreviewRequest.inToken)

  let tokenInAmountForSor = swapPreviewRequest.inTokenAmount
  if (lendingInToken) {
    const aTokenConnector = yield* select(
      contractsSelectors.staticATokenConnector,
    )
    const wrappedHToken = aTokenConnector(lendingInToken.wrappedATokenAddress)
    const wrappedHTokenAmount = yield* call(
      wrappedHToken.dynamicToStaticAmount,
      swapPreviewRequest.inTokenAmount.toBigNumber(),
    )
    tokenInAmountForSor = BigDecimal.from(
      wrappedHTokenAmount,
      swapPreviewRequest.inTokenAmount.decimals,
    )
  }

  const userAddress = yield* select(walletSelectors.userAddress)
  if (!userAddress) throw Error('User not found')
  const tradeService = yield* select(servicesSelectors.tradeService)
  if (!tradeService) throw Error('tradeService not found')
  const selectTokenByAddress = yield* select(tokenSelectors.selectById)

  const inToken = selectTokenByAddress(swapPreviewRequest.inToken)
  const outToken = selectTokenByAddress(swapPreviewRequest.outToken)

  if (!inToken) throw Error('inToken not found')
  if (!outToken) throw Error('outToken not found')

  const chainId = yield* select(networkSelectors.applicationChainId)

  const {
    amount: outTokenAmount,
    swapKind,
    swaps,
    fee,
    tokensAddresses,
    limits,
    funds,
    spotPrice,
    effectivePrice,
  } = yield* apply(tradeService, tradeService.previewSwap, [
    userAddress,
    {
      token: inToken.address,
      amount: tokenInAmountForSor.toBigNumber(),
      type: SwapTokenType.max,
    } as SwapToken,
    inToken.decimals,
    {
      token: outToken.address,
      amount: BigNumber.from(0),
      type: SwapTokenType.min,
    } as SwapToken,
    outToken.decimals,
    tokenInAmountForSor.toBigNumber(),
    chainId,
  ])

  let unwrappedOutTokenAmount = outTokenAmount
  if (lendingOutToken) {
    const staticATokenConnector = yield* select(
      contractsSelectors.staticATokenConnector,
    )
    const staticAToken = staticATokenConnector(
      lendingOutToken.wrappedATokenAddress,
    )
    unwrappedOutTokenAmount = yield* call(
      staticAToken.staticToDynamicAmount,
      outTokenAmount,
    )
  }

  const outTokenIndex = tokensAddresses.findIndex(
    (address) => address === outToken.address,
  )

  const slippage = swapPreviewRequest.slippage.toBigNumber()

  const outTokenAmountWithSlippage = removeSlippageFromValue(
    unwrappedOutTokenAmount,
    slippage,
  )

  const limitsWithSlippage = limits.map((limit, index) => {
    if (outTokenIndex === index) {
      const limitSlippage = removeSlippageFromValue(outTokenAmount, slippage)
      return limitSlippage.mul(-1).toString()
    }

    return limit
  })

  const paths = yield* call(
    getSwapPaths,
    swaps,
    tokensAddresses,
    inToken.address,
  )

  const swapNodes = yield* call(getSwapNodes, paths, tokenInAmountForSor)

  const baseTokenAmount = swapPreviewRequest.inTokenAmount.toBigNumber()

  const priceImpact = calculatePriceImpactSwap(
    effectivePrice.toString(),
    spotPrice,
  )

  const isUnderPerformance =
    baseTokenAmount.gt(0) &&
    outTokenAmount.gt(0) &&
    priceImpact > PRICE_IMPACT_THRESHOLD

  const isInsufficientLiquidity =
    baseTokenAmount.gt(0) && swaps.length === 0 && outTokenAmount.eq(0)

  const swap: ISwap = {
    sorSwaps: swaps,
    swapNodes: swapNodes,
    sorTokens: tokensAddresses,
    inToken: inToken.address,
    inTokenAmount: swapPreviewRequest.inTokenAmount,
    outToken: outToken.address,
    outTokenAmount: BigDecimal.from(unwrappedOutTokenAmount, outToken.decimals),
    outTokenAmountWithSlippage: BigDecimal.from(
      outTokenAmountWithSlippage,
      outToken.decimals,
    ),
    fee: BigDecimal.from(fee, 2),
    priceImpact: priceImpact,
    slippage: swapPreviewRequest.slippage,
    isUnderPerformance,
    isInsufficientLiquidity,
    swapKind,
    limits: limitsWithSlippage,
    funds,
    spotPrice,
  }

  return swap
}

function* calculateQuotePrice(
  baseTokenAddress: string,
  quoteTokenAddress: string,
  baseTokenValue: BigNumber,
  quoteTokenValue: BigNumber,
) {
  if (baseTokenValue.eq(0) || quoteTokenValue.eq(0)) return null

  const selectToken = yield* select(tokenSelectors.selectById)

  const baseToken = selectToken(baseTokenAddress)
  const quoteToken = selectToken(quoteTokenAddress)

  const baseTokenDecimals = baseToken?.decimals ?? 18
  const quoteTokenDecimals = quoteToken?.decimals ?? 18
  const precision = QUOTE_PRICE_PRECISION
  const calculatedQuotePrice = quoteTokenValue
    .mul(BigNumber.from(10).pow(precision))
    .mul(BigNumber.from(10).pow(baseTokenDecimals))
    .div(baseTokenValue)
    .div(BigNumber.from(10).pow(quoteTokenDecimals))
  const quotePriceFormatted = truncateToSpecificDecimals(
    bigNumberToString(calculatedQuotePrice, precision),
    precision,
  )
  if (Number(quotePriceFormatted) === 0) {
    return messages.TOO_SMALL_VALUE
  } else {
    return quotePriceFormatted
  }
}

export function* swapPreviewRequestActionHandler(): Generator<
  StrictEffect,
  void
> {
  const inTokenAmount = yield* select(swapSelectors.baseTokenValue)
  const slippage = yield* select(swapSelectors.slippage)
  const {
    baseTokenAddress: inToken,
    quoteTokenAddress: outToken,
  } = yield* select(swapSelectors.swapTokensAddresses)

  if (inTokenAmount?.gt(BigDecimal.from(0)) && inToken && outToken) {
    const swapPreviewRequest: ISwapRequest = {
      inToken,
      outToken,
      inTokenAmount,
      slippage,
    }
    const reserveSelector = yield* select(
      lendingSelectors.selectReserveByHTokenId,
    )
    const lendingOutToken = reserveSelector(swapPreviewRequest.outToken)
    const lendingInToken = reserveSelector(swapPreviewRequest.inToken)
    if (lendingInToken)
      swapPreviewRequest.inToken = lendingInToken?.wrappedATokenAddress
    if (lendingOutToken)
      swapPreviewRequest.outToken = lendingOutToken?.wrappedATokenAddress

    try {
      const swapPreview = yield* call(
        swapPreviewRequestSaga,
        swapPreviewRequest,
      )

      const quotePrice = yield* call(
        calculateQuotePrice,
        swapPreview.inToken,
        swapPreview.outToken,
        swapPreview.inTokenAmount.toBigNumber(),
        swapPreview.outTokenAmount.toBigNumber(),
      )

      yield* put(
        swapActions.swapPreviewRequestSuccess({ ...swapPreview, quotePrice }),
      )
    } catch (error) {
      console.error(error)
      yield* put(swapActions.swapPreviewRequestError())
      yield* call(setContractError, error)
    }
  } else {
    yield* put(swapActions.swapPreviewRequestClean())
  }
}
