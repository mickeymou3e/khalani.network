import { Test, TestingModule } from '@nestjs/testing'
import { MainClient } from 'binance'
import { BigNumber } from 'ethers'
import { TokenModule } from '../token/token.module'
import { BalanceFetcherModule } from './balance-fetcher.module'
import { BalanceFetcherService } from './balance-fetcher.service'
import { NetworkConfigModule } from '../network-config/networkConfig.module'
import { GODWOKEN_MAINNET_CHAIN_ID } from '../liquidation-fetcher/liquidation-fetcher.constants'
import { ConfigModule } from '@nestjs/config'

describe('BinanceBotService', () => {
  let service: BalanceFetcherService

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
        NetworkConfigModule.forRoot(GODWOKEN_MAINNET_CHAIN_ID),
        BalanceFetcherModule,
        TokenModule,
      ],
    })
      .overrideProvider(MainClient)
      .useValue({
        getAccountInformation: jest.fn().mockResolvedValue({
          balances: [
            { asset: 'ETH', free: 13.0840029, locked: 0 },
            { asset: 'BUSD', free: 4951, locked: 0 },
          ],
        }),
      })
      .compile()

    service = module.get<BalanceFetcherService>(BalanceFetcherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Binance balances', () => {
    it('should return ETH balance in 18 decimals', async () => {
      const ethBalance = await service.getBinanceTokenBalance('ETH')

      expect(ethBalance).toEqual(BigNumber.from('13084002900000000000'))
    })
    it('should return BUSD balance in 6 decimals', async () => {
      const ethBalance = await service.getBinanceTokenBalance('BUSD')

      expect(ethBalance).toEqual(BigNumber.from('4951000000'))
    })
  })
})
