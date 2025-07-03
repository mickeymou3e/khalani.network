import { BigNumber, ethers } from 'ethers'
import lodash, { cloneDeep } from 'lodash'

import { getChainConfig } from '@config'
import { MaxUint256 } from '@constants/Networks'
import { IPoolToken } from '@dataSource/graph/pools/poolsTokens/types'
import { address } from '@dataSource/graph/utils/formatters'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import {
  BatchSwapStep,
  FundManagement,
  Swaps,
  SwapType,
  WeightedPoolEncoder,
} from '@hadouken-project/sdk'
import { IPool, PoolType } from '@interfaces/pool'
import { Balances } from '@interfaces/token'
import { BigDecimal, HUNDRED_PERCENTAGE, ONE_PERCENT } from '@utils/math'
import {
  findWrapEthWithAmount,
  replaceWrapEthBalances,
  replaceWrapEthToken,
  replaceWrapEthTokenInPool,
} from '@utils/token/wEth'

import BatchRelayerService from '../batchRelayer/batchRelayer.service'
import InvestService from '../invest/invest.service'
import TradeService from '../trade/trade.service'
import { SwapV2 } from '../trade/types'
import {
  BatchSwapData,
  ChainReferenceTokenAmount,
  ExitTokenInParams,
  ExitTokensOutParams,
  IPoolService,
  IPoolServiceProvider,
  JoinParams,
  LendingToken,
  QueryExitTokenInParams,
  QueryExitTokenInResult,
  QueryExitTokensOutParams,
  QueryExitTokensOutResult,
  QueryJoinParams,
  QueryJoinResult,
  SwapPair,
  UserBalanceOpKind,
  WeightedBoostedLendingTokensJoinParams,
} from './types'

export class WeightedBoostedPool implements IPoolService {
  constructor(
    public readonly investService: InvestService,
    public readonly tradeService: TradeService,
    public readonly batchRelayerService: BatchRelayerService,
  ) {}

  public async queryJoin({
    account,
    pool,
    allPools,
    amountsIn,
    tokensIn,
    slippage = ONE_PERCENT,
    chainId,
  }: QueryJoinParams): Promise<QueryJoinResult> {
    const destinationTokens = pool.tokens.map((token) => token.address)

    const { isWEth, ethAmount } = findWrapEthWithAmount(
      chainId,
      tokensIn,
      amountsIn,
    )

    const tokens = replaceWrapEthToken(chainId, tokensIn)
    const poolsWithEthTokenInPool = replaceWrapEthTokenInPool(chainId, allPools)

    const { amountsInToJoin } = await this.getBatchSwapData(
      pool,
      poolsWithEthTokenInPool,
      amountsIn,
      tokens,
      destinationTokens,
      slippage,
      false,
      'deposit',
    )

    const { amountTokenOut } = await this.investService.queryJoin(
      account,
      pool,
      amountsInToJoin,
      destinationTokens,
    )

    return {
      amountsIn,
      amountOut: amountTokenOut,
      isWEth: isWEth,
      ethAmount,
    }
  }

  public async join({
    account,
    pool,
    allPools,
    allTokens,
    amountsIn,
    tokensIn,
    minBptOut,
    slippage = ONE_PERCENT,
    chainId,
    stakeToBackstop,
    backstop,
  }: JoinParams): Promise<TransactionResponse> {
    const destinationTokens = pool.tokens.map((token) => token.address)

    const notEmptyTokensIn = tokensIn.filter((_tokenIn, index) =>
      amountsIn[index].gt(BigNumber.from(0)),
    )

    const lendingTokens = allTokens.filter((token) =>
      notEmptyTokensIn.some(
        (tokenIn) =>
          address(tokenIn) === address(token.address) && token.isLendingToken,
      ),
    )

    const { ethAmount } = findWrapEthWithAmount(chainId, tokensIn, amountsIn)

    const tokens = replaceWrapEthToken(chainId, tokensIn)

    const poolsWithEthTokenInPool = replaceWrapEthTokenInPool(chainId, allPools)

    if (lendingTokens.length > 0) {
      return await this.joinWithLendingTokens({
        account,
        pool,
        destinationTokens,
        minBptOut,
        allPools: poolsWithEthTokenInPool,
        lendingTokens,
        notEmptyTokensIn,
        allTokens,
        amountsIn,
        tokensIn: tokens,
        slippage,
        stakeToBackstop,
        backstop,
        ethAmount,
      })
    }

    const {
      data: batchSwap,
      amountsInToJoin,
      limits,
    } = await this.getBatchSwapData(
      pool,
      poolsWithEthTokenInPool,
      amountsIn,
      tokens,
      destinationTokens,
      slippage,
      true,
      'deposit',
    )

    const calls: string[] = []

    calls.push(
      this.batchRelayerService.encodeBatchSwap({
        swapType: SwapType.SwapExactIn,
        assets: batchSwap.assets,
        swaps: batchSwap.swaps,
        funds: {
          sender: account,
          recipient: account,
          fromInternalBalance: false,
          toInternalBalance: true,
        },
        deadline: MaxUint256,
        limits: limits.map((limit) => limit.toString()),
        outputReferences: batchSwap.assets.map((_asset, index) => ({
          index,
          key: this.toChainedReference(index),
        })),
        value: ethAmount,
      }),
    )

    const minBptWithSlippage = minBptOut
      ? minBptOut.sub(minBptOut.mul(slippage).div(HUNDRED_PERCENTAGE))
      : BigNumber.from(0)

    calls.push(
      this.batchRelayerService.encodeJoinPool({
        poolId: pool.id,
        poolKind: 0,
        sender: account,
        recipient: stakeToBackstop
          ? this.batchRelayerService._balancerRelayer.address
          : account,
        joinPoolRequest: {
          assets: destinationTokens,
          maxAmountsIn: amountsInToJoin,
          userData: WeightedPoolEncoder.joinExactTokensInForBPTOut(
            amountsInToJoin,
            minBptWithSlippage,
          ),
          fromInternalBalance: true,
        },
        value: BigNumber.from(0),
        outputReference: this.toChainedReference(100),
      }),
    )

    if (stakeToBackstop) {
      if (!backstop) throw Error('backstop not defined')

      calls.push(
        this.batchRelayerService.encodeApproveToken(
          pool.address,
          ethers.constants.MaxUint256,
        ),
      )

      calls.push(
        this.batchRelayerService.encodeDepositBackstopToken({
          triCryptoBackstop: backstop,
          amount: this.toChainedReference(100),
          sender: this.batchRelayerService._balancerRelayer.address,
          recipient: account,
        }),
      )
    }

    return await this.batchRelayerService.multicall(calls, ethAmount)
  }

