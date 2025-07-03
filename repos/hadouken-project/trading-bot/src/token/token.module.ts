import { Module } from '@nestjs/common'
import { GodwokenTokenService } from './godwokenToken.service'
import { TokenService } from './token.service'
import { NETWORK_CONFIG } from '../helpers'

@Module({
  providers: [
    {
      provide: 'networkConfig',
      useFactory: (networkConfig: Record<string, string>) => networkConfig,
      inject: [NETWORK_CONFIG],
    },
    GodwokenTokenService,
    TokenService,
  ],
  exports: [GodwokenTokenService, TokenService],
})
export class TokenModule {}
