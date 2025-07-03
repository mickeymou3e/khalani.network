import { Sor } from '@hadouken-project/sdk'
import { Module } from '@nestjs/common'
import { TokenModule } from '../token/token.module'
import { HadoukenSwapService } from './hadouken-swap.service'
import { NETWORK_CONFIG } from '../helpers'

@Module({
  imports: [TokenModule],
  providers: [
    HadoukenSwapService,
    {
      provide: Sor,
      useFactory: (networkConfig: Record<string, string>) =>
        new Sor({
          network: Number(networkConfig.chainId),
          rpcUrl: networkConfig.rpcUrl,
          customSubgraphUrl: networkConfig.balancerSubgraphAddress,
          sor: {
            tokenPriceService: {
              async getNativeAssetPriceInToken(_tokenAddress: string) {
                return '1'
              },
            },
          },
        }),
      inject: [NETWORK_CONFIG],
    },
  ],
  exports: [HadoukenSwapService, Sor],
})
export class HadoukenSwapModule {}