  public async queryExitTokenIn({
    account,
    pool,
    allPools,

    amountsIn,
    tokensOutAddresses,
    balances,
    chainId,
  }: QueryExitTokenInParams): Promise<QueryExitTokenInResult> {
    if (amountsIn.length > 1) {
      throw new Error('amountsIn multi exit not supported')
    }

    const amountIn = amountsIn[0]

    if (amountIn.eq(BigNumber.from(0))) {
      throw Error('Lp tokens to burn equal 0')
    }

    const mainTokens = pool.tokens.map((token) => token.address)

    const exitTokenIndex = this.getExitTokenIndex(
      allPools,
      mainTokens,
      tokensOutAddresses,
    )

    const queryExitResult = await this.investService.queryExit(
      account,
      pool,
      [],
      mainTokens,
      amountIn,
      exitTokenIndex,
      false,
      true,
    )

    const tokensWithEth = replaceWrapEthToken(chainId, tokensOutAddresses)

    const balancesWithWEth = replaceWrapEthBalances(chainId, balances)

    const poolsWithEthTokenInPool = replaceWrapEthTokenInPool(chainId, allPools)

    const { amountsInToJoin } = await this.getBatchSwapData(
      pool,
      poolsWithEthTokenInPool,
      queryExitResult.amountsOut,
      mainTokens,
      tokensWithEth,
      ONE_PERCENT,
      false,
      'withdraw',
      balancesWithWEth,
    )

    return {
      amountsOut: amountsInToJoin,
      amountsIn: [queryExitResult.bptIn],
      swaps: [] as SwapV2[],
      assets: tokensOutAddresses,
    }
  }

