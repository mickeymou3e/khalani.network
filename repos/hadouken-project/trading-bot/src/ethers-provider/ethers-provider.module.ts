import { Module } from '@nestjs/common'
import { KMSSigner } from '@rumblefishdev/eth-signer-kms'
import { ethers } from 'ethers'
import * as KMS from 'aws-sdk/clients/kms'
import { JSON_RPC_PROVIDER, NETWORK_CONFIG } from '../helpers'
import { ConfigService } from '@nestjs/config'

@Module({
  providers: [
    {
      provide: JSON_RPC_PROVIDER,
      useFactory: (networkConfig: Record<string, string>) =>
        new ethers.providers.JsonRpcProvider(networkConfig.rpcUrl),
      inject: [NETWORK_CONFIG],
    },
    {
      provide: KMS,
      useClass: KMS,
    },
    {
      provide: KMSSigner,
      useFactory: (
        provider: ethers.providers.JsonRpcProvider,
        config: ConfigService,
        kms: KMS,
      ) => {
        return new KMSSigner(
          provider,
          config.get('KMS_KEY_ARN').split('/')[1],
          kms,
        )
      },
      inject: [JSON_RPC_PROVIDER, ConfigService, KMS],
    },
  ],
  exports: [JSON_RPC_PROVIDER, KMSSigner],
})
export class EthersProviderModule {}
