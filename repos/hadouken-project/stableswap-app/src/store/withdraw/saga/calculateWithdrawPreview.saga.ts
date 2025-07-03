import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { apply, call, select } from 'typed-redux-saga'

import { address } from '@dataSource/graph/utils/formatters'
import { PoolType } from '@interfaces/pool'
import { getPoolDepositTokens } from '@store/deposit/saga/editor/utils'
import { metricsSelectors } from '@store/metrics/metrics.selectors'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { IPoolModel } from '@store/pool/selectors/models/types'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { servicesSelectors } from '@store/services/services.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import {
  IWithdraw,
  IWithdrawRequest,
  IWithdrawType,
} from '@store/withdraw/withdraw.types'
import { BigDecimal } from '@utils/math'

import { waitForPricedBalancesSaga } from '../../pricedBalances/waitForPricedBalances.saga'
import { withdrawSelectors } from '../withdraw.selector'

export function* getComposablePoolAmountsIn(
  poolModel: IPoolModel,
  inTokenAmount: BigDecimal,
): Generator<StrictEffect, BigDecimal[]> {
  const applicationChainId = yield* select(networkSelectors.applicationChainId)

  const selectPoolTotalValueUSD = yield* select(
    metricsSelectors.selectPoolTotalValueUSD,
  )

  const selectPoolBalancesUSD = yield* select(
    metricsSelectors.selectPoolBalancesUSD,
  )

  const balances = selectPoolBalancesUSD(poolModel.id)

  const totalLiquidity = selectPoolTotalValueUSD(poolModel.id)

  const parsedTotalLiquidity = BigDecimal.from(
    totalLiquidity.decimals > 18
      ? totalLiquidity
          .toBigNumber()
          .div(BigNumber.from(10).pow(totalLiquidity.decimals - 18))
      : totalLiquidity
          .toBigNumber()
          .mul(BigNumber.from(10).pow(18 - totalLiquidity.decimals)),
  )

  const amountsIn: BigDecimal[] = []

  const { showWrappedTokens, poolId } = yield* select(
    withdrawSelectors.withdrawEditor,
  )

  const withdrawTokens = getPoolDepositTokens(
    poolModel,
    applicationChainId,
    poolId === poolModel.id ? showWrappedTokens : false,
  )

  for (const token of withdrawTokens) {
    const balance = balances ? balances[token.address] : BigDecimal.from(0)

    const parsedBalances = BigDecimal.from(
      balance.decimals > 18
        ? balance
            .toBigNumber()
            .div(BigNumber.from(10).pow(balance.decimals - 18))
        : balance
            .toBigNumber()
            .mul(BigNumber.from(10).pow(18 - balance.decimals)),
    )

    const amount = (parsedBalances ?? BigDecimal.from(0))
      .mul(inTokenAmount)
      .div(parsedTotalLiquidity, 18)

    amountsIn.push(amount)
  }

  const amountsInSum = amountsIn.reduce(
    (sum, amount) => sum.add(amount),
    BigDecimal.from(0),
  )

  const missingLpTokenDiff = inTokenAmount.sub(amountsInSum)

  if (missingLpTokenDiff.gt(BigDecimal.from(0))) {
    const highestAmountTokenValue = amountsIn.reduce((acc, val) => {
      return acc.gt(val) ? acc : val
    })

    const highestAmountTokenIdx = amountsIn.findIndex(
      (amount) => amount === highestAmountTokenValue,
    )

    amountsIn[highestAmountTokenIdx] = highestAmountTokenValue.add(
      missingLpTokenDiff,
    )
  }

  return amountsIn
}

export const getAmountIn = (
  inTokenAmount: BigDecimal,
  balance: BigDecimal,
  totalLiquidity: BigDecimal,
): BigDecimal => {
  const balanceInNumber = balance?.toNumber() ?? 0
  const totalLiquidityInNumber = totalLiquidity?.toNumber() ?? 0

  const weight =
    balance && balanceInNumber > 0 && totalLiquidityInNumber > 0
      ? balance?.div(totalLiquidity)
      : BigDecimal.from(0, 18)

  const amount = inTokenAmount.mul(weight)

  const newAmount =
    amount.decimals > inTokenAmount.decimals
      ? BigDecimal.from(
          BigNumber.from(amount.toBigNumber()).div(
            BigNumber.from(10).pow(amount.decimals - inTokenAmount.decimals),
          ),
          inTokenAmount.decimals,
        )
      : amount

  return newAmount
}

