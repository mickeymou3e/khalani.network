import { Injectable } from '@nestjs/common'
import { KMSSigner } from '@rumblefishdev/eth-signer-kms'
import { HadoukenSwapService } from '../hadouken-swap/hadouken-swap.service'
import { VaultAbi__factory } from '../../types/ethers-contracts'
import { vaultAddress } from '@config/hadouken.json'
import { FundManagement } from '../execution/execution.service'
import { BigNumber } from 'ethers'
import { SwapTypes } from '@hadouken-project/sdk'

type ChartResult = {
  input: string[]
  resultSor: string[]
  resultQueryBatchSwap: string[]
}

@Injectable()
export class ChartService {
  constructor(
    private readonly signer: KMSSigner,
    private readonly hadoukenSwap: HadoukenSwapService,
  ) {}

  public async chart({
    from,
    to,
    step,
    tokenIn,
    tokenOut,
  }: {
    from: BigNumber
    to: BigNumber
    step: BigNumber
    tokenIn: string
    tokenOut: string
  }): Promise<ChartResult> {
    const input = []
    const resultSor = []
    const resultQueryBatchSwap = []
    let iterator = from

    await this.hadoukenSwap.fetchPools()

    const vault = VaultAbi__factory.connect(vaultAddress, this.signer)
    const funds: FundManagement = {
      sender: vaultAddress,
      recipient: vaultAddress,
      fromInternalBalance: false,
      toInternalBalance: false,
    }

    while (iterator.lte(to)) {
      const { returnAmount, swaps, tokenAddresses } =
        await this.hadoukenSwap.getBestSwap(
          tokenIn,
          tokenOut,
          SwapTypes.SwapExactIn,
          iterator,
        )
      const qbs = await vault.callStatic.queryBatchSwap(
        SwapTypes.SwapExactIn,
        swaps,
        tokenAddresses,
        funds,
        // { blockTag: 530465 },
      )

      console.log({ returnAmount, swaps, tokenAddresses })
      input.push(iterator.toString())
      resultSor.push(returnAmount.toString())
      const resultQbs = qbs.find((e) => e.isNegative())
      resultQueryBatchSwap.push(resultQbs.toString().substring(1))
      iterator = iterator.add(step)
    }

    return { input, resultSor, resultQueryBatchSwap }
  }
}