  public async exitTokenIn({
    account,
    pool,
    allPools,
    allTokens,
    amountsIn,
    tokensOutAddresses,
    slippage = ONE_PERCENT,
    balances,
    chainId,
  }: ExitTokenInParams): Promise<TransactionResponse> {
    if (amountsIn.length > 1) {
      throw new Error('amountsIn multi exit not supported')
    }

    const amountIn = amountsIn[0]

    if (amountIn.eq(BigNumber.from(0))) {
      throw Error('Lp tokens to burn equal 0')
    }

    const mainTokens = pool.tokens.map((token) => token.address)

    const exitTokenIndex = this.getExitTokenIndex(
      allPools,
      mainTokens,
      tokensOutAddresses,
    )

    const queryExitResult = await this.investService.queryExit(
      account,
      pool,
      [],
      mainTokens,
      amountIn,
      exitTokenIndex,
      false,
      false,
    )

    const tokensWithEth = replaceWrapEthToken(chainId, tokensOutAddresses)

    const balancesWithWEth = replaceWrapEthBalances(chainId, balances)

    const poolsWithEthTokenInPool = replaceWrapEthTokenInPool(chainId, allPools)

    const { isWEth } = findWrapEthWithAmount(chainId, tokensWithEth, amountsIn)

    const { data: batchSwap, limits } = await this.getBatchSwapData(
      pool,
      poolsWithEthTokenInPool,
      queryExitResult.amountsOut,
      mainTokens,
      tokensWithEth,
      slippage,
      false,
      'withdraw',
      balancesWithWEth,
    )

    const calls: string[] = []

    calls.push(
      this.batchRelayerService.encodeExitPool({
        poolId: pool.id,
        poolKind: 0,
        sender: account,
        recipient: this.batchRelayerService._balancerRelayer.address,
        exitPoolRequest: {
          assets: pool.tokens.map((token) => token.address),
          minAmountsOut: queryExitResult.amountsOut.map((amount) =>
            amount.toString(),
          ),
          toInternalBalance: false,
          userData: WeightedPoolEncoder.exitExactBPTInForTokensOut(amountIn),
        },

        outputReferences: mainTokens.map((_asset, index) => ({
          index,
          key: this.toChainedReference(index),
        })),
      }),
    )

    calls.push(
      this.batchRelayerService.encodeBatchSwap({
        swapType: SwapType.SwapExactIn,
        assets: batchSwap.assets,
        swaps: batchSwap.swaps,
        funds: {
          sender: this.batchRelayerService._balancerRelayer.address,
          recipient: this.batchRelayerService._balancerRelayer.address,
          fromInternalBalance: false,
          toInternalBalance: false,
        },
        deadline: MaxUint256,
        limits: limits.map((limit) => limit.toString()),
        outputReferences: batchSwap.assets.map((_asset, index) => {
          return {
            index,
            key: this.toChainedReference(index),
          }
        }),
        value: BigNumber.from(0),
      }),
    )

    const lendingTokens = allTokens.filter((token) => {
      return batchSwap.swaps.some(
        (swap) =>
          batchSwap.assets[swap.assetOutIndex] === token.address &&
          token.isLendingToken,
      )
    })

    lendingTokens.map((lendingToken) => {
      const index = batchSwap.assets.findIndex(
        (address) => address === lendingToken.address,
      )

      calls.push(
        this.batchRelayerService.encodeWithdrawAaveToken({
          staticToken: lendingToken.address,
          toUnderlying: false,
          sender: this.batchRelayerService._balancerRelayer.address,
          recipient: account,
          amount: this.toChainedReference(index),
          outputReference: BigNumber.from(0),
        }),
      )
    })

    const config = getChainConfig(chainId)

    const standardTokens = tokensOutAddresses.filter((token) => {
      if (isWEth) {
        return token !== config.nativeCurrency.address
      }
      return true
    })

    standardTokens.forEach((token) => {
      calls.push(
        this.batchRelayerService.encodeApproveToken(
          token,
          BigNumber.from(ethers.constants.MaxUint256),
        ),
      )
    })

    calls.push(
      this.batchRelayerService.encodeRefundTokens({
        tokens: standardTokens,
        recipient: account,
      }),
    )

    return await this.batchRelayerService.multicall(calls)
  }

  public async queryExitTokensOut(
    _props: QueryExitTokensOutParams,
  ): Promise<QueryExitTokensOutResult> {
    throw Error('queryExitTokensOut not implemented')
  }

  public async exitTokensOut(
    _props: ExitTokensOutParams,
  ): Promise<TransactionResponse> {
    throw Error('not implemented')
  }

  private getExitTokenIndex(
    allPools: IPool[],
    tokensIn: string[],
    tokensOut: string[],
  ): number | null {
    const boostedTokenPools = tokensIn.reduce((boostedPools, address) => {
      const boostedPool = allPools.find((pool) => pool.address === address)
      if (boostedPool) {
        boostedPools.push(boostedPool)
      }

      return boostedPools
    }, [] as IPool[])

    const tokensToWithdraw = tokensOut.map((address) => {
      const boostedToken = boostedTokenPools.find((pool) =>
        pool.tokens.some((token) => token.address === address),
      )
      if (boostedToken) {
        return {
          address: boostedToken.address,
          tokenOutAddress: address,
        }
      }

      return {
        address: address,
        tokenOutAddress: address,
      }
    })

    return tokensToWithdraw.length > 1
      ? null
      : tokensIn.findIndex((address) => address === tokensToWithdraw[0].address)
  }

  private toChainedReference(key: number): BigNumber {
    const CHAINED_REFERENCE_PREFIX = 'ba10'

    // The full padded prefix is 66 characters long, with 64 hex characters and the 0x prefix.
    const paddedPrefix = `0x${CHAINED_REFERENCE_PREFIX}${'0'.repeat(
      64 - CHAINED_REFERENCE_PREFIX.length,
    )}`

    return BigNumber.from(paddedPrefix).add(key)
  }

