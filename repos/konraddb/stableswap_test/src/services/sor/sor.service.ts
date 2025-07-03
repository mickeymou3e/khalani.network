import { BigNumber, BigNumberish } from 'ethers'

import config from '@config'
import {
  BalancerSDK,
  Network,
  PoolFilter,
  SOR,
  SwapInfo,
  SwapOptions,
  SwapTypes,
} from '@tvl-labs/swap-v2-sdk'

import { SwapType } from '../trade/types'

export const balancerSDK = new BalancerSDK({
  network: ((): Network => {
    if (process.env.CONFIG === 'prod') {
      return Network.MAINNET
    } else if (process.env.CONFIG === 'testnet') {
      return Network.TESTNET
    } else if (process.env.CONFIG === 'beta') {
      return Network.MAINNET
    } else if (process.env.CONFIG === 'local') {
      return Network.TESTNET
    } else if (process.env.CONFIG === 'axon') {
      return Network.AXON_TESTNET
    }

    console.warn('balancerSDK env not set up')
    return Network.TESTNET
  })(),
  rpcUrl: config.godwoken.rpcUrl,
})

export interface SorReturn {
  tokenIn: string
  tokenOut: string
  returnDecimals: number
  hasSwaps: boolean
  returnAmount: BigNumber
  marketSpNormalised: string
  result: SwapInfo
}

export default class SorService {
  readonly sor: SOR

  constructor() {
    this.sor = balancerSDK.sor
  }

  async getBestSwap(
    tokenIn: string,
    tokenOut: string,
    tokenInDecimals: number,
    tokenOutDecimals: number,
    swapType: SwapTypes,
    amountScaled: BigNumber,
  ): Promise<SorReturn> {
    const timestampSeconds = Math.floor(Date.now() / 1000)

    const swapOptions: SwapOptions = {
      maxPools: 4,
      gasPrice: BigNumber.from(100000000000),
      swapGas: BigNumber.from(100000),
      poolTypeFilter: PoolFilter.All,
      timestamp: timestampSeconds,
      forceRefresh: true,
    }

    const swapInfoV2: SwapInfo = await this.sor.getSwaps(
      tokenIn,
      tokenOut,
      swapType,
      amountScaled,
      swapOptions,
    )

    return {
      tokenIn,
      tokenOut,
      returnDecimals:
        swapType === SwapTypes.SwapExactIn ? tokenOutDecimals : tokenInDecimals,
      hasSwaps: swapInfoV2.swaps.length > 0,
      returnAmount: swapInfoV2.returnAmount,
      result: swapInfoV2,
      marketSpNormalised: swapInfoV2.marketSp,
    }
  }

  async getSorSwapInfo(
    tokenIn: string,
    tokenOut: string,
    amount: BigNumberish,
    swapType: SwapType,
  ): Promise<SwapInfo> {
    const swapInfo = await this.sor.getSwaps(
      tokenIn.toLowerCase(),
      tokenOut.toLowerCase(),
      swapType === SwapType.SwapExactIn
        ? SwapTypes.SwapExactIn
        : SwapTypes.SwapExactOut,
      amount,
    )
    return swapInfo
  }

  async fetchPools(): Promise<void> {
    try {
      await this.sor.fetchPools()
    } catch (err) {
      console.log(`[error][Sor] fetch pools: ${(err as Error).message}`)
    }
  }
}
