import { BigNumber } from 'ethers'
import { Test, TestingModule } from '@nestjs/testing'
import { applyDecimal } from '../yokai-sdk/utils'
import * as binanceOrderBookMock from './order-book-mock2.json'
import {
  BinanceFetcherService,
  BinanceOrderBookInformationFetcher,
} from './binance-fetcher.service'
import { BinanceFetcherModule } from './binance-fetcher.module'
import { MainClient } from 'binance'

describe('BinanceFetcher Service', () => {
  let service: BinanceFetcherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BinanceFetcherModule],
    })
      .overrideProvider(MainClient)
      .useValue({})
      .compile()

    service = module.get<BinanceFetcherService>(BinanceFetcherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Binance: Given-In', () => {
    describe('baseToken = tokenIn', () => {
      it('Given-In on Binance: Given in 5 baseToken should give 5594 quoteToken', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'

        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )

        const amount = await BinanceOrderBookFetcher.getOutGivenIn(
          BigNumber.from(5).mul(BigNumber.from(10).pow(18)),
          baseToken,
          quoteToken,
        )
        expect(amount.toString()).toEqual(
          BigNumber.from(5600).mul(BigNumber.from(10).pow(6)).toString(),
        )
      })
      it('Given-In on Binance: Given in 1100 baseToken should give 3 quoteToken (MidPoint)', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'
        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )

        const amount = await BinanceOrderBookFetcher.getOutGivenIn(
          BigNumber.from(2).mul(BigNumber.from(10).pow(18)),
          baseToken,
          quoteToken,
        )
        expect(amount.toString()).toEqual(
          BigNumber.from(2100).mul(BigNumber.from(10).pow(6)).toString(),
        )
      })
    })
    describe('baseToken = tokenOut', () => {
      it('Given-In on Binance: Given in 3200 quoteToken should give 3 baseToken', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'
        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )

        const amount = await BinanceOrderBookFetcher.getOutGivenIn(
          BigNumber.from(450).mul(BigNumber.from(10).pow(6)),
          quoteToken,
          baseToken,
        )
        expect(amount.toString()).toEqual(
          BigNumber.from(5).mul(BigNumber.from(10).pow(17)).toString(),
        )
      })
      it('Given-In on Binance: Given in 2100 quoteToken should give 2 baseToken (MidPoint)', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'
        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )

        const amount = await BinanceOrderBookFetcher.getOutGivenIn(
          BigNumber.from(1000).mul(BigNumber.from(10).pow(6)),
          quoteToken,
          baseToken,
        )
        expect(amount.toString()).toEqual(
          BigNumber.from(2).mul(BigNumber.from(10).pow(18)).toString(),
        )
      })
    })
  })

  describe('Binance: Given-Out', () => {
    describe('baseToken = tokenIn', () => {
      it('Given-Out on Binance: Given out 500 quoteToken should give 0.5 baseToken (MidPoint)', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'
        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )

        const amount = await BinanceOrderBookFetcher.getInGivenOut(
          BigNumber.from(500).mul(BigNumber.from(10).pow(6)),
          baseToken,
          quoteToken,
        )
        expect(amount.toString()).toEqual(
          BigNumber.from(5).mul(BigNumber.from(10).pow(17)).toString(),
        )
      })
      it('Given-Out on Binance: Given out 1700 quoteToken should give 13 baseToken', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'
        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )
        const amount = await BinanceOrderBookFetcher.getInGivenOut(
          BigNumber.from(1550).mul(BigNumber.from(10).pow(6)),
          baseToken,
          quoteToken,
        )

        expect(amount.toString()).toEqual(
          BigNumber.from(15).mul(BigNumber.from(10).pow(17)).toString(),
        )
      })
    })

    describe('baseToken = tokenOut', () => {
      it('Given-Out on Binance: Given out 5 baseToken should give 1300 quoteToken', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'
        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )
        const amount = await BinanceOrderBookFetcher.getInGivenOut(
          BigNumber.from(5).mul(BigNumber.from(10).pow(18)),
          quoteToken,
          baseToken,
        )
        expect(amount.toString()).toEqual(
          BigNumber.from(1300).mul(BigNumber.from(10).pow(6)).toString(),
        )
      })
      it('Given-Out on Binance: Given out 3 baseToken should give 1100 quoteToken', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'
        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )
        const amount = await BinanceOrderBookFetcher.getInGivenOut(
          BigNumber.from(3).mul(BigNumber.from(10).pow(18)),
          quoteToken,
          baseToken,
        )
        expect(amount.toString()).toEqual(
          BigNumber.from(1100).mul(BigNumber.from(10).pow(6)).toString(),
        )
      })
      it('Given-Out on Binance: Given out 6 baseToken should give 1350 quoteToken (MidPoint)', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'
        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )
        const amount = await BinanceOrderBookFetcher.getInGivenOut(
          BigNumber.from(6).mul(BigNumber.from(10).pow(18)),
          quoteToken,
          baseToken,
        )
        expect(amount.toString()).toEqual(
          BigNumber.from(1350).mul(BigNumber.from(10).pow(6)).toString(),
        )
      })
    })
    describe('errors', () => {
      it('Given-Out on Binance: Given in 50 000 baseToken should throw error', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'
        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )

        await expect(
          BinanceOrderBookFetcher.getOutGivenIn(
            BigNumber.from(50000).mul(BigNumber.from(10).pow(18)),
            baseToken,
            quoteToken,
          ),
        ).rejects.toThrowError('amountIn is bigger than order book')
      })
      it('Given-Out on Binance: Given out 50 000 quoteToken should throw error', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'
        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )
        await expect(
          BinanceOrderBookFetcher.getInGivenOut(
            BigNumber.from(50000).mul(BigNumber.from(10).pow(18)),
            quoteToken,
            baseToken,
          ),
        ).rejects.toThrowError('amountOut is bigger than order book')
      })
      it('Given-Out on Binance: Given in 50 000 baseToken should throw error', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'
        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )
        await expect(
          BinanceOrderBookFetcher.getOutGivenIn(
            BigNumber.from(50000).mul(BigNumber.from(10).pow(18)),
            baseToken,
            quoteToken,
          ),
        ).rejects.toThrowError('amountIn is bigger than order book')
      })
      it('Given-Out on Binance: Given out 50 000 baseToken should throw error', async () => {
        const baseToken = 'ETH'
        const quoteToken = 'USDT'
        const BinanceOrderBookFetcher = service.createFetcher(
          baseToken,
          quoteToken,
          binanceOrderBookMock,
        )

        await expect(
          BinanceOrderBookFetcher.getInGivenOut(
            BigNumber.from(50000).mul(BigNumber.from(10).pow(18)),
            baseToken,
            quoteToken,
          ),
        ).rejects.toThrowError('amountOut is bigger than order book')
      })
    })
  })

  describe('Binance: whole path tests', () => {
    it('Binance: Check gIgO(gOgI(X, b, q), q, b) === X', async () => {
      const baseToken = 'ETH'
      const quoteToken = 'USDT'
      const BinanceOrderBookFetcher = new BinanceOrderBookInformationFetcher(
        '',
        baseToken,
        quoteToken,
        binanceOrderBookMock,
      )
      const amountOut = await BinanceOrderBookFetcher.getOutGivenIn(
        BigNumber.from(3).mul(BigNumber.from(10).pow(18)),
        baseToken,
        quoteToken,
      ) // 3 eth = 1100 usdt | correct

      expect(amountOut.toString()).toEqual(
        BigNumber.from(3200).mul(BigNumber.from(10).pow(6)).toString(),
      )
      // amountOut = 3200 USDT
      const amountIn = await BinanceOrderBookFetcher.getInGivenOut(
        amountOut,
        baseToken,
        quoteToken,
      )
      // 1100 usdt = 3 eth
      expect(amountIn.toString()).toEqual(
        BigNumber.from(3).mul(BigNumber.from(10).pow(18)).toString(),
      )
    })
    it('Binance: Check gOgI(gIgO(X, b, q), q, b) === X', async () => {
      const baseToken = 'ETH'
      const quoteToken = 'USDT'
      const BinanceOrderBookFetcher = new BinanceOrderBookInformationFetcher(
        '',
        baseToken,
        quoteToken,
        binanceOrderBookMock,
      )

      const amountIn = await BinanceOrderBookFetcher.getOutGivenIn(
        applyDecimal(18, BigNumber.from(1)),
        baseToken,
        quoteToken,
      )

      const amountOut = await BinanceOrderBookFetcher.getInGivenOut(
        amountIn,
        baseToken,
        quoteToken,
      )
      expect(amountOut).toEqual(applyDecimal(18, BigNumber.from(1)))
    })
  })
})
