import { Module } from '@nestjs/common'
import { BinanceClientModule } from '../binance-bot/binanceClient.module'
import { BinanceFetcherService } from './binance-fetcher.service'

@Module({
  imports: [BinanceClientModule],
  exports: [BinanceFetcherService],
  providers: [BinanceFetcherService],
})
export class BinanceFetcherModule {}
