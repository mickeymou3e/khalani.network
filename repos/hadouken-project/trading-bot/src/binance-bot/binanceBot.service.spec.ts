import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { MainClient } from 'binance'
import { TokenModule } from '../token/token.module'
import { BinanceBotModule } from './binanceBot.module'
import { BinanceBotService } from './binanceBot.service'
import { validateInput } from './validateInput'
import { GODWOKEN_MAINNET_CHAIN_ID } from '../liquidation-fetcher/liquidation-fetcher.constants'

describe('BinanceBotService', () => {
  let service: BinanceBotService

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
        BinanceBotModule.forRoot(GODWOKEN_MAINNET_CHAIN_ID),
        TokenModule,
      ],
    })
      .overrideProvider(MainClient)
      .useValue({})
      .compile()

    service = module.get<BinanceBotService>(BinanceBotService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Validation', () => {
    it('validateInput passes', async () => {
      const event = {
        poolNameForBuy: 'binanceETHUSDC',
        poolNameForSell: 'hadoukenEthUsdc',
        baseTokenSymbol: 'ETH',
        quoteTokenSymbol: 'USDT',
        quoteTokenThreshold: '1',
        minProfit: '0',
        chainId: GODWOKEN_MAINNET_CHAIN_ID,
      }
      const result = await validateInput(event as any)

      expect(result).toEqual({
        ...event,
        findOpportunityResult: { subgraphBlocksBehind: 0 },
      })
    })
    it('validateInput does not pass', async () => {
      const event = {
        poolNameForBuy: 'binanceETHUSDC',
        poolNameForSell: 'hadoukenEthUsdc',
        baseTokenSymbol: 'ETH',
        quoteTokenSymbol: 'USDT',
        quoteTokenThreshold: 1,
        minProfit: '0',
      }
      const result = validateInput(event as any)

      await expect(result).rejects.toThrowError()
    })
    it('validateInput does not pass', async () => {
      const event = {
        poolNameForBuy: 'binanceETHUSDC',
        baseTokenSymbol: 'ETH',
        quoteTokenSymbol: 'USDT',
        quoteTokenThreshold: '1',
        minProfit: '0',
      }
      const result = validateInput(event as any)

      await expect(result).rejects.toThrowError()
    })
  })
})
