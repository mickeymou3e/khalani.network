import { Injectable } from '@nestjs/common'
import { tokens as gwTokens } from '@config/tokens.json'
import { BaseTokenService } from './baseToken.service'

@Injectable()
export class GodwokenTokenService extends BaseTokenService {
  constructor() {
    super(gwTokens)
  }
}
