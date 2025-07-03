import https = require('https')
import * as AWSXRay from 'aws-xray-sdk'
import { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { EventBridgeEvent, Handler } from 'aws-lambda'
import { ArbitrageBotModule } from './arbitrageBot.module'
import { ArbitrageBotService } from './arbitrageBot.service'
import * as Sentry from '@sentry/serverless'
import { ConfigService } from '@nestjs/config'
import { LinearBotService } from './linear-bot/linearBot.service'
import { LinearBotModule } from './linear-bot/linearBot.module'
import { BinanceBotModule } from './binance-bot/binanceBot.module'
import { BinanceBotService } from './binance-bot/binanceBot.service'
import {
  ArbitrageProcessTxReceiptEvent,
  ArbitrageSendTxEvent,
  BinanceProcessTxReceiptEvent,
  CalculateTradeVolumeEvent,
  ChainId,
  ExecuteTradeOnBinance,
  ExecuteTradeOnHadouken,
  FindOpportunityBinanceHadouken,
  FindUserToLiquidateEvent,
  GetBinanceBalances,
  GetBinanceDepositAddress,
  GetIfIsOutOfRangeEvent,
  GetTxReceiptEvent,
  GetWithdrawHistory,
  LinearProcessTxReceiptEvent,
  LinearSendTxEvent,
  LiquidateUserEvent,
  LiquidationProcessTxReceiptEvent,
  SorChartEvent,
  TokenBalanceEvent,
  TokenTransferEvent,
  ValidateInputEvent,
  WithdrawFromBinance,
} from './lambdaTypes'
import { LiquidationModule } from './liquidation/liquidation.module'
import { LiquidationService } from './liquidation/liquidation.service'

type BridgeEventWithChainId = EventBridgeEvent<any, any> & ChainId

const nestArbitrageApps: Record<number, INestApplicationContext> = {}
const nestLinearApps: Record<number, INestApplicationContext> = {}
const nestBinanceApps: Record<number, INestApplicationContext> = {}
const nestLiquidationApps: Record<number, INestApplicationContext> = {}

async function getArbitrageApp(chainId: string) {
  if (!(chainId in nestArbitrageApps)) {
    nestArbitrageApps[chainId] = await NestFactory.createApplicationContext(
      ArbitrageBotModule.forRoot(chainId),
      {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
      },
    )
  }
  return nestArbitrageApps[chainId]
}

async function getLinearApp(chainId: string) {
  if (!(chainId in nestLinearApps)) {
    nestLinearApps[chainId] = await NestFactory.createApplicationContext(
      LinearBotModule.forRoot(chainId),
      {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
      },
    )
  }
  return nestLinearApps[chainId]
}

export async function getBinanceApp(chainId: string) {
  if (!(chainId in nestBinanceApps)) {
    const segment = AWSXRay.getSegment()
    if (segment) {
      AWSXRay.captureHTTPsGlobal(https)
    }
    nestBinanceApps[chainId] = await NestFactory.createApplicationContext(
      BinanceBotModule.forRoot(chainId),
      {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
      },
    )
  }
  return nestBinanceApps[chainId]
}

async function getLiquidationApp(chainId: string) {
  if (!nestLiquidationApps[chainId]) {
    const segment = AWSXRay.getSegment()
    if (segment) {
      AWSXRay.captureHTTPsGlobal(https)
    }
    nestLiquidationApps[chainId] = await NestFactory.createApplicationContext(
      LiquidationModule.forRoot(chainId),
      {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
      },
    )
  }
  return nestLiquidationApps[chainId]
}

const getSentryDsn = () => {
  const configService = new ConfigService()
  const sentryDsn = configService.get('SENTRY_DSN')
  return sentryDsn
}

const sentryDsn = getSentryDsn()
if (sentryDsn) {
  Sentry.AWSLambda.init({
    dsn: sentryDsn,
    tracesSampleRate: 0,
  })
}

function isEventBridgeEvent(event: any): event is EventBridgeEvent<any, any> {
  return event['detail-type'] !== undefined
}

const arbitrageLambdaHandler: Handler<
  | ValidateInputEvent
  | CalculateTradeVolumeEvent
  | ArbitrageSendTxEvent
  | GetTxReceiptEvent
  | ArbitrageProcessTxReceiptEvent
  | SorChartEvent
  | TokenTransferEvent
  | TokenBalanceEvent
  | BridgeEventWithChainId
> = async (event) => {
  const chainId = event.chainId
  const nestApp = await getArbitrageApp(chainId)
  const arbitrageBot = nestApp.get(ArbitrageBotService)

  if (isEventBridgeEvent(event)) {
    await arbitrageBot.notifyExecutionFailed(event)
    return
  }

  switch (event.stateName) {
    case 'ValidateInput': {
      return await arbitrageBot.validateInput(event)
    }
    case 'CalculateTradeVolume': {
      const {
        quoteAmount,
        baseAmount,
        profit,
        swapInfo,
        subgraphBlocksBehind,
      } = await arbitrageBot.findOpportunityForTrade(
        event.arbitragePair,
        event.subgraphBlocksBehind,
      )

      return {
        quoteAmount: quoteAmount.toString(),
        baseAmount: baseAmount.toString(),
        profit: profit.toString(),
        swapInfo: {
          tokenAddresses: swapInfo.tokenAddresses,
          swaps: swapInfo.swaps,
        },
        subgraphBlocksBehind,
      }
    }
    case 'SendTx': {
      const txHash = await arbitrageBot.sendTx(event)
      return { txHash }
    }
    case 'GetTxReceipt': {
      return arbitrageBot.getTxReceipt(event)
    }
    case 'ProcessTxReceipt': {
      return arbitrageBot.processTxReceipt(event)
    }
    case 'SorChartEvent': {
      return arbitrageBot.chartSor(event)
    }
    case 'TokenBalanceEvent': {
      return arbitrageBot.tokenBalanceOf(event)
    }
    case 'TokenTransferEvent': {
      return arbitrageBot.tokenTransfer(event)
    }
    default: {
      throw new Error(`Unknown event ${event}`)
    }
  }
}

export const linearLambdaHandler: Handler<
  | ValidateInputEvent
  | GetIfIsOutOfRangeEvent
  | LinearSendTxEvent
  | GetTxReceiptEvent
  | LinearProcessTxReceiptEvent
  | BridgeEventWithChainId
> = async (event) => {
  const chainId = event.chainId
  const nestApp = await getLinearApp(chainId)
  const linearBot = nestApp.get(LinearBotService)

  if (isEventBridgeEvent(event)) {
    await linearBot.notifyExecutionFailed(event)
    return
  }

  switch (event.stateName) {
    case 'ValidateInput': {
      return await linearBot.validateInput(event)
    }
    case 'GetIfIsOutOfRange': {
      return linearBot.GetIfIsOutOfRange(event)
    }
    case 'SendTx': {
      const txHash = await linearBot.balancePool(event)
      return { txHash }
    }
    case 'GetTxReceipt': {
      return linearBot.getTxReceipt(event)
    }
    case 'ProcessTxReceipt': {
      return linearBot.processTxReceipt(event)
    }
    default: {
      throw new Error(`Unknown event ${event}`)
    }
  }
}

export const binanceLambdaHandler: Handler<
  | ValidateInputEvent
  | FindOpportunityBinanceHadouken
  | ExecuteTradeOnBinance
  | ExecuteTradeOnHadouken
  | GetTxReceiptEvent
  | BinanceProcessTxReceiptEvent
  | GetBinanceBalances
  | WithdrawFromBinance
  | GetWithdrawHistory
  | GetBinanceDepositAddress
  | BridgeEventWithChainId
> = async (event) => {
  const chainId = event.chainId
  const nestApp = await getBinanceApp(chainId)
  const binanceBotService = nestApp.get(BinanceBotService)

  if (isEventBridgeEvent(event)) {
    await binanceBotService.notifyExecutionFailed(event)
    return
  }

  switch (event.stateName) {
    case 'ValidateInput': {
      return await binanceBotService.validateInput(event)
    }

    case 'GetBinanceBalances': {
      return await binanceBotService.getBinanceBalances(event)
    }

    case 'GetWithdrawHistory': {
      return await binanceBotService.getWithdrawHistory()
    }

    case 'GetBinanceDepositAddress': {
      return await binanceBotService.getBinanceDepositAddress(event)
    }

    case 'WithdrawFromBinance': {
      return await binanceBotService.withdrawFromBinance(event)
    }

    case 'FindOpportunity': {
      const {
        quoteAmount,
        baseAmount,
        notProfitable,
        binancePrice,
        subgraphBlocksBehind,
      } = await binanceBotService.findOpportunityBinanceHadouken(event)

      return {
        quoteAmount: quoteAmount.toString(),
        baseAmount: baseAmount.toString(),
        notProfitable,
        binancePrice: binancePrice.toString(),
        subgraphBlocksBehind,
      }
    }

    case 'ExecuteTradeOnBinance': {
      return binanceBotService.placeLimitOrder(event)
    }

    case 'ExecuteTradeOnHadouken': {
      const txHash = await binanceBotService.sendTx(event)
      return { txHash }
    }

    case 'GetTxReceipt': {
      return binanceBotService.getTxReceipt(event)
    }

    case 'ProcessTxReceipt': {
      return binanceBotService.processTxReceipt(event)
    }

    default: {
      throw new Error(`Unknown event ${event}`)
    }
  }
}

export const liquidationLambdaHandler: Handler<
  | ValidateInputEvent
  | FindUserToLiquidateEvent
  | LiquidateUserEvent
  | GetTxReceiptEvent
  | LiquidationProcessTxReceiptEvent
> = async (event) => {
  const chainId = event.chainId
  const nestApp = await getLiquidationApp(chainId)
  const liquidationService = nestApp.get(LiquidationService)

  switch (event.stateName) {
    case 'ValidateInput': {
      return liquidationService.validateInput(event)
    }
    case 'FindUserToLiquidate': {
      return await liquidationService.findUserToLiquidate(event)
    }
    case 'LiquidateUser': {
      return await liquidationService.liquidateUser(event)
    }
    case 'GetTxReceipt': {
      return await liquidationService.getTransactionReceipt(event)
    }
    case 'ProcessTxReceipt': {
      return await liquidationService.liquidationProcessTxReceipt(event)
    }
  }
}

export const arbitrageEntrypoint = Sentry.AWSLambda.wrapHandler(
  arbitrageLambdaHandler,
)
export const linearEntrypoint =
  Sentry.AWSLambda.wrapHandler(linearLambdaHandler)

export const binanceEntrypoint =
  Sentry.AWSLambda.wrapHandler(binanceLambdaHandler)

export const liquidationEntrypoint = Sentry.AWSLambda.wrapHandler(
  liquidationLambdaHandler,
)