  public async getBatchSwapData(
    currentPool: IPool,
    allPools: IPool[],
    amountsIn: BigNumber[],
    tokensIn: string[],
    destinationTokens: string[],
    slippage: BigNumber,
    getIndexValues: boolean,
    operation: 'deposit' | 'withdraw',
    balances?: Balances,
    tokenChainReferenceAmount?: ChainReferenceTokenAmount[],
  ): Promise<{
    data: BatchSwapData
    deltas: string[]
    amountsInToJoin: BigNumber[]
    limits: string[]
  }> {
    const amountsInWithoutWrappedTokens = amountsIn.map((amountIn, index) => {
      if (
        destinationTokens.find(
          (token) => address(token) === address(tokensIn[index]),
        )
      ) {
        return BigNumber.from(0)
      }
      return amountIn
    })

    const pairs =
      operation === 'deposit'
        ? this.getDepositSwapPairs(
            allPools,
            amountsInWithoutWrappedTokens,
            tokensIn,
            destinationTokens,
          )
        : this.getWithdrawSwapPairs(
            currentPool,
            allPools,
            amountsInWithoutWrappedTokens,
            tokensIn,
            destinationTokens,
            balances,
          )

    const pairsWithRefs =
      operation === 'deposit'
        ? this.getDepositSwapPairs(
            allPools,
            amountsInWithoutWrappedTokens,
            tokensIn,
            destinationTokens,
            tokenChainReferenceAmount,
          )
        : this.getWithdrawSwapPairs(
            currentPool,
            allPools,
            amountsInWithoutWrappedTokens,
            tokensIn,
            destinationTokens,
            balances,
          )

    const batchSwap = this.poolBatchSwaps(
      pairs.map((pair) => pair.assets),
      pairs.map((pair) => pair.swaps),
    )

    const deltas = await this.getDeltas(
      SwapType.SwapExactIn,
      batchSwap.swaps,
      batchSwap.assets,
    )

    const batchSwapWithRefs = this.poolBatchSwaps(
      pairsWithRefs.map((pair) => pair.assets),
      pairsWithRefs.map((pair) => pair.swaps),
    )

    const tokens = batchSwapWithRefs.swaps.reduce(
      (tokens, swap) => {
        const inToken = batchSwapWithRefs.assets[swap.assetInIndex]
        const outToken = batchSwapWithRefs.assets[swap.assetOutIndex]

        tokens.inTokens.push(inToken)
        tokens.outTokens.push(outToken)

        return tokens
      },
      { inTokens: [], outTokens: [] } as {
        inTokens: string[]
        outTokens: string[]
      },
    )

    const limits = Swaps.getLimitsForSlippage(
      tokens.inTokens,
      tokens.outTokens,
      SwapType.SwapExactIn,
      deltas,
      batchSwapWithRefs.assets,
      //5%=50_000_000_000_000_000.  // slippage is 4 decimals now 10_000
      slippage.mul(BigNumber.from(10).pow(12)).toString(),
    )

    const amountsInToJoin = destinationTokens.map((tokenAddress) => {
      const token = tokensIn.find(
        (tokenInAddress) => address(tokenInAddress) === address(tokenAddress),
      )

      // for not wrapped token
      if (token) {
        const index = tokensIn.indexOf(token)
        return amountsIn[index]
      }
      const batchIndex = batchSwap.assets.indexOf(tokenAddress)

      if (batchIndex === -1 || deltas[batchIndex] === '0') {
        return BigNumber.from(0)
      }

      if (getIndexValues) {
        return this.toChainedReference(batchIndex)
      }

      return BigNumber.from(deltas[batchIndex]).mul(-1)
    })

    return {
      data: batchSwapWithRefs,
      deltas,
      amountsInToJoin,
      limits,
    }
  }

  private async getDeltas(
    swapType: SwapType,
    swaps: BatchSwapStep[],
    assets: string[],
  ): Promise<string[]> {
    const funds: FundManagement = {
      sender: ethers.constants.AddressZero,
      recipient: ethers.constants.AddressZero,
      fromInternalBalance: false,
      toInternalBalance: false,
    }

    const response: BigNumber[] = await this.tradeService.vault.callStatic.queryBatchSwap(
      swapType,
      swaps,
      assets,
      funds,
    )

    return response.map((item: BigNumber) => item.toString())
  }

  public getDepositSwapPairs(
    pools: IPool[],
    amountsIn: BigNumber[],
    tokensIn: string[],
    destinationTokens: string[],
    tokenChainReferenceAmount?: ChainReferenceTokenAmount[],
  ): SwapPair[] {
    const tokensInWithAddress = amountsIn.map((amount, index) => {
      return {
        address: tokensIn[index],
        amount,
      }
    })

    return destinationTokens.reduce((swapPair, destinationToken) => {
      const destinationPool = pools.find(
        (pool) => pool.address === destinationToken,
      )

      if (destinationPool) {
        const destinationPoolLpTokensWithoutBPT = pools.filter((pool) =>
          destinationPool?.tokens.some(
            (token) =>
              address(token.address) === address(pool.address) &&
              address(token.address) !== address(destinationPool.address),
          ),
        )

        if (
          destinationPoolLpTokensWithoutBPT &&
          destinationPoolLpTokensWithoutBPT.length > 0
        ) {
          destinationPoolLpTokensWithoutBPT.forEach((lpToken) => {
            const inTokens = tokensInWithAddress.filter((tokenIn) =>
              lpToken.tokens.some(
                (poolToken) =>
                  address(poolToken.address) === address(tokenIn.address),
              ),
            )

            inTokens.forEach((token) => {
              if (token.amount.gt(0)) {
                const chainAmount = tokenChainReferenceAmount?.find(
                  (chainAmount) =>
                    address(chainAmount.address) === address(token.address),
                )

                const amount = chainAmount
                  ? chainAmount.amount.toString()
                  : token.amount.toString()

                swapPair.push({
                  swaps: [
                    {
                      poolId: lpToken.id,
                      assetInIndex: 0,
                      assetOutIndex: 1,
                      amount: amount,
                      userData: '0x',
                    },
                    {
                      poolId: destinationPool.id,
                      assetInIndex: 1,
                      assetOutIndex: 2,
                      amount: '0',
                      userData: '0x',
                    },
                  ],

                  assets: [token.address, lpToken.address, destinationToken],
                })
              }
            })
          })
        } else {
          const inTokens = tokensInWithAddress.filter((tokenIn) =>
            destinationPool.tokens.some(
              (poolToken) => poolToken.address === tokenIn.address,
            ),
          )

          inTokens.forEach((token) => {
            if (token.amount.gt(0)) {
              const chainAmount = tokenChainReferenceAmount?.find(
                (chainAmount) =>
                  address(chainAmount.address) === address(token.address),
              )

              const amount = chainAmount
                ? chainAmount.amount.toString()
                : token.amount.toString()

              swapPair.push({
                swaps: [
                  {
                    poolId: destinationPool.id,
                    assetInIndex: 0,
                    assetOutIndex: 1,
                    amount: amount,
                    userData: '0x',
                  },
                ],

                assets: [token.address, destinationToken],
              })
            }
          })
        }
      }

      return swapPair
    }, [] as { swaps: BatchSwapStep[]; assets: string[] }[])
  }

