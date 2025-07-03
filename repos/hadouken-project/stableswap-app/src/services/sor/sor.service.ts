import { BigNumber, BigNumberish } from 'ethers'

import { getChainConfig } from '@config'
import { address } from '@dataSource/graph/utils/formatters'
import {
  BalancerSDK,
  Network,
  PoolFilter,
  SOR,
  SwapInfo,
  SwapOptions,
  SwapTypes,
} from '@hadouken-project/sdk'

import { Network as NetworkId } from '../../constants/Networks'
import { config } from '../../utils/network'
import { SwapType } from '../trade/types'

export const getSDKByChainId = (chainId: string): BalancerSDK => {
  const chainConfig = getChainConfig(chainId)
  return new BalancerSDK({
    network: ((): Network => {
      if (chainId === NetworkId.GodwokenMainnet) {
        return Network.GODWOKEN_MAINNET
      } else if (chainId === NetworkId.GodwokenTestnet) {
        return Network.GODWOKEN_TESTNET
      } else if (chainId === NetworkId.ZksyncTestnet) {
        return Network.ZKSYNC_TESTNET
      } else if (chainId === NetworkId.ZksyncMainnet) {
        return Network.ZKSYNC_MAINNET
      } else if (chainId === NetworkId.MantleTestnet) {
        return Network.MANTLE_TESTNET
      } else if (chainId === NetworkId.MantleMainnet) {
        return Network.MANTLE_MAINNET
      }

      console.warn('No chain id detected - initializing with default SDK')
      return Network.GODWOKEN_TESTNET
    })(),
    rpcUrl: chainConfig.rpcUrl,
    customSubgraphUrl: chainConfig.subgraphs.balancer.httpUri,
    customLinearPools: chainConfig.customLinearPools,
  })
}

export interface SorReturn {
  tokenIn: string
  tokenOut: string
  returnDecimals: number
  hasSwaps: boolean
  returnAmount: BigNumber
  marketSpNormalized: string
  result: SwapInfo
}

export default class SorService {
  readonly sorList: Map<string, SOR>

  constructor() {
    this.sorList = new Map<string, SOR>(
      config.supportedNetworks.map((network: string) => [
        network,
        getSDKByChainId(network).sor,
      ]),
    )
  }

  async getBestSwap(
    tokenIn: string,
    tokenOut: string,
    tokenInDecimals: number,
    tokenOutDecimals: number,
    swapType: SwapTypes,
    amountScaled: BigNumber,
    chainId: string,
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

    const sor = this.sorList.get(chainId)
    if (!sor) throw `invalid chain id: ${chainId}`

    const swapInfoV2: SwapInfo = await sor.getSwaps(
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
      marketSpNormalized: swapInfoV2.marketSp,
    }
  }

  async getSorSwapInfo(
    tokenIn: string,
    tokenOut: string,
    amount: BigNumberish,
    swapType: SwapType,
    chainId: string,
  ): Promise<SwapInfo> {
    const sor = this.sorList.get(chainId)
    if (!sor) throw `invalid chain id: ${chainId}`

    const swapInfo = await sor.getSwaps(
      address(tokenIn),
      address(tokenOut),
      swapType === SwapType.SwapExactIn
        ? SwapTypes.SwapExactIn
        : SwapTypes.SwapExactOut,
      amount,
    )
    return swapInfo
  }

  async fetchPools(chainId: string): Promise<void> {
    try {
      const sor = this.sorList.get(chainId)
      if (!sor) throw `invalid chain id: ${chainId}`

      await sor.fetchPools()
    } catch (err) {
      console.error(`[error][Sor] fetch pools: ${(err as Error).message}`)
    }
  }
}
