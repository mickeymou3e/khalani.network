import { Module } from '@nestjs/common'
import { BinanceClientModule } from '../binance-bot/binanceClient.module'
import { EthersProviderModule } from '../ethers-provider/ethers-provider.module'
import { BinanceBSCIntegrationService } from './binance-bsc-integration.service'
import { TokenModule } from '../token/token.module'

@Module({
  imports: [BinanceClientModule, EthersProviderModule, TokenModule],
  providers: [BinanceBSCIntegrationService],
  exports: [BinanceBSCIntegrationService],
})
export class BinanceBSCIntegrationModule {}
