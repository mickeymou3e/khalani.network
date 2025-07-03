import { BigNumber, BigNumberish, ethers } from 'ethers'

import { getChainConfig } from '@config'
import { address } from '@dataSource/graph/utils/formatters'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { MaxUint256 } from '@ethersproject/constants'
import { SwapTypes } from '@hadouken-project/sdk'
import { Vault } from '@hadouken-project/typechain'
import { IToken } from '@interfaces/token'
import { BigDecimal, ONE_PERCENT, removeSlippageFromValue } from '@utils/math'
import { replaceWrapEthToken } from '@utils/token/wEth'

import SorService from '../sor/sor.service'
import {
  FundManagement,
  SwapToken,
  SwapTokenType,
  SwapType,
  SwapV2,
} from './types'

export default class TradeService {
  private sorService = new SorService()

  constructor(public readonly vault: Vault) {}

  public async previewSwap(
    account: string,
    swapIn: SwapToken,
    swapInDecimals: number,
    swapOut: SwapToken,
    swapOutDecimals: number,
    amount: BigNumber,
    chainId: string,
  ): Promise<{
    tokensAddresses: IToken['address'][]
    swaps: SwapV2[]
    swapKind: SwapType
    amount: BigNumber
    limits: string[]
    funds: FundManagement
    fee: BigNumber
    spotPrice: string
    effectivePrice: BigDecimal
  }> {
    await this.sorService.fetchPools(chainId)
    const sorResult = await this.sorService.getBestSwap(
      swapIn.token,
      swapOut.token,
      swapInDecimals,
      swapOutDecimals,
      SwapTypes.SwapExactIn,
      amount,
      chainId,
    )

    const swapKind =
      swapOut.type === SwapTokenType.min
        ? SwapType.SwapExactIn
        : SwapType.SwapExactOut

    const funds = this.getFundManagement(account)

    const swaps = sorResult.result.swaps

    const limits = this.calculateLimits(
      [swapIn],
      [swapOut],
      sorResult.result.tokenAddresses,
    )

    const effectivePrice =
      sorResult.result.swapAmount.gt(0) && sorResult.result.swapAmount.gt(0)
        ? sorResult.result.swapAmount
            .mul(BigNumber.from(10).pow(18))
            .mul(BigNumber.from(10).pow(swapOutDecimals))
            .div(sorResult.result.returnAmount)
            .div(BigNumber.from(10).pow(swapInDecimals))
        : 0

    return {
      swapKind: swapKind,
      funds: funds,
      amount: sorResult.result.returnAmount,
      tokensAddresses: sorResult.result.tokenAddresses,
      swaps: swaps,
      fee: sorResult.result.returnAmount.sub(
        sorResult.result.returnAmountFromSwaps,
      ),
      limits: limits,
      spotPrice: sorResult.result.marketSp,
      effectivePrice: BigDecimal.from(effectivePrice, 18),
    }
  }

  public async previewBatchSwapTokensIn(
    tokensIn: string[],
    tokensOut: string[],
    amounts: BigNumberish[],
    swapType: SwapType,
    chainId: string,
  ): Promise<{
    amountsOut: BigNumber[]
    amountsIn: BigNumber[]
    swaps: SwapV2[]
    assets: string[]
    error?: string
  }> {
    await this.sorService.fetchPools(chainId)
    const swaps: SwapV2[][] = []
    const assetArray: string[][] = []
    for (let i = 0; i < tokensOut.length; i++) {
      const swap = await this.sorService.getSorSwapInfo(
        tokensIn[i],
        tokensOut[i],
        amounts[i] ?? BigNumber.from(0),
        swapType,
        chainId,
      )
      swaps.push(swap.swaps)
      assetArray.push(swap.tokenAddresses)
    }

    // Join swaps and assets together correctly
    const batchedSwaps = this.formatBatchSwaps(assetArray, swaps)

    const amountsOut = batchedSwaps.assets.map(() => BigNumber.from(0))
    const amountsIn = batchedSwaps.assets.map(() => BigNumber.from(0))
    try {
      // Onchain query
      const deltas = await this.previewBatchSwap(
        swapType === SwapType.SwapExactIn
          ? SwapTypes.SwapExactIn
          : SwapTypes.SwapExactOut,
        batchedSwaps.swaps,
        batchedSwaps.assets,
      )

      for (let i = 0; i < batchedSwaps.assets.length; i++) {
        const asset = batchedSwaps.assets[i]
        const tokenIndex = batchedSwaps.assets.indexOf(asset)
        const amountOut = deltas[tokenIndex].gte(BigNumber.from(0))
          ? BigNumber.from(0)
          : deltas[tokenIndex].mul(-1)
        const amountIn = deltas[tokenIndex].lte(BigNumber.from(0))
          ? BigNumber.from(0)
          : deltas[tokenIndex]

        amountsOut[i] = amountOut
        amountsIn[i] = amountIn
      }
    } catch (err) {
      console.error(`queryBatchSwapTokensIn error: ${err.message}`)
      return {
        amountsOut,
        amountsIn,
        swaps: batchedSwaps.swaps,
        assets: batchedSwaps.assets,
        error: err.message,
      }
    }

    return {
      amountsOut,
      amountsIn,
      swaps: batchedSwaps.swaps,
      assets: batchedSwaps.assets,
    }
  }