  public getWithdrawSwapPairs(
    currentPool: IPool,
    pools: IPool[],
    amountsIn: BigNumber[],
    tokensIn: string[],
    destinationTokens: string[],
    balances?: Balances,
  ): SwapPair[] {
    const lpTokenAmountsWithAddresses = amountsIn.map((amount, index) => {
      return {
        address: tokensIn[index],
        amount,
      }
    })

    const swapPairs = destinationTokens.reduce((swapPair, destinationToken) => {
      const isWeightedBoostedPoolToken = tokensIn.some(
        (token) => address(token) === address(destinationToken),
      )

      if (isWeightedBoostedPoolToken) {
        return swapPair
      }

      const destinationTokenPool = pools.find(
        (pool) =>
          pool.tokens.some(
            (token) => address(token.address) === address(destinationToken),
          ) &&
          tokensIn.some(
            (tokenIn) => address(tokenIn) === address(pool.address),
          ),
      )

      const isSingleLevelNesting = !!destinationTokenPool

      if (isSingleLevelNesting) {
        const isWeightedBoostedTokenPool = tokensIn.some(
          (token) => address(token) === address(destinationTokenPool.address),
        )
        if (isWeightedBoostedTokenPool) {
          const lpTokenWithAddress = lpTokenAmountsWithAddresses.find(
            (lpToken) =>
              address(lpToken.address) ===
              address(destinationTokenPool.address),
          )

          if (lpTokenWithAddress) {
            const pair = this.getSingleLevelPair(
              destinationToken,
              lpTokenWithAddress.amount,
              destinationTokenPool,
              destinationTokens,
              pools,
              balances,
            )
            if (pair) {
              swapPair.push(pair)
            }
          }
        }
      } else {
        const mainPools = pools.filter((pool) =>
          currentPool.tokens.some(
            (tok) => address(tok.address) === address(pool.address),
          ),
        )

        const nestedDestinationTokenPool = pools.find((pool) => {
          const destinationTokenPossiblePoolAddresses = pools
            .filter(
              (pool) =>
                pool.tokens.some(
                  (tok) => address(tok.address) === address(destinationToken),
                ) &&
                mainPools.some((pool) =>
                  pool.tokens.some(
                    (tok) => address(tok.address) === address(pool.address),
                  ),
                ),
            )
            .map((pool) => pool.address)

          const poolIsWeightedPoolDepositToken = lpTokenAmountsWithAddresses.some(
            (lpToken) => address(lpToken.address) === address(pool.address),
          )

          const poolHaveDestinationTokenPool = pool.tokens.some((tok) =>
            destinationTokenPossiblePoolAddresses.some(
              (poolAddress) => address(poolAddress) === address(tok.address),
            ),
          )

          return poolIsWeightedPoolDepositToken && poolHaveDestinationTokenPool
        })

        if (!nestedDestinationTokenPool) return swapPair

        const boostedToken = lpTokenAmountsWithAddresses.find(
          (tokenIn) =>
            address(tokenIn.address) ===
            address(nestedDestinationTokenPool.address),
        )

        if (currentPool && boostedToken) {
          const pair = this.getTwoLevelPair(
            destinationToken,
            boostedToken,
            currentPool,
            destinationTokens,
            pools,
            balances,
          )
          if (pair) {
            swapPair.push(pair)
          }
        }
      }

      return swapPair
    }, [] as { swaps: BatchSwapStep[]; assets: string[] }[])

    return swapPairs
  }

