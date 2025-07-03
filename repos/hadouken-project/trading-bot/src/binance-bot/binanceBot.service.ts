import { Inject, Injectable, Logger } from '@nestjs/common'
import { OpportunityService } from '../opportunity/opportunity.service'
import { BigNumber, ethers } from 'ethers'
import { validateInput } from './validateInput'
import { DiscordNotifierService } from '../discord-notifier/discord-notifier.service'
import { ExecutionService } from '../execution/execution.service'
import {
  BinanceProcessTxReceiptEvent,
  FindOpportunityBinanceHadouken,
} from '../lambdaTypes'
import { BinanceExecutionService } from '../binance-execution/binance-execution.service'
import {
  BinanceNotificationFormatterService,
  EventBridgeEventFormatterService,
} from '../formatter/formatters'
import { BalanceService } from '../balance/balance.service'
import { EventBridgeEvent } from 'aws-lambda'
import { BinanceBSCIntegrationService } from '../binance-bsc-integration/binance-bsc-integration.service'
import { JSON_RPC_PROVIDER } from '../helpers'

@Injectable()
export class BinanceBotService {
  private readonly logger = new Logger(BinanceBotService.name)
  constructor(
    @Inject(JSON_RPC_PROVIDER)
    private readonly provider: ethers.providers.JsonRpcProvider,
    private opportunityService: OpportunityService,
    private discordNotifierService: DiscordNotifierService,
    private executionService: ExecutionService,
    private binanceExecutionService: BinanceExecutionService,
    private balanceService: BalanceService,
    private readonly formatter: BinanceNotificationFormatterService,
    private readonly eventBridgeFormatter: EventBridgeEventFormatterService,
    private readonly binanceBSCIntegrationService: BinanceBSCIntegrationService,
  ) {}

  async validateInput(event) {
    return await validateInput(event)
  }

  async getBinanceDepositAddress(event) {
    const address = await this.binanceBSCIntegrationService.depositAddress(
      event.tokenSymbol,
    )
    this.logger.log(`Deposit address of token ${event.tokenSymbol}: ${address}`)
    return address
  }

  async withdrawFromBinance(event) {
    const { tokenSymbol, amount, recipientAddress, network } = event
    this.logger.log('Starting withdraw operation')
    const res = await this.binanceBSCIntegrationService.withdraw(
      tokenSymbol,
      amount,
      recipientAddress,
      network,
    )
    this.logger.log('Withdraw completed')
    this.logger.log(res)
    return res
  }

  async getBinanceBalances(event) {
    const res = await this.binanceBSCIntegrationService.getBalances()
    const { symbol } = event
    const amount = res.filter(({ coin }) => coin === symbol)[0].free
    this.logger.log(`Balance of token ${symbol}: ${amount}`)
  }

  async getWithdrawHistory() {
    const res = await this.binanceBSCIntegrationService.getWithdrawHistory()
    this.logger.log(res)
  }

  async findOpportunityBinanceHadouken(event: FindOpportunityBinanceHadouken) {
    const balanceInformation =
      await this.balanceService.getBalancesBinanceHadouken(event)

    const { quoteAmount, baseAmount, binancePrice, subgraphBlocksBehind } =
      await this.opportunityService.findOpportunityForTrade({
        poolNameForBuy: event.poolNameForBuy,
        poolNameForSell: event.poolNameForSell,
        baseToken: event.baseTokenSymbol,
        quoteToken: event.quoteTokenSymbol,
        quoteTokenThreshold: BigNumber.from(event.quoteTokenThreshold),
        minProfit: BigNumber.from(event.minProfit),
        flashLoanCost: BigNumber.from(0),
        subgraphBlocksBehind: event.subgraphBlocksBehind,
      })
    if (quoteAmount.isZero() || baseAmount.isZero()) {
      return {
        quoteAmount,
        baseAmount,
        notProfitable: 'true',
        binancePrice: BigNumber.from('0'),
        subgraphBlocksBehind,
      }
    }
    const trimmedBalances =
      await this.balanceService.trimBalancesBinanceHadouken({
        ...balanceInformation,
        quoteAmount,
        baseAmount,
      })
    return {
      quoteAmount: trimmedBalances.quoteAmount,
      baseAmount: trimmedBalances.baseAmount,
      notProfitable:
        trimmedBalances.quoteAmount.isZero() ||
        trimmedBalances.baseAmount.isZero()
          ? 'true'
          : null,
      binancePrice,
      subgraphBlocksBehind,
    }
  }

  async placeLimitOrder(event: {
    poolNameForBuy: string
    poolNameForSell: string
    binancePrice: string
    quoteAmount: string
    baseAmount: string
    baseTokenSymbol: string
    quoteTokenSymbol: string
  }) {
    const { quoteAmount, baseAmount, binanceFee } =
      await this.binanceExecutionService.executeTrade(event)
    return {
      quoteAmount: quoteAmount.toString(),
      baseAmount: baseAmount.toString(),
      binanceFee: binanceFee.toString(),
    }
  }

  async sendTx(event: {
    baseAmount: string
    baseTokenSymbol: string
    quoteTokenSymbol: string
    poolNameForBuy: string
    poolNameForSell: string
  }): Promise<string> {
    return await this.executionService.swapOnHadouken(event)
  }

  async getTxReceipt(event: { txHash: string }) {
    const receipt = await this.provider.getTransactionReceipt(event.txHash)
    return receipt
  }

  async processTxReceipt(event: BinanceProcessTxReceiptEvent) {
    const tx = await this.provider.getTransaction(
      event.txReceipt.transactionHash,
    )
    const message = await this.formatter.getFormattedText(event, tx.gasPrice)
    await this.discordNotifierService.sendNotification(message)
    return
  }

  async notifyExecutionFailed(event: EventBridgeEvent<any, any>) {
    const message = this.eventBridgeFormatter.getFormattedText(event)
    await this.discordNotifierService.sendNotification(message)
  }
}
