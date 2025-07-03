import { Module } from '@nestjs/common'
import { PoolModule } from '@pool/pool.module'
import { BinanceClientModule } from '../binance-bot/binanceClient.module'
import { HadoukenSwapModule } from '../hadouken-swap/hadouken-swap.module'
import { TokenModule } from '../token/token.module'
import { DataService } from './data.service'

@Module({
  imports: [PoolModule, HadoukenSwapModule, BinanceClientModule, TokenModule],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
