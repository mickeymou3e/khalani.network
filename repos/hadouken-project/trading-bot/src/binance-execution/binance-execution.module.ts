import { Module } from '@nestjs/common'
import { BinanceClientModule } from '../binance-bot/binanceClient.module'
import { BinanceExecutionService } from './binance-execution.service'
import { TokenModule } from '../token/token.module'

@Module({
  imports: [BinanceClientModule, TokenModule],
  providers: [BinanceExecutionService],
  exports: [BinanceExecutionService],
})
export class BinanceExecutionModule {}
