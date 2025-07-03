import { Test, TestingModule } from '@nestjs/testing'
import { BigNumber } from 'ethers'
import { ArbitrageBotModule } from '../arbitrageBot.module'
import { pools as yokaiPools } from '@config/yokai.json'
import { DataService, YokaiPoolInformationFetcher } from '../data/data.service'
import { PoolService } from '../pool/pool.service'
import { PoolYokaiData } from '../pool/pool.types'
import { OpportunityService } from './opportunity.service'
import { ConfigModule } from '@nestjs/config'
import * as binanceOrderBookMock from './opportunity-orderbook-mock.json'
import { BinanceFetcherService } from '../binance-fetcher/binance-fetcher.service'
import { flashLoanCost as flCost } from '@config/arbitragePairs.json'
import { BinanceFetcherModule } from '../binance-fetcher/binance-fetcher.module'
import { MainClient } from 'binance'
import { HadoukenSwapService } from '../hadouken-swap/hadouken-swap.service'
import { getSorMock } from '../hadouken-swap/mockPoolDataService'
import { GodwokenTokenService } from '../token/godwokenToken.service'
import { GODWOKEN_TESTNET_CHAIN_ID } from '../liquidation-fetcher/liquidation-fetcher.constants'

const overrideYokai: PoolYokaiData = {
  tokenInfo: new Map([
    [
      'USDC',
      {
        address: '0x186181e225dc1ad85a4a94164232bd261e351c33',
        amount: BigNumber.from('781489272094'),
        symbol: 'USDC',
        decimals: 6,
      },
    ],
    [
      'WCKB',
      {
        address: '0xc296f806d15e97243a08334256c705ba5c5754cd',
        amount: BigNumber.from('162586590850019220892865002'),
        symbol: 'WCKB',
        decimals: 18,
      },
    ],
  ]),
}
const overrideYokaiWithMoreUSDC: PoolYokaiData = {
  tokenInfo: new Map([
    [
      'USDC',
      {
        address: '0x186181e225dc1ad85a4a94164232bd261e351c33',
        amount: BigNumber.from('849628601816'),
        symbol: 'USDC',
        decimals: 6,
      },
    ],
    [
      'WCKB',
      {
        address: '0xc296f806d15e97243a08334256c705ba5c5754cd',
        amount: BigNumber.from('164393556246507511552517989'),
        symbol: 'WCKB',
        decimals: 18,
      },
    ],
  ]),
}
const gasThresholdInCKB = BigNumber.from('36000000000000000000')
const quoteTokenThresholdCKB = BigNumber.from('671000000000000000000')
const flashLoanCost = BigNumber.from(flCost)

