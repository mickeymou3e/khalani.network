import { Module } from '@nestjs/common'
import { BinanceClientModule } from '../binance-bot/binanceClient.module'
import { EthersProviderModule } from '../ethers-provider/ethers-provider.module'
import { BalanceFetcherService } from './balance-fetcher.service'
import { TokenModule } from '../token/token.module'

@Module({
  imports: [EthersProviderModule, BinanceClientModule, TokenModule],
  providers: [BalanceFetcherService],
  exports: [BalanceFetcherService],
})
export class BalanceFetcherModule {}
