import { DynamicModule, Module } from '@nestjs/common'
import { LinearBotService } from './linearBot.service'
import { ConfigModule } from '@nestjs/config'
import { EthersProviderModule } from '../ethers-provider/ethers-provider.module'
import { DiscordNotifierModule } from '../discord-notifier/discord-notifier.module'
import { FormatterModule } from '../formatter/formatter.module'
import { NetworkConfigModule } from '../network-config/networkConfig.module'

@Module({})
export class LinearBotModule {
  static forRoot(chainId: string): DynamicModule {
    return {
      module: LinearBotModule,
      imports: [
        EthersProviderModule,
        DiscordNotifierModule,
        FormatterModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        NetworkConfigModule.forRoot(chainId),
      ],
      providers: [LinearBotService],
      exports: [LinearBotService],
    }
  }
}
