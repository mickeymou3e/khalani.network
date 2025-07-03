import { Test, TestingModule } from '@nestjs/testing'
import { PoolService } from '@pool/pool.service'
import { PoolModule } from './pool.module'
import { NetworkConfigModule } from '../network-config/networkConfig.module'
import { GODWOKEN_MAINNET_CHAIN_ID } from '../liquidation-fetcher/liquidation-fetcher.constants'
import { ConfigModule } from '@nestjs/config'

describe('PoolService', () => {
  let service: PoolService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvVars: true,
          ignoreEnvFile: true,
          isGlobal: true,
          load: [
            () => ({
              KMS_KEY_ARN:
                'arn:aws:kms:us-east-1:803035318642:key/75517aeb-e410-409a-8b5e-cc117b8a0a57',
            }),
          ],
        }),
        PoolModule,
        NetworkConfigModule.forRoot(GODWOKEN_MAINNET_CHAIN_ID),
      ],
    }).compile()

    service = module.get<PoolService>(PoolService)
  })

  it('should be defined', async () => {
    expect(service).toBeDefined()
  })
})
