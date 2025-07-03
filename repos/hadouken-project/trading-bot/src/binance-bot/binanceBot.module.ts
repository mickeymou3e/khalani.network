import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BalanceModule } from '../balance/balance.module'
import { BinanceExecutionModule } from '../binance-execution/binance-execution.module'
import { BinanceFetcherModule } from '../binance-fetcher/binance-fetcher.module'
import { DataModule } from '../data/data.module'
import { DiscordNotifierModule } from '../discord-notifier/discord-notifier.module'
import { EthersProviderModule } from '../ethers-provider/ethers-provider.module'
import { ExecutionModule } from '../execution/execution.module'
import { OpportunityModule } from '../opportunity/opportunity.module'
import { TokenModule } from '../token/token.module'
import { BinanceBotService } from './binanceBot.service'
import { BinanceClientModule } from './binanceClient.module'
import { FormatterModule } from '../formatter/formatter.module'
import { BinanceBSCIntegrationModule } from '../binance-bsc-integration/binance-bsc-integration.module'
import { NetworkConfigModule } from '../network-config/networkConfig.module'

@Module({})
export class BinanceBotModule {
  static forRoot(chainId: string): DynamicModule {
    return {
      module: BinanceBotModule,
      imports: [
        ExecutionModule,
        BinanceFetcherModule,
        OpportunityModule,
        DataModule,
        EthersProviderModule,
        BinanceExecutionModule,
        BinanceClientModule,
        BalanceModule,
        DiscordNotifierModule,
        FormatterModule,
        TokenModule,
        BinanceBSCIntegrationModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        NetworkConfigModule.forRoot(chainId),
      ],
      providers: [BinanceBotService],
      exports: [BinanceBotService],
    }
  }
}
