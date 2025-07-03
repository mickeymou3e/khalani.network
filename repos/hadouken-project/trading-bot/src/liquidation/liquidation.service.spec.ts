import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { LiquidationModule } from './liquidation.module'
import { LiquidationService } from './liquidation.service'
import { validateInput } from './validateInput'
import { EthersProviderModule } from '../ethers-provider/ethers-provider.module'
import {
  GODWOKEN_TESTNET_CHAIN_ID,
  ZKSYNC_TESTNET_CHAIN_ID,
} from '../liquidation-fetcher/liquidation-fetcher.constants'
import { MainClient } from 'binance'

describe('LiquidationService', () => {
  let service: LiquidationService

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
        LiquidationModule.forRoot(GODWOKEN_TESTNET_CHAIN_ID),
        EthersProviderModule,
      ],
    })
      .overrideProvider(MainClient)
      .useValue({})
      .compile()

    service = module.get<LiquidationService>(LiquidationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Validation of liquidation bot', () => {
    it('validate chain Id for godwoken', async () => {
      const event = {
        chainId: GODWOKEN_TESTNET_CHAIN_ID, // gw testnet
      }
      const result = await validateInput(event as any)

      expect(result).toEqual({
        ...event,
      })
    })
    it('validate chain Id for zkSync', async () => {
      const event = {
        chainId: ZKSYNC_TESTNET_CHAIN_ID, // zkSync testnet
      }
      const result = await validateInput(event as any)

      expect(result).toEqual({
        ...event,
      })
    })
    it('validation fails for ethereum', async () => {
      const event = {
        chainId: '1', // ethereum mainnet
      }
      const result = validateInput(event as any)

      await expect(result).rejects.toThrowError()
    })
  })
})
