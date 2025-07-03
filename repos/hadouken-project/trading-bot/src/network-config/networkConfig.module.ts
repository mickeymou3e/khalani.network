import { DynamicModule, Global, Module } from '@nestjs/common'
import { NetworkConfigService } from './networkConfig.service'
import { NETWORK_CONFIG } from '../helpers'

@Global()
@Module({})
export class NetworkConfigModule {
  static forRoot(chainId: string): DynamicModule {
    return {
      module: NetworkConfigModule,
      providers: [
        {
          provide: NETWORK_CONFIG,
          useFactory: (configService: NetworkConfigService) => {
            return configService.getChainData(chainId)
          },
          inject: [NetworkConfigService],
        },
        NetworkConfigService,
      ],
      exports: [NETWORK_CONFIG],
    }
  }
}
