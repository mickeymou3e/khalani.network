import { GraphQLRequestModule } from '@golevelup/nestjs-graphql-request'
import { Module } from '@nestjs/common'
import { PoolModule } from '../pool/pool.module'
import { BalanceModule } from '../balance/balance.module'
import { OpportunityService } from './opportunity.service'
import { ExecutionModule } from '../execution/execution.module'
import { DataModule } from '../data/data.module'
import { EthersProviderModule } from '../ethers-provider/ethers-provider.module'
import { DiscordNotifierModule } from '../discord-notifier/discord-notifier.module'
import { BinanceFetcherModule } from '../binance-fetcher/binance-fetcher.module'
import { NETWORK_CONFIG } from '../helpers'

@Module({
  imports: [
    PoolModule,
    BalanceModule,
    ExecutionModule,
    DataModule,
    EthersProviderModule,
    DiscordNotifierModule,
    GraphQLRequestModule.forRootAsync(GraphQLRequestModule, {
      useFactory: (networkConfig: Record<string, string>) => ({
        endpoint: networkConfig.lendingSubgraphAddress,
        options: {
          headers: {
            'content-type': 'application/json',
          },
        },
      }),
      inject: [NETWORK_CONFIG],
    }),
    BinanceFetcherModule,
  ],
  providers: [OpportunityService],
  exports: [OpportunityService],
})
export class OpportunityModule {}
