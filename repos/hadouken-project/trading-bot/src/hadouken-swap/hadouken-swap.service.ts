import { PoolFilter, Sor, SwapOptions, SwapTypes } from '@hadouken-project/sdk'
import { Injectable } from '@nestjs/common'
import { BigNumber } from 'ethers'
import { PoolInformationFetcher } from '../data/data.types'
import { GodwokenTokenService } from '../token/godwokenToken.service'

@Injectable()
export class HadoukenSwapService implements PoolInformationFetcher {
  constructor(
    private readonly sor: Sor,
    private readonly tokenService: GodwokenTokenService,
  ) {}
  public readonly poolType = 'hadouken' as const

  async fetchPools() {
    await this.sor.fetchPools()
  }

  async getBestSwap(
    tokenIn: string,
    tokenOut: string,
    swapType: SwapTypes,
    amount: BigNumber,
  ) {
    const tokenInAddress = this.tokenService.findTokenBySymbol(tokenIn).address
    const tokenOutAddress =
      this.tokenService.findTokenBySymbol(tokenOut).address
    const timestampSeconds = Math.floor(Date.now() / 1000)

    const swapOptions: SwapOptions = {
      maxPools: 4,
      gasPrice: BigNumber.from(10).pow(11),
      swapGas: BigNumber.from(10).pow(5),
      poolTypeFilter: PoolFilter.All,
      timestamp: timestampSeconds,
      forceRefresh: false,
    }

    return await this.sor.getSwaps(
      tokenInAddress,
      tokenOutAddress,
      swapType,
      amount,
      swapOptions,
    )
  }

  async getOutGivenIn(
    tokenAmount: BigNumber,
    tokenIn: string,
    tokenOut: string,
  ): Promise<BigNumber> {
    const result = await this.getBestSwap(
      tokenIn,
      tokenOut,
      SwapTypes.SwapExactIn,
      tokenAmount,
    )
    return result.returnAmount
  }

  async getInGivenOut(
    tokenAmount: BigNumber,
    tokenIn: string,
    tokenOut: string,
  ): Promise<BigNumber> {
    const result = await this.getBestSwap(
      tokenIn,
      tokenOut,
      SwapTypes.SwapExactOut,
      tokenAmount,
    )
    return result.returnAmount
  }
}
