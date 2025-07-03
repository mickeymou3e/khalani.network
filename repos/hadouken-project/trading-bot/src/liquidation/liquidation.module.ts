import { LiquidationService } from './liquidation.service'
import { ConfigModule } from '@nestjs/config'
import { DiscordNotifierModule } from '../discord-notifier/discord-notifier.module'
import { EthersProviderModule } from '../ethers-provider/ethers-provider.module'
import { FormatterModule } from '../formatter/formatter.module'
import { LiquidationFetcherModule } from '../liquidation-fetcher/liquidaiton-fetcher.module'
import { LendingMathModule } from '../lending-math/lending-math.module'
import { NetworkConfigModule } from '../network-config/networkConfig.module'
import { DynamicModule, Module } from '@nestjs/common'

@Module({})
export class LiquidationModule {
  static forRoot(chainId: string): DynamicModule {
    return {
      module: LiquidationModule,
      imports: [
        EthersProviderModule,
        DiscordNotifierModule,
        FormatterModule,
        LiquidationFetcherModule,
        LendingMathModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        NetworkConfigModule.forRoot(chainId),
      ],
      providers: [LiquidationService],
      exports: [LiquidationService],
    }
  }
}
