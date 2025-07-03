import { DynamicModule, Module } from '@nestjs/common'
import { ArbitrageBotService } from './arbitrageBot.service'
import { PoolModule } from './pool/pool.module'
import { OpportunityModule } from './opportunity/opportunity.module'
import { ExecutionModule } from './execution/execution.module'
import { DataModule } from './data/data.module'
import { ConfigModule } from '@nestjs/config'
import { EthersProviderModule } from './ethers-provider/ethers-provider.module'
import { DiscordNotifierModule } from './discord-notifier/discord-notifier.module'
import { ChartModule } from './chart/chart.module'
import { HadoukenSwapModule } from './hadouken-swap/hadouken-swap.module'
import { FormatterModule } from './formatter/formatter.module'
import { NetworkConfigModule } from './network-config/networkConfig.module'

@Module({})
export class ArbitrageBotModule {
  static forRoot(chainId: string): DynamicModule {
    return {
      module: ArbitrageBotModule,
      imports: [
        PoolModule,
        OpportunityModule,
        ExecutionModule,
        DataModule,
        EthersProviderModule,
        DiscordNotifierModule,
        FormatterModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        NetworkConfigModule.forRoot(chainId),
        ChartModule,
        HadoukenSwapModule,
      ],
      providers: [ArbitrageBotService],
    }
  }
}