  /**
   * // get pair to swap for single level nesting
   * @param destinationToken - destination token to swap to
   * @param lpAmount - amount of lp token
   * @param destinationPool - Pool of destinationToken
   * @param destinationTokens - all destination tokens
   * @param pools - All system pools
   * @param balances - All system balances
   * @returns
   */
  private getSingleLevelPair(
    destinationToken: string,
    lpAmount: BigNumber,
    destinationPool: IPool,
    destinationTokens: string[],
    pools: IPool[],
    balances?: Balances,
  ): {
    swaps: BatchSwapStep[]
    assets: string[]
  } | null {
    const basicTokens = destinationPool.tokens.filter(
      (token) =>
        !pools.some(
          (pool) => address(pool.address) === address(token.address),
        ) &&
        destinationTokens.some(
          (destToken) => address(destToken) === address(token.address),
        ),
    )

    if (lpAmount && lpAmount.gt(0)) {
      // we ignore pool BPT token thats why we use basicTokens
      const destinationPoolTotalBalance = basicTokens.reduce((sum, token) => {
        const balance = balances?.[token.address]
        if (balance) {
          sum = sum.add(balance)
        }
        return sum
      }, BigDecimal.from(0, 27))

      const destinationTokenBalance =
        balances?.[destinationToken] ?? BigDecimal.from(0, 27)

      const destinationTokenRatio =
        destinationTokenBalance && destinationPoolTotalBalance
          ? BigDecimal.from(
              destinationTokenBalance
                ?.div(destinationPoolTotalBalance)
                .toBigNumber()
                .div(10 ** 9),
              18,
            )
          : BigDecimal.from(BigNumber.from(10).pow(18))

      const scaledAmount = lpAmount
        .mul(destinationTokenRatio.toBigNumber())
        .div(BigNumber.from(10).pow(18))

      if (scaledAmount.gt(0)) {
        return {
          swaps: [
            {
              poolId: destinationPool.id,
              assetInIndex: 0,
              assetOutIndex: 1,
              amount: scaledAmount.toString(),
              userData: '0x',
            },
          ],

          assets: [destinationPool.address, destinationToken],
        }
      }
    }

    return null
  }

  /**
   * // get pair to swap for two level nesting
   * @param destinationToken - destination token to swap to
   * @param lpAmount - amount of lp token
   * @param destinationPool - Pool of destinationToken
   * @param destinationTokens - all destination tokens
   * @param pools - All system pools
   * @param balances - All system balances
   * @returns
   */
  private getTwoLevelPair(
    destinationToken: string,
    boostedToken: {
      address: string
      amount: BigNumber
    },
    destinationPool: IPool,
    destinationTokens: string[],
    pools: IPool[],
    balances?: Balances,
  ): {
    swaps: BatchSwapStep[]
    assets: string[]
  } | null {
    const basicTokens = destinationPool.tokens.filter(
      (token) =>
        !pools.some(
          (pool) => address(pool.address) === address(token.address),
        ) &&
        destinationTokens.some(
          (destToken) => address(destToken) === address(token.address),
        ),
    )

    const boostedPool = pools.find(
      (pool) => address(pool.address) === address(boostedToken.address),
    )

    if (boostedPool && boostedToken && boostedToken.amount.gt(0)) {
      const lpPool = pools.find(
        (pool) =>
          pool.tokens.some(
            (tok) => address(tok.address) === address(destinationToken),
          ) &&
          boostedPool.tokens.some(
            (tok) => address(tok.address) === address(pool.address),
          ),
      )

      if (lpPool) {
        if (boostedPool) {
          const linearPools = pools.filter((pool) =>
            boostedPool.tokens.some(
              (boostedPoolTokens) =>
                address(boostedPoolTokens.address) === address(pool.address) &&
                address(boostedPoolTokens.address) !==
                  address(boostedPool.address),
            ),
          )

          const linearPoolTotalBalance = linearPools.reduce((sum, token) => {
            const balance = balances?.[token.address]
            if (balance) {
              sum = sum.add(balance)
            }
            return sum
          }, BigDecimal.from(0, 27))

          const boostedTokenBalance = balances?.[boostedPool.address]
          const lpTokenBalance = balances?.[lpPool.address]

          const lpTokenRatio =
            lpTokenBalance && boostedTokenBalance
              ? BigDecimal.from(
                  lpTokenBalance
                    ?.div(linearPoolTotalBalance)
                    .toBigNumber()
                    .div(10 ** 9),
                  18,
                )
              : BigDecimal.from(BigNumber.from(10).pow(18))

          const lpTokenScaledAmount = boostedToken.amount
            .mul(lpTokenRatio.toBigNumber())
            .div(BigNumber.from(10).pow(18))

          const token = lpPool.tokens.find(
            (tok) => address(tok.address) === address(destinationToken),
          )

          const tokens = lpPool.tokens.filter(
            (token) =>
              !pools.some((pool) => pool.address === token.address) &&
              destinationTokens.some(
                (destinationToken) =>
                  address(destinationToken) === address(token.address),
              ),
          )

          const tokensTotalBalance = tokens.reduce((sum, token) => {
            const balance = balances?.[token.address]
            if (balance) {
              sum = sum.add(balance)
            }
            return sum
          }, BigDecimal.from(0, 27))

          const tokenBalance = token
            ? balances?.[token.address]
            : BigDecimal.from(BigNumber.from(10).pow(18))

          const tokenRatio =
            tokenBalance && lpTokenBalance
              ? BigDecimal.from(
                  tokenBalance
                    ?.div(tokensTotalBalance)
                    .toBigNumber()
                    .div(10 ** 9),
                  18,
                )
              : BigDecimal.from(BigNumber.from(10).pow(18))

          const tokenScaledAmount = lpTokenScaledAmount
            .mul(tokenRatio.toBigNumber())
            .div(BigNumber.from(10).pow(18))

          if (tokenScaledAmount.gt(0)) {
            return {
              swaps: [
                {
                  poolId: boostedPool.id,
                  assetInIndex: 0,
                  assetOutIndex: 1,
                  amount: tokenScaledAmount.toString(),
                  userData: '0x',
                },
                {
                  poolId: lpPool.id,
                  assetInIndex: 1,
                  assetOutIndex: 2,
                  amount: '0',
                  userData: '0x',
                },
              ],

              assets: [boostedPool.address, lpPool.address, destinationToken],
            }
          }
        }
      } else {
        const basicTokenTotalBalance = basicTokens.reduce((sum, token) => {
          const balance = balances?.[token.address]
          if (balance) {
            sum = sum.add(balance)
          }
          return sum
        }, BigDecimal.from(0, 27))

        const destinationTokenBalance =
          balances?.[destinationToken] ?? BigDecimal.from(0, 27)

        const baseTokenRatio =
          destinationTokenBalance && basicTokenTotalBalance
            ? BigDecimal.from(
                destinationTokenBalance
                  ?.div(basicTokenTotalBalance)
                  .toBigNumber()
                  .div(10 ** 9),
                18,
              )
            : BigDecimal.from(BigNumber.from(10).pow(18))

        const tokenScaledAmount = boostedToken.amount
          .mul(baseTokenRatio.toBigNumber())
          .div(BigNumber.from(10).pow(18))

        if (tokenScaledAmount.gt(0)) {
          return {
            swaps: [
              {
                poolId: destinationPool.id,
                assetInIndex: 0,
                assetOutIndex: 1,
                amount: tokenScaledAmount.toString(),
                userData: '0x',
              },
            ],

            assets: [destinationPool.address, destinationToken],
          }
        }
      }
    }

    return null
  }

