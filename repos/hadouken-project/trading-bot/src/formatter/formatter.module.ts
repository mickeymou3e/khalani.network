import { Module } from '@nestjs/common'
import {
  ArbitrageNotificationFormatterService,
  BinanceNotificationFormatterService,
  LinearNotificationFormatterService,
  EventBridgeEventFormatterService,
  LiquidationFormatterService,
} from './formatters'
import { TokenModule } from '../token/token.module'
import { BalanceFetcherModule } from '../balance-fetcher/balance-fetcher.module'

@Module({
  imports: [TokenModule, BalanceFetcherModule],
  providers: [
    LinearNotificationFormatterService,
    BinanceNotificationFormatterService,
    ArbitrageNotificationFormatterService,
    EventBridgeEventFormatterService,
    LiquidationFormatterService,
  ],
  exports: [
    LinearNotificationFormatterService,
    BinanceNotificationFormatterService,
    ArbitrageNotificationFormatterService,
    EventBridgeEventFormatterService,
    LiquidationFormatterService,
  ],
})
export class FormatterModule {}
