import { runSaga, useReduxSelector } from '@store/store.utils'
import { UsdToken } from './usdToken/usdToken'
import { Amount } from './amount'
import { MaxUint256 } from 'ethers-v6'
import { logger } from '@utils/logger'
import { Sdk } from './sdk'
import {
  UIIntentParams,
  CreateIntentResult,
  Intent,
  provideLiquiditySaga,
  swapIntentSaga,
} from '@store/swaps/create'

import { khalaniContractsSelectors } from '@store/contracts/khalani.contracts.selectors'
import {
  CreateRefineResult,
  createRefineSaga,
  CreateRefineSagaParams,
  QueryRefineResult,
  queryRefineSaga,
} from '@store/refine'
import { Network } from '@constants/Networks'
import { WithdrawMTokenParams, withdrawMTokenSaga } from '@store/withdrawMToken'
import { intentsSelectors } from '@store/intents'
import {
  WithdrawIntentBalanceParams,
  withdrawIntentBalanceSaga,
} from '@store/withdrawIntentBalance'

export interface SwapIntentPostResult {
  transactionHash: string
}

export class Intents {
  constructor(private sdk: Sdk) {}

  async buildSwapIntentPayload(
    sourceTokenAddress: UsdToken['address'],
    destinationTokenAddress: UsdToken['address'],
    destinationChain: number,
    srcAmount: Amount,
    sourceChain: Network,
    slippage?: number,
  ) {
    return {
      srcToken: sourceTokenAddress,
      srcAmount: srcAmount.baseUnits,
      destTokens: [destinationTokenAddress],
      destChains: [destinationChain],
      selectedChain: sourceChain,
      mAmounts: [srcAmount.baseUnits],
      slippage,
    }
  }

  async buildProvideLiquidityPayload(
    sourceTokenAddress: UsdToken['address'],
    destinationChains: Network[],
    srcAmount: Amount,
    feePercentage?: number,
  ) {
    return {
      srcToken: sourceTokenAddress,
      srcAmount: srcAmount.baseUnits,
      destChains: destinationChains.map((chain) => parseInt(chain, 16)),
      mAmounts: [srcAmount.baseUnits],
      feePercentage,
    }
  }

  async createRefine(
    payload: CreateRefineSagaParams,
  ): Promise<CreateRefineResult> {
    return (await runSaga(createRefineSaga, {
      payload,
      type: 'Intent',
    })) as CreateRefineResult
  }
  async queryRefine(payload: string): Promise<QueryRefineResult> {
    return (await runSaga(queryRefineSaga, {
      payload,
      type: 'string',
    })) as QueryRefineResult
  }

  async swapIntent(
    payload: Intent & { destChain: number },
  ): Promise<CreateIntentResult> {
    return (await runSaga(swapIntentSaga, {
      payload,
      type: 'string',
    })) as CreateIntentResult
  }

  async provideLiquidity(payload: UIIntentParams): Promise<CreateIntentResult> {
    return (await runSaga(provideLiquiditySaga, {
      payload,
      type: 'string',
    })) as CreateIntentResult
  }

  async withdrawMToken(payload: WithdrawMTokenParams): Promise<void> {
    await runSaga(withdrawMTokenSaga, {
      payload,
      type: 'string',
    })
  }

  async withdrawIntentBalance(
    payload: WithdrawIntentBalanceParams,
  ): Promise<void> {
    await runSaga(withdrawIntentBalanceSaga, {
      payload,
      type: 'string',
    })
  }

  async getIntentsHistory(): Promise<any> {
    const intentsHistory = useReduxSelector(intentsSelectors.selectAll)

    return intentsHistory
  }

  async approve(usdToken: UsdToken) {
    const amountToApprove = Amount.fromBaseUnits(MaxUint256, 6)
    logger.debug(
      `[PERMIT] Updating allowance of ${usdToken} to ${amountToApprove}`,
    )

    const userAddress = this.sdk.wallet().getUserAddress()
    if (!userAddress) {
      throw new Error('User address is required')
    }

    const permit2Address = await this.sdk.contracts().getPermit2Address()
    if (!permit2Address) {
      throw new Error('Permit2 address is required')
    }

    await this.sdk
      .allowances()
      .approveTo(usdToken, userAddress, permit2Address, amountToApprove)
  }
}