  private poolBatchSwaps(assets: string[][], swaps: SwapV2[][]): BatchSwapData {
    // asset addresses without duplicates
    const joinedAssets = lodash.uniq(lodash.flatten(assets))

    //create a deep copy to ensure we do not mutate the input
    const clonedSwaps = cloneDeep(swaps)

    // Update indices of each swap to use new asset array
    clonedSwaps.forEach((swap, i) => {
      swap.forEach((poolSwap) => {
        poolSwap.assetInIndex = joinedAssets.indexOf(
          assets[i][poolSwap.assetInIndex],
        )
        poolSwap.assetOutIndex = joinedAssets.indexOf(
          assets[i][poolSwap.assetOutIndex],
        )
      })
    })

    // Join Swaps into a single batchSwap
    const batchedSwaps = clonedSwaps.flat()

    return { swaps: batchedSwaps, assets: joinedAssets }
  }

  private async getAmountsInWithLendWrappedTokens({
    lendingTokens,
    tokensIn,
    account,
    amountsIn,
  }: {
    lendingTokens: IPoolToken[]
    tokensIn: string[]
    account: string
    amountsIn: BigNumber[]
  }): Promise<BigNumber[]> {
    const checkCalls: string[] = []
    const wrappedAddresses: string[] = []
    const lendingTokenAmounts: LendingToken[] = []

    lendingTokens.map((lendingToken) => {
      const index = tokensIn.indexOf(lendingToken.address)
      if (amountsIn[index].gt(0)) {
        checkCalls.push(
          this.batchRelayerService.encodeDepositAaveToken({
            staticToken: lendingToken.address,
            sender: account,
            recipient: this.batchRelayerService._balancerRelayer.address,
            fromUnderlying: false,
            amount: amountsIn[index],
            outputReference: BigNumber.from(0),
          }),
        )

        wrappedAddresses.push(lendingToken.address)
      }
    })

    const lendingTokenWrappedAmountsResult = await this.batchRelayerService.staticMulticall(
      checkCalls,
    )

    lendingTokenWrappedAmountsResult.map((wrappedAmount, index) => {
      lendingTokenAmounts.push({
        address: wrappedAddresses[index],
        wrappedAmount: BigNumber.from(wrappedAmount),
      })
    })

    return tokensIn.map((tokenIn, index) => {
      const lendingTokenAmount:
        | LendingToken
        | undefined = lendingTokenAmounts.find((lta) => lta.address === tokenIn)

      if (lendingTokenAmount) {
        return lendingTokenAmount.wrappedAmount
      }

      return amountsIn[index]
    })
  }