describe('OpportunityService', () => {
  let service: OpportunityService
  let binanceService: BinanceFetcherService
  const tokenService = new GodwokenTokenService()
  const poolService = new PoolService(null, tokenService)

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
        BinanceFetcherModule,
        ArbitrageBotModule.forRoot(GODWOKEN_TESTNET_CHAIN_ID),
      ],
    })
      .overrideProvider(MainClient)
      .useValue({})
      .overrideProvider(DataService)
      .useValue({})
      .compile()

    service = module.get(OpportunityService)
    binanceService = module.get(BinanceFetcherService)

    jest.clearAllMocks()
  })

  // it('should get each pools pair volume as object', async () => {

  // });

  // it('should throw error when hadouken pool is not found', async () => {});

  // it('should throw error when yokai pool is not found', async () => {});

  // it('should not throw error when all pools are found', async () => {});

  describe('Balanced yokai and hadouken pool with no arbitrage', () => {
    it('Profit below threshold', async () => {
      const sorMock = getSorMock('balanced')
      const hadoukenPoolInfo = new HadoukenSwapService(sorMock, tokenService)
      await hadoukenPoolInfo.fetchPools()

      const yokaiPoolInfo = new YokaiPoolInformationFetcher(
        yokaiPools[0],
        poolService,
        overrideYokai,
      )

      const { quoteAmount } = await service.findQuoteAmountToArbitrage({
        poolForBuy: yokaiPoolInfo,
        poolForSell: hadoukenPoolInfo,
        baseToken: 'USDC',
        quoteToken: 'CKB',
        quoteTokenThreshold: quoteTokenThresholdCKB,
        minProfit: gasThresholdInCKB,
        flashLoanCost: flashLoanCost,
      })
      expect(quoteAmount.isZero()).toBeTruthy()
    })
  })
  describe('Yokai pool with more 10% USDC', () => {
    // 137000 USDC were added to yokai pool
    // balanced yokai pool has around 21 times more USDC token than hadouken
    // around 4,76% of 137000 USDC should go to hadouken ~= 6521,2 USDC
    it('should find quote token amount for yokai pool', async () => {
      const sorMock = getSorMock('balanced')
      const hadoukenPoolInfo = new HadoukenSwapService(sorMock, tokenService)
      await hadoukenPoolInfo.fetchPools()

      const yokaiPoolInfo = new YokaiPoolInformationFetcher(
        yokaiPools[0],
        poolService,
        overrideYokaiWithMoreUSDC,
      )

      const { quoteAmount } = await service.findQuoteAmountToArbitrage({
        poolForBuy: yokaiPoolInfo,
        poolForSell: hadoukenPoolInfo,
        baseToken: 'USDC',
        quoteToken: 'CKB',
        quoteTokenThreshold: quoteTokenThresholdCKB,
        minProfit: gasThresholdInCKB,
        flashLoanCost: flashLoanCost,
      })
      expect(quoteAmount.isZero()).toBeFalsy()
    })

    it("shouldn't find any quote token amount for hadouken pool", async () => {
      const sorMock = getSorMock('balanced')
      const hadoukenPoolInfo = new HadoukenSwapService(sorMock, tokenService)
      await hadoukenPoolInfo.fetchPools()

      const yokaiPoolInfo = new YokaiPoolInformationFetcher(
        yokaiPools[0],
        poolService,
        overrideYokaiWithMoreUSDC,
      )

      const { quoteAmount } = await service.findQuoteAmountToArbitrage({
        poolForBuy: hadoukenPoolInfo,
        poolForSell: yokaiPoolInfo,
        baseToken: 'USDC',
        quoteToken: 'CKB',
        quoteTokenThreshold: quoteTokenThresholdCKB,
        minProfit: gasThresholdInCKB,
        flashLoanCost: flashLoanCost,
      })
      expect(quoteAmount.isZero()).toBeTruthy()
    })
  })
  describe('Hadouken pool with more 10% USDC', () => {
    // 6474,3 USDC were added to hadouken pool
    // balanced yokai pool has around 21 times more USDC token than hadouken
    // around 4,76% of 6474,3 USDC should go to hadouken ~= 308,17 USDC
    // so 6166,13 goes to yokai
    it('should find quote token amount for hadouken pool', async () => {
      const sorMock = getSorMock('moreUSDC')
      const hadoukenPoolInfo = new HadoukenSwapService(sorMock, tokenService)
      await hadoukenPoolInfo.fetchPools()

      const yokaiPoolInfo = new YokaiPoolInformationFetcher(
        yokaiPools[0],
        poolService,
        overrideYokai,
      )

      const { quoteAmount } = await service.findQuoteAmountToArbitrage({
        poolForBuy: hadoukenPoolInfo,
        poolForSell: yokaiPoolInfo,
        baseToken: 'USDC',
        quoteToken: 'CKB',
        quoteTokenThreshold: quoteTokenThresholdCKB,
        minProfit: gasThresholdInCKB,
        flashLoanCost: flashLoanCost,
      })
      expect(quoteAmount.isZero()).toBeFalsy()
    })

    it("shouldn't find any quote token amount for yokai pool", async () => {
      const sorMock = getSorMock('moreUSDC')
      const hadoukenPoolInfo = new HadoukenSwapService(sorMock, tokenService)
      await hadoukenPoolInfo.fetchPools()

      const yokaiPoolInfo = new YokaiPoolInformationFetcher(
        yokaiPools[0],
        poolService,
        overrideYokai,
      )

      const { quoteAmount } = await service.findQuoteAmountToArbitrage({
        poolForBuy: yokaiPoolInfo,
        poolForSell: hadoukenPoolInfo,
        baseToken: 'USDC',
        quoteToken: 'CKB',
        quoteTokenThreshold: quoteTokenThresholdCKB,
        minProfit: gasThresholdInCKB,
        flashLoanCost: flashLoanCost,
      })
      expect(quoteAmount.isZero()).toBeTruthy()
    })
  })
  describe.skip('Binance/Hadouken trade', () => {
    it('should find quote token amount for binance/hadouken', async () => {
      const sorMock = getSorMock('balanced')
      const hadoukenPoolInfo = new HadoukenSwapService(sorMock, tokenService)
      await hadoukenPoolInfo.fetchPools()

      const baseToken = 'ETH'
      const quoteToken = 'USDT'
      const binanceOrderBookFetcher = binanceService.createFetcher(
        baseToken,
        quoteToken,
        binanceOrderBookMock,
      )

      const { quoteAmount } = await service.findQuoteAmountToArbitrage({
        poolForBuy: binanceOrderBookFetcher,
        poolForSell: hadoukenPoolInfo,
        baseToken: 'ETH',
        quoteToken: 'USDT',
        quoteTokenThreshold: BigNumber.from(5).mul(BigNumber.from(10).pow(15)),
        minProfit: BigNumber.from(0),
        flashLoanCost: BigNumber.from(0),
      })

      expect(quoteAmount).toEqual(BigNumber.from('242711'))
    })
    it("shouldn't find quote token amount for binance/hadouken", async () => {
      const sorMock = getSorMock('balanced')
      const hadoukenPoolInfo = new HadoukenSwapService(sorMock, tokenService)
      await hadoukenPoolInfo.fetchPools()

      const baseToken = 'CKB'
      const quoteToken = 'USDT'
      const binanceOrderBookFetcher = binanceService.createFetcher(
        baseToken,
        quoteToken,
        binanceOrderBookMock,
      )

      const { quoteAmount } = await service.findQuoteAmountToArbitrage({
        poolForBuy: binanceOrderBookFetcher,
        poolForSell: hadoukenPoolInfo,
        baseToken: 'CKB',
        quoteToken: 'USDT',
        quoteTokenThreshold: quoteTokenThresholdCKB,
        minProfit: gasThresholdInCKB,
        flashLoanCost: BigNumber.from(0),
      })

      expect(quoteAmount).toEqual(BigNumber.from('0'))
    })
  })
})
