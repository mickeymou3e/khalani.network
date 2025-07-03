import { ArbitrageSwap__factory } from '@abi/factories/ArbitrageSwap__factory'
import { Injectable, Logger } from '@nestjs/common'
import { BigNumber } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import {
  treasuryAddress,
  yokaiRouterAddress,
  arbitrageSwapContractAddress,
} from '@config/arbitragePairs.json'
import { ArbitragePair } from '../lambdaTypes'
import { vaultAddress } from '@config/hadouken.json'
import { pools as yokaiPools } from '@config/yokai.json'
import { KMSSigner } from '@rumblefishdev/eth-signer-kms'
import { VaultAbi__factory } from '../../types/ethers-contracts'
import { SwapTypes, SwapV2 } from '@hadouken-project/sdk'
import { Treasury__factory } from '../../types/ethers-contracts/factories/Treasury__factory'
import { HadoukenSwapService } from '../hadouken-swap/hadouken-swap.service'
import { GodwokenTokenService } from '../token/godwokenToken.service'

const txOverrides = {
  gasLimit: 2_000_000,
}

export type FundManagement = {
  sender: string
  recipient: string
  fromInternalBalance: boolean
  toInternalBalance: boolean
}

export type SwapInfo = {
  swaps: SwapV2[]
  tokenAddresses: string[]
}

@Injectable()
export class ExecutionService {
  private readonly logger = new Logger(ExecutionService.name)
  constructor(
    private readonly signer: KMSSigner,
    private readonly hadoukenSwap: HadoukenSwapService,
    private readonly tokenService: GodwokenTokenService,
  ) {}

  async performTrade(tradeEvent: {
    arbitragePair: ArbitragePair
    quoteAmount: string
    baseAmount: string
    swapInfo: SwapInfo
  }): Promise<string> {
    const arbitrageSwap = ArbitrageSwap__factory.connect(
      arbitrageSwapContractAddress,
      this.signer,
    )

    const { poolNameForBuy, baseToken, quoteToken } = tradeEvent.arbitragePair
    const tradeVolume = BigNumber.from(tradeEvent.quoteAmount)
    const yokaiFirst = yokaiPools.some((pool) => pool.name === poolNameForBuy)
      ? 1
      : 0

    const baseTokenAddress =
      this.tokenService.findTokenBySymbol(baseToken).address
    const quoteTokenAddress =
      this.tokenService.findTokenBySymbol(quoteToken).address

    const { swaps, tokenAddresses } = tradeEvent.swapInfo
    const funds: FundManagement = {
      sender: arbitrageSwapContractAddress,
      recipient: arbitrageSwapContractAddress,
      fromInternalBalance: false,
      toInternalBalance: false,
    }

    const vault = VaultAbi__factory.connect(vaultAddress, this.signer)

    const limits = await vault.callStatic.queryBatchSwap(
      SwapTypes.SwapExactIn,
      swaps,
      tokenAddresses,
      funds,
    )
    const tokenOutAddress = yokaiFirst ? quoteTokenAddress : baseTokenAddress
    const tokenOutIndex = tokenAddresses.indexOf(
      tokenOutAddress.toLocaleLowerCase(),
    )
    const mutLimits = [...limits]
    mutLimits[tokenOutIndex] = this.subtractSlippageFromValue(
      mutLimits[tokenOutIndex],
      SwapTypes.SwapExactIn,
    )

    const hadoukenCallData = await vault.interface.encodeFunctionData(
      'batchSwap',
      [
        SwapTypes.SwapExactIn,
        swaps,
        tokenAddresses,
        funds,
        mutLimits,
        MaxUint256,
      ],
    )

    this.logger.log(`yokaiFirst: ${yokaiFirst}`)
    this.logger.log(`baseTokenAddress: ${baseTokenAddress}`)
    this.logger.log(`quoteTokenAddress: ${quoteTokenAddress}`)
    this.logger.log(`yokaiRouterAddress: ${yokaiRouterAddress}`)

    const tx = await arbitrageSwap.arbitrage(
      {
        quoteAmount: tradeVolume,
        baseTokenAddress,
        quoteTokenAddress,
        order: yokaiFirst,
        batchSwapCalldata: hadoukenCallData,
        yokaiPoolAddress: yokaiRouterAddress,
      },
      txOverrides, // TODO remove this after godwoken fixes estimate gas call
    )
    return tx.hash
  }

  async swapOnHadouken(tradeEvent: {
    baseAmount: string
    baseTokenSymbol: string
    quoteTokenSymbol: string
    poolNameForBuy: string
    poolNameForSell: string
  }): Promise<string> {
    const treasury = Treasury__factory.connect(treasuryAddress, this.signer)

    const { baseAmount, baseTokenSymbol, quoteTokenSymbol, poolNameForBuy } =
      tradeEvent
    const side = poolNameForBuy.startsWith('hadouken') ? 'BUY' : 'SELL'

    const funds: FundManagement = {
      sender: treasuryAddress,
      recipient: treasuryAddress,
      fromInternalBalance: false,
      toInternalBalance: false,
    }

    const vault = VaultAbi__factory.connect(vaultAddress, this.signer)

    const { tokenIn, tokenOut, swapType } =
      side === 'BUY'
        ? {
            tokenIn: quoteTokenSymbol,
            tokenOut: baseTokenSymbol,
            swapType: SwapTypes.SwapExactOut,
          }
        : {
            tokenIn: baseTokenSymbol,
            tokenOut: quoteTokenSymbol,
            swapType: SwapTypes.SwapExactIn,
          }

    const tokenInAddress = this.tokenService.findTokenBySymbol(tokenIn).address
    const tokenOutAddress =
      this.tokenService.findTokenBySymbol(tokenOut).address

    await this.hadoukenSwap.fetchPools()
    const { swaps, tokenAddresses } = await this.hadoukenSwap.getBestSwap(
      tokenIn,
      tokenOut,
      swapType,
      BigNumber.from(baseAmount),
    )

    const limits = await vault.callStatic.queryBatchSwap(
      swapType,
      swaps,
      tokenAddresses,
      funds,
    )
    const tokenLimitIndex = tokenAddresses.indexOf(
      swapType == SwapTypes.SwapExactIn
        ? tokenOutAddress.toLocaleLowerCase()
        : tokenInAddress.toLocaleLowerCase(),
    )
    const limitsWithSlippage = [...limits]
    limitsWithSlippage[tokenLimitIndex] = this.subtractSlippageFromValue(
      limitsWithSlippage[tokenLimitIndex],
      swapType,
    )
    this.logger.log(
      `Executing hadouken swap with parameters: ${JSON.stringify(
        swaps,
        null,
        2,
      )}`,
    )
    this.logger.log(
      `Passed limits with slippage: ${JSON.stringify(
        limitsWithSlippage,
        null,
        2,
      )}`,
    )

    const tx = await treasury.batchSwap(
      swapType,
      swaps,
      tokenAddresses,
      funds,
      limitsWithSlippage,
      MaxUint256,
      tokenInAddress,
      MaxUint256,
      txOverrides,
    )
    return tx.hash
  }

  private subtractSlippageFromValue(
    value: BigNumber,
    swapType: SwapTypes,
  ): BigNumber {
    const HUNDRED_PERCENTAGE = BigNumber.from(1000000)
    const slippage = BigNumber.from(50000)
    const slippageValue = value.mul(slippage).div(HUNDRED_PERCENTAGE)
    return swapType == SwapTypes.SwapExactIn
      ? value.sub(slippageValue)
      : value.add(slippageValue)
  }
}