  private async joinWithLendingTokens({
    pool,
    allPools,
    destinationTokens,
    lendingTokens,
    tokensIn,
    account,
    amountsIn,
    allTokens,
    slippage,
    notEmptyTokensIn,
    minBptOut,
    stakeToBackstop,
    backstop,
    ethAmount,
  }: WeightedBoostedLendingTokensJoinParams): Promise<TransactionResponse> {
    const calls: string[] = []

    const standardTokens = allTokens.filter(
      (token) =>
        !token.isLendingToken &&
        notEmptyTokensIn.some(
          (tokenIn) => address(tokenIn) === address(token.address),
        ),
    )

    const tokenChainReferenceAmount: ChainReferenceTokenAmount[] = []
    const amountsInWithLendWrappedTokens = await this.getAmountsInWithLendWrappedTokens(
      {
        lendingTokens,
        tokensIn,
        account,
        amountsIn,
      },
    )

    lendingTokens.map((lendingToken) => {
      const index = tokensIn.indexOf(lendingToken.address)

      calls.push(
        this.batchRelayerService.encodeDepositAaveToken({
          staticToken: lendingToken.address,
          sender: account,
          recipient: this.batchRelayerService._balancerRelayer.address,
          fromUnderlying: false,
          amount: amountsIn[index],
          outputReference: this.toChainedReference(index),
        }),
      )

      tokenChainReferenceAmount.push({
        address: lendingToken.address,
        amount: this.toChainedReference(index),
      })

      calls.push(
        this.batchRelayerService.encodeApproveToken(
          lendingToken.address,
          amountsIn[index],
        ),
      )
    })

    standardTokens.map((token) => {
      const index = tokensIn.indexOf(token.address)
      if (amountsInWithLendWrappedTokens[index]?.gt(0)) {
        calls.push(
          this.batchRelayerService.encodeManageUserBalance(
            UserBalanceOpKind.TRANSFER_EXTERNAL,
            token.address,
            amountsInWithLendWrappedTokens[index],
            account,
            this.batchRelayerService._balancerRelayer.address,
          ),
        )

        calls.push(
          this.batchRelayerService.encodeApproveToken(
            token.address,
            amountsInWithLendWrappedTokens[index],
          ),
        )
      }
    })

    const {
      data: batchSwap,
      amountsInToJoin,
      limits,
    } = await this.getBatchSwapData(
      pool,
      allPools,
      amountsInWithLendWrappedTokens,
      tokensIn,
      destinationTokens,
      slippage,
      true,
      'deposit',
      undefined,
      tokenChainReferenceAmount,
    )

    calls.push(
      this.batchRelayerService.encodeBatchSwap({
        swapType: SwapType.SwapExactIn,
        assets: batchSwap.assets,
        swaps: batchSwap.swaps,
        funds: {
          sender: this.batchRelayerService._balancerRelayer.address,
          recipient: this.batchRelayerService._balancerRelayer.address,
          fromInternalBalance: false,
          toInternalBalance: false,
        },
        deadline: MaxUint256,
        limits: limits.map((limit) => limit.toString()),
        outputReferences: batchSwap.assets.map((_asset, index) => ({
          index,
          key: this.toChainedReference(index),
        })),
        value: ethAmount ?? BigNumber.from(0),
      }),
    )

    const minBptWithSlippage = minBptOut
      ? minBptOut.sub(minBptOut.mul(slippage).div(HUNDRED_PERCENTAGE))
      : BigNumber.from(0)

    calls.push(
      this.batchRelayerService.encodeJoinPool({
        poolId: pool.id,
        poolKind: 0,
        sender: this.batchRelayerService._balancerRelayer.address,
        recipient: stakeToBackstop
          ? this.batchRelayerService._balancerRelayer.address
          : account,
        joinPoolRequest: {
          assets: destinationTokens,
          maxAmountsIn: amountsInToJoin,
          userData: WeightedPoolEncoder.joinExactTokensInForBPTOut(
            amountsInToJoin,
            minBptWithSlippage,
          ),
          fromInternalBalance: false,
        },
        value: BigNumber.from(0),
        outputReference: this.toChainedReference(100),
      }),
    )

    if (stakeToBackstop) {
      if (!backstop) {
        throw Error('backstop not defined')
      }

      calls.push(
        this.batchRelayerService.encodeApproveToken(
          pool.address,
          ethers.constants.MaxUint256,
        ),
      )

      calls.push(
        this.batchRelayerService.encodeDepositBackstopToken({
          triCryptoBackstop: backstop,
          amount: this.toChainedReference(100),
          sender: this.batchRelayerService._balancerRelayer.address,
          recipient: account,
        }),
      )
    }

    return await this.batchRelayerService.multicall(calls, ethAmount)
  }
}

export class WeightedBoostedPoolServiceProvider
  implements IPoolServiceProvider {
  poolService: WeightedBoostedPool

  constructor(
    public readonly investService: InvestService,
    public readonly tradeService: TradeService,
    public readonly batchRelayerService: BatchRelayerService,
  ) {
    this.poolService = new WeightedBoostedPool(
      investService,
      tradeService,
      batchRelayerService,
    )
  }

  public provide(pool: IPool): WeightedBoostedPool | null {
    if (pool.poolType === PoolType.WeightedBoosted) {
      return this.poolService
    }

    return null
  }
}
