import { BigNumber, BigNumberish, constants } from 'ethers'

import { SwapTypes } from '@balancer-labs/sor'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { MaxUint256 } from '@ethersproject/constants'
import { Vault } from '@hadouken-project/swap-contracts-v2'
import { IToken } from '@interfaces/token'

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
  ): Promise<{
    tokensAddresses: IToken['address'][]
    swaps: SwapV2[]
    swapKind: SwapType
    amount: BigNumber
    limits: string[]
    funds: FundManagement
    fee: BigNumber
  }> {
    await this.sorService.fetchPools()
    const sorResult = await this.sorService.getBestSwap(
      swapIn.token,
      swapOut.token,
      swapInDecimals,
      swapOutDecimals,
      SwapTypes.SwapExactIn,
      amount,
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
    }
  }

  public async previewBatchSwapTokensIn(
    tokensIn: string[],
    tokensOut: string[],
    amounts: BigNumberish[],
    swapType: SwapType,
  ): Promise<{
    amountsOut: BigNumber[]
    amountsIn: BigNumber[]
    swaps: SwapV2[]
    assets: string[]
  }> {
    await this.sorService.fetchPools()
    const swaps: SwapV2[][] = []
    const assetArray: string[][] = []
    for (let i = 0; i < tokensOut.length; i++) {
      const swap = await this.sorService.getSorSwapInfo(
        tokensIn[i],
        tokensOut[i],
        amounts[i],
        swapType,
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
  ) {
    const funds: FundManagement = {
      sender: constants.AddressZero,
      recipient: constants.AddressZero,
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

  public encodeBatchSwapABI(
    tokensAddress: IToken['address'][],
    swaps: SwapV2[],
    limits: string[],
    swapType: SwapType,
    funds: FundManagement,
  ): string {
    return this.vault.interface.encodeFunctionData('batchSwap', [
      swapType,
      swaps,
      tokensAddress,
      funds,
      limits,
      MaxUint256,
    ])
  }

  public async batchSwap(
    tokensAddress: IToken['address'][],
    swaps: SwapV2[],
    limits: string[],
    swapType: SwapType,
    funds: FundManagement,
  ): Promise<TransactionResponse> {
    const gasLimit = await this.vault.estimateGas.batchSwap(
      swapType,
      swaps,
      tokensAddress,
      funds,
      limits,
      MaxUint256,
    )

    return await this.vault.batchSwap(
      swapType,
      swaps,
      tokensAddress,
      funds,
      limits,
      MaxUint256,
      {
        gasLimit,
        gasPrice: 40000000000000,
      },
    )
  }

  public calculateLimits(
    swapsIn: SwapToken[],
    swapsOut: SwapToken[],
    tokenAddresses: string[],
  ): string[] {
    const limits: string[] = []

    tokenAddresses.forEach((token, i) => {
      const swapIn = swapsIn.find(
        (swapIn) => token.toLowerCase() === swapIn.token.toLowerCase(),
      )
      const swapOut = swapsOut.find(
        (swapOut) => token.toLowerCase() === swapOut.token.toLowerCase(),
      )
      if (swapIn) {
        limits[i] = swapIn.amount.toString()
      } else if (swapOut) {
        limits[i] = swapOut.amount.mul(95).div(100).mul(-1).toString()
      } else {
        limits[i] = '0'
      }
    })

    return limits
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
