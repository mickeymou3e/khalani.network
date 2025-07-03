import { Module } from '@nestjs/common'
import { LiquidationFetcherService } from './liquidaiton-fetcher.service'
import { GraphQLRequestModule } from '@golevelup/nestjs-graphql-request'
import { EthersProviderModule } from '../ethers-provider/ethers-provider.module'
import { NETWORK_CONFIG } from '../helpers'

@Module({
  imports: [
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
    EthersProviderModule,
  ],
  providers: [LiquidationFetcherService],
  exports: [LiquidationFetcherService],
})
export class LiquidationFetcherModule {}
