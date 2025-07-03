import * as fs from 'fs'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ExecutionService, SwapInfo } from './execution/execution.service'
import {
  ArbitrageParams,
  OpportunityService,
} from './opportunity/opportunity.service'
import { BigNumber, ethers } from 'ethers'
import { ArbitragePair, SorChartEvent } from './lambdaTypes'
import { DiscordNotifierService } from './discord-notifier/discord-notifier.service'
import {
  ArbitrageNotificationFormatterService,
  EventBridgeEventFormatterService,
  TransactionReceiptPassedThroughEvent,
} from './formatter/formatters'
import { validateInput } from './validate'
import { flashLoanCost } from '@config/arbitragePairs.json'
import { ChartService } from './chart/chart.service'
import { KMSSigner } from '@rumblefishdev/eth-signer-kms'
import { IERC20Abi__factory } from '../types/ethers-contracts/factories/artifacts/contracts/interfaces/IERC20.sol'
import { EventBridgeEvent } from 'aws-lambda'
import { JSON_RPC_PROVIDER } from './helpers'

@Injectable()
export class ArbitrageBotService {
  private readonly logger = new Logger(ArbitrageBotService.name)

  constructor(
    private readonly kmsSinger: KMSSigner,
    @Inject(JSON_RPC_PROVIDER)
    private readonly provider: ethers.providers.Provider,
    private readonly opportunityService: OpportunityService,
    private readonly executionService: ExecutionService,
    private readonly discordNotifierService: DiscordNotifierService,
    private readonly chartService: ChartService,
    private readonly formatter: ArbitrageNotificationFormatterService,
    private readonly eventBridgeFormatter: EventBridgeEventFormatterService,
  ) {}

  async validateInput(event) {
    return await validateInput(event)
  }

  async findOpportunityForTrade(
    {
      poolNameForBuy,
      poolNameForSell,
      baseToken,
      quoteToken,
      quoteTokenThreshold,
      minProfit,
    }: ArbitragePair,
    blockDiff: number,
  ): Promise<ArbitrageParams> {
    this.logger.log('|| Arbitrage pairs trade process started ||')

    const { quoteAmount, baseAmount, profit, swapInfo, subgraphBlocksBehind } =
      await this.opportunityService.findOpportunityForTrade({
        poolNameForBuy,
        poolNameForSell,
        baseToken,
        quoteToken,
        quoteTokenThreshold: BigNumber.from(quoteTokenThreshold),
        minProfit: BigNumber.from(minProfit),
        flashLoanCost: BigNumber.from(flashLoanCost),
        subgraphBlocksBehind: blockDiff,
      })
    return { quoteAmount, baseAmount, profit, swapInfo, subgraphBlocksBehind }
  }

  async sendTx(event: {
    arbitragePair: ArbitragePair
    quoteAmount: string
    baseAmount: string
    swapInfo: SwapInfo
  }) {
    return await this.executionService.performTrade(event)
  }
  async getTxReceipt(event: { txHash: string }) {
    const receipt = await this.provider.getTransactionReceipt(event.txHash)
    return receipt
  }
  async processTxReceipt(event: {
    txReceipt: TransactionReceiptPassedThroughEvent
    arbitragePair: ArbitragePair
    quoteAmount: string
  }) {
    const tx = await this.provider.getTransaction(
      event.txReceipt.transactionHash,
    )

    const message = await this.formatter.getFormattedText(
      event.txReceipt,
      event.arbitragePair,
      event.quoteAmount,
      tx.gasPrice,
    )

    await this.discordNotifierService.sendNotification(message)

    return
  }
  async chartSor(event: SorChartEvent) {
    const { input, resultSor, resultQueryBatchSwap } =
      await this.chartService.chart(event)

    const sorFile = fs.createWriteStream(
      `${event.tokenIn}-${event.tokenOut}.txt`,
    )
    input.forEach((value, index) =>
      sorFile.write(
        `${value} ${resultSor[index]} ${resultQueryBatchSwap[index]}\n`,
      ),
    )
  }
  async tokenTransfer({ tokenAddress, amount, recipient }) {
    const token = IERC20Abi__factory.connect(tokenAddress, this.kmsSinger)
    Logger.log(
      `Sending ${amount.toString()} of ${tokenAddress} to ${recipient}`,
    )
    const txReceipt = await token.transfer(recipient, amount)
    await txReceipt.wait()
    Logger.log(`Transaction confirmed`)
  }

  async tokenBalanceOf({ tokenAddress, walletAddress }) {
    const token = IERC20Abi__factory.connect(tokenAddress, this.kmsSinger)
    Logger.log(
      `Checking balance of ${tokenAddress} for address ${walletAddress}`,
    )
    const balance = await token.balanceOf(walletAddress)
    Logger.log(`balance: ${balance.toString()}`)
  }

  async notifyExecutionFailed(event: EventBridgeEvent<any, any>) {
    const message = this.eventBridgeFormatter.getFormattedText(event)
    await this.discordNotifierService.sendNotification(message)
  }
}