export function* calculateWithdrawPreviewSaga(
  withdrawPreviewRequest: IWithdrawRequest,
): Generator<StrictEffect, IWithdraw> {
  const userAddress = yield* select(walletSelectors.userAddress)

  if (!userAddress) throw Error('User not found')

  const poolServiceProvider = yield* select(
    servicesSelectors.poolServiceProvider,
  )
  const poolModelSelector = yield* select(poolsModelsSelector.selectById)
  const selectPoolById = yield* select(poolSelectors.selectById)

  const selectTokensByAddresses = yield* select(tokenSelectors.selectMany)
  const selectTokenByAddress = yield* select(tokenSelectors.selectById)

  const inToken = selectTokenByAddress(withdrawPreviewRequest.inToken)
  const inTokenAmount = withdrawPreviewRequest.inTokenAmount
  const allPools = yield* select(poolSelectors.selectAll)
  const pool = selectPoolById(withdrawPreviewRequest.poolId)
  const poolModel = poolModelSelector(withdrawPreviewRequest.poolId)

  if (!poolModel) throw Error('Pool model not found')
  if (!pool) throw Error('Pool not found')
  if (!inToken) throw Error('In token not found')
  if (!poolServiceProvider) throw Error('Pool Service Provider not found')
  yield* call(waitForPricedBalancesSaga)
  const selectPoolBalancesUSD = yield* select(
    metricsSelectors.selectPoolBalancesUSD,
  )
  const balances = selectPoolBalancesUSD(poolModel.id)

  const isLpTokenAmountGreaterThanZero = inTokenAmount.gt(
    BigDecimal.from(0, inToken.decimals),
  )

  const poolService = yield* apply(
    poolServiceProvider,
    poolServiceProvider.provide,
    [pool],
  )

  if (!poolService) throw Error('Pool service not found')

  if (!isLpTokenAmountGreaterThanZero) {
    const outTokens = selectTokensByAddresses(withdrawPreviewRequest.outTokens)
    const outTokensAmounts: BigNumber[] = []
    const assets: string[] = []

    return {
      poolId: withdrawPreviewRequest.poolId,
      inTokenAmount,
      inToken: inToken.address,
      outTokensAmounts: outTokens.map((token) => {
        const assetIndex = assets.findIndex(
          (assetAddress) => address(assetAddress) === address(token.address),
        )

        const outTokenAmount = outTokensAmounts[assetIndex]

        return BigDecimal.from(
          outTokenAmount !== undefined ? outTokenAmount : BigNumber.from(0),
          token.decimals,
        )
      }),
      outTokens: outTokens.map(({ address }) => address),
      type: withdrawPreviewRequest.type,
      slippage: withdrawPreviewRequest.slippage,
    }
  }

  if (withdrawPreviewRequest.type === IWithdrawType.ExactOut) {
    const chainId = yield* select(networkSelectors.applicationChainId)

    const { assets, amountsOut } = yield* apply(
      poolService,
      poolService.queryExitTokensOut,
      [
        {
          pool,
          account: userAddress,
          amountsOut: withdrawPreviewRequest.outTokensAmounts.map((amount) =>
            amount.toBigNumber(),
          ),
          tokenInAddress: inToken.address,
          tokensOutAddresses: withdrawPreviewRequest.outTokens,
          chainId,
        },
      ],
    )

    const outTokens = selectTokensByAddresses(withdrawPreviewRequest.outTokens)
    const outTokensAmounts = amountsOut

    return {
      poolId: withdrawPreviewRequest.poolId,
      inTokenAmount,
      inToken: inToken.address,
      outTokensAmounts: outTokens.map((token) => {
        const assetIndex = assets.findIndex(
          (assetAddress) => assetAddress === token.address,
        )

        const outTokenAmount = outTokensAmounts[assetIndex]
        if (outTokenAmount) {
          return BigDecimal.from(outTokenAmount, token.decimals)
        }

        return BigDecimal.from(0, token.decimals)
      }),
      outTokens: outTokens.map(({ address }) => address),
      type: withdrawPreviewRequest.type,
      slippage: withdrawPreviewRequest.slippage,
      isMaxAmount: withdrawPreviewRequest.isMaxAmount,
      tokenIndex: withdrawPreviewRequest.tokenIndex,
    }
  }

  let amountsOut: BigNumber[] = []
  let assets: string[] = []

  if (pool.poolType === PoolType.WeightedBoosted) {
    try {
      const chainId = yield* select(networkSelectors.applicationChainId)

      const result = yield* apply(poolService, poolService.queryExitTokenIn, [
        {
          pool,
          allPools,
          account: userAddress,
          amountsIn: [withdrawPreviewRequest.inTokenAmount.toBigNumber()],
          tokenInAddress: inToken.address,
          tokensOutAddresses: withdrawPreviewRequest.outTokens,
          balances: balances,
          chainId,
        },
      ])

      amountsOut = result.amountsOut
      assets = result.assets
    } catch (error) {
      console.error(error)
    }
  } else if (pool.poolType === PoolType.ComposableStable) {
    try {
      const amountsIn = yield* call(
        getComposablePoolAmountsIn,
        poolModel,
        withdrawPreviewRequest.inTokenAmount,
      )

      const sum = amountsIn.reduce(
        (sum, amount) => sum.add(amount),
        BigDecimal.from(0),
      )

      const factor = withdrawPreviewRequest.inTokenAmount.div(sum)

      const scaledFactor = BigDecimal.from(
        factor.decimals > 18
          ? factor
              .toBigNumber()
              .div(BigNumber.from(10).pow(factor.decimals - 18))
          : factor
              .toBigNumber()
              .mul(BigNumber.from(10).pow(18 - factor.decimals)),
        18,
      )

      const chainId = yield* select(networkSelectors.applicationChainId)

      const result = yield* apply(poolService, poolService.queryExitTokenIn, [
        {
          pool,
          allPools,
          account: userAddress,
          amountsIn: amountsIn.map((amount) =>
            amount.mul(scaledFactor).toBigNumber(),
          ),
          tokenInAddress: inToken.address,
          tokensOutAddresses: withdrawPreviewRequest.outTokens,
          chainId,
        },
      ])

      amountsOut = result.amountsOut
      assets = result.assets
    } catch (error) {
      console.error(error)
    }
  } else {
    try {
      const chainId = yield* select(networkSelectors.applicationChainId)

      const result = yield* apply(poolService, poolService.queryExitTokenIn, [
        {
          pool,
          allPools,
          account: userAddress,
          amountsIn: [inTokenAmount.toBigNumber()],
          tokenInAddress: inToken.address,
          tokensOutAddresses: withdrawPreviewRequest.outTokens,
          chainId,
        },
      ])
      amountsOut = result.amountsOut
      assets = result.assets
    } catch (error) {
      console.error(error)
    }
  }

  const outTokens = selectTokensByAddresses(withdrawPreviewRequest.outTokens)
  const outTokensAmounts = amountsOut

  return {
    poolId: withdrawPreviewRequest.poolId,
    inTokenAmount,
    inToken: inToken.address,
    outTokensAmounts: outTokens.map((token) => {
      const assetIndex = assets.findIndex(
        (assetAddress) => address(assetAddress) === address(token.address),
      )

      const outTokenAmount = outTokensAmounts[assetIndex]

      return BigDecimal.from(
        outTokenAmount !== undefined ? outTokenAmount : BigNumber.from(0),
        token.decimals,
      )
    }),
    outTokens: outTokens.map(({ address }) => address),
    type: withdrawPreviewRequest.type,
    slippage: withdrawPreviewRequest.slippage,
  }
}
