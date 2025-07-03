import { TOKENS_BY_CHAIN } from './tokens'
import { Inject, Injectable } from '@nestjs/common'
import { BaseTokenService } from './baseToken.service'

@Injectable()
export class TokenService extends BaseTokenService {
  constructor(
    @Inject('networkConfig')
    private readonly networkConfig: any,
  ) {
    const chainId = networkConfig.chainId

    super(TOKENS_BY_CHAIN[chainId])
  }
}