  public formatBatchSwaps(
    assetArray: string[][],
    swaps: SwapV2[][],
  ): { swaps: SwapV2[]; assets: string[] } {
    const newAssetArray = [...new Set(assetArray.flat())]

    // Update indices of each swap to use new asset array
    swaps.forEach((swap, i) => {
      swap.forEach((poolSwap) => {
        poolSwap.assetInIndex = newAssetArray.indexOf(
          assetArray[i][poolSwap.assetInIndex],
        )
        poolSwap.assetOutIndex = newAssetArray.indexOf(
          assetArray[i][poolSwap.assetOutIndex],
        )
      })
    })

    // Join Swaps into a single batchSwap
    const batchedSwaps = swaps.flat()
    return { swaps: batchedSwaps, assets: newAssetArray }
  }

  public async previewBatchSwap(
    swapType: SwapTypes,
    swaps: SwapV2[],
    assets: string[],
  ): Promise<BigNumber[]> {
    const funds: FundManagement = {
      sender: ethers.constants.AddressZero,
      recipient: ethers.constants.AddressZero,
      fromInternalBalance: false,
      toInternalBalance: false,
    }

    return await this.vault.callStatic.queryBatchSwap(
      swapType,
      swaps,
      assets,
      funds,
    )
  }

  public async batchSwap(
    tokensAddress: IToken['address'][],
    swaps: SwapV2[],
    limits: string[],
    swapType: SwapType,
    funds: FundManagement,
    chainId: string,
  ): Promise<TransactionResponse> {
    const config = getChainConfig(chainId)

    const firstTokenAddress = tokensAddress[swaps[0].assetInIndex]
    let ethValue = BigNumber.from(0)
    if (
      address(firstTokenAddress) ===
      address(config.nativeCurrency.wrapAddress ?? '')
    ) {
      ethValue = BigNumber.from(swaps[0].amount)
    }

    const tokensWithReplacedWrapEth = replaceWrapEthToken(
      chainId,
      tokensAddress,
    )

    const gasLimit = await this.vault.estimateGas.batchSwap(
      swapType,
      swaps,
      tokensWithReplacedWrapEth,
      funds,
      limits,
      MaxUint256,
      {
        value: ethValue,
      },
    )

    const txOverrides = {
      gasLimit,
      value: ethValue,
    }

    return await this.vault.batchSwap(
      swapType,
      swaps,
      tokensWithReplacedWrapEth,
      funds,
      limits,
      MaxUint256,
      txOverrides,
    )
  }

  public calculateLimits(
    swapsIn: SwapToken[],
    swapsOut: SwapToken[],
    tokenAddresses: string[],
    slippage = ONE_PERCENT,
  ): string[] {
    const limits: BigNumber[] = new Array(tokenAddresses.length).fill(
      BigNumber.from(0),
    )

    tokenAddresses.forEach((token, i) => {
      const swapIn = swapsIn.filter(
        (swapIn) => address(token) === address(swapIn.token),
      )
      const swapOut = swapsOut.filter(
        (swapOut) => address(token) === address(swapOut.token),
      )

      swapIn.forEach((swap) => {
        limits[i] = limits[i].add(swap.amount)
      })

      swapOut.forEach((swap) => {
        limits[i] = limits[i].add(
          removeSlippageFromValue(swap.amount, slippage).mul(-1),
        )
      })
    })

    return limits.map((limit) => limit.toString())
  }

  public getFundManagement(userAddress: string): FundManagement {
    const funds: FundManagement = {
      sender: userAddress,
      recipient: userAddress,
      fromInternalBalance: false,
      toInternalBalance: false,
    }

    return funds
  }
}
