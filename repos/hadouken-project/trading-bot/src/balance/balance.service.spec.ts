import { Test, TestingModule } from '@nestjs/testing'
import { MainClient } from 'binance'
import { BigNumber } from 'ethers'
import { BalanceFetcherService } from '../balance-fetcher/balance-fetcher.service'
import { BalanceModule } from './balance.module'
import { BalanceService } from './balance.service'
import { NetworkConfigModule } from '../network-config/networkConfig.module'
import { GODWOKEN_MAINNET_CHAIN_ID } from '../liquidation-fetcher/liquidation-fetcher.constants'
import { ConfigModule } from '@nestjs/config'

const balanceFetcherServiceMock = {
  getBinanceTokenBalance: jest
    .fn()
    .mockResolvedValue(BigNumber.from(2000).mul(BigNumber.from(10).pow(6))),
  getGodwokenTokenBalance: jest
    .fn()
    .mockResolvedValue(BigNumber.from(1000).mul(BigNumber.from(10).pow(18))),
}

describe('BalanceService', () => {
  let service: BalanceService

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
        BalanceModule,
      ],
    })
      .overrideProvider(BalanceFetcherService)
      .useValue(balanceFetcherServiceMock)
      .overrideProvider(MainClient)
      .useValue({})
      .compile()

    service = module.get<BalanceService>(BalanceService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Balance checking', () => {
    describe('poolForBuy: binance', () => {
      it('if quoteAmount is greater than balance, should return balance', async () => {
        const event = {
          poolNameForBuy: 'binanceETHUSDC',
          poolNameForSell: 'hadoukenEthUsdc',
          quoteAmount: BigNumber.from(1000).mul(BigNumber.from(10).pow(6)),
          baseAmount: BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
          quoteTokenSymbol: 'USDT',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }
        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )

        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })

        expect(trimmedBalances.quoteAmount).toEqual(
          BigNumber.from('490').mul(BigNumber.from(10).pow(6)),
        )
        expect(trimmedBalances.baseAmount).toEqual(
          BigNumber.from('980').mul(BigNumber.from(10).pow(18)),
        )
      })

      it('if quoteAmount is less than balance should return quoteAmount', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
        )

        const event = {
          poolNameForBuy: 'binanceETHUSDC',
          poolNameForSell: 'hadoukenEthUsdc',
          quoteAmount: BigNumber.from(1000).mul(BigNumber.from(10).pow(6)),
          baseAmount: BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
          quoteTokenSymbol: 'USDT',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }
        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })

        expect(trimmedBalances.quoteAmount).toEqual(
          BigNumber.from('980').mul(BigNumber.from(10).pow(6)),
        )
        expect(trimmedBalances.baseAmount).toEqual(
          BigNumber.from('1960').mul(BigNumber.from(10).pow(18)),
        )
      })
      it('if quoteAmount and baseAmount is equal to the balance should return both', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
        )

        const event = {
          poolNameForBuy: 'binanceETHUSDC',
          poolNameForSell: 'hadoukenEthUsdc',
          quoteAmount: BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
          baseAmount: BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
          quoteTokenSymbol: 'USDT',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }
        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })
        expect(trimmedBalances.quoteAmount).toEqual(
          BigNumber.from('1960').mul(BigNumber.from(10).pow(6)),
        )
        expect(trimmedBalances.baseAmount).toEqual(
          BigNumber.from('1960').mul(BigNumber.from(10).pow(18)),
        )
      })

      it('if baseAmount is greater than balance should return balance and trim quoteAmount to 784 USDC', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
        )

        const event = {
          poolNameForBuy: 'binanceETHUSDC',
          poolNameForSell: 'hadoukenEthUsdc',
          quoteAmount: BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
          baseAmount: BigNumber.from(5000).mul(BigNumber.from(10).pow(18)),
          quoteTokenSymbol: 'USDT',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }
        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })
        expect(trimmedBalances.quoteAmount).toEqual(
          BigNumber.from('784').mul(BigNumber.from(10).pow(6)),
        )
        expect(trimmedBalances.baseAmount).toEqual(
          BigNumber.from('1960').mul(BigNumber.from(10).pow(18)),
        )
      })
      it('if baseAmount is less than balance and quoteAmount is greater than balance should trim both', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
        )

        const event = {
          poolNameForBuy: 'binanceETHUSDC',
          poolNameForSell: 'hadoukenEthUsdc',
          quoteAmount: BigNumber.from(2001).mul(BigNumber.from(10).pow(6)),
          baseAmount: BigNumber.from(1500).mul(BigNumber.from(10).pow(18)),
          quoteTokenSymbol: 'USDT',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }
        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })
        expect(trimmedBalances.quoteAmount).toEqual(
          BigNumber.from('1959999999'),
        ) // 6 decimals
        expect(trimmedBalances.baseAmount).toEqual(
          BigNumber.from('1469265367316341828950'),
        ) // 18 decimals
      })

      it('if base amount is less than minimum - return 0 base and quote token amount ', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
        )

        const event = {
          poolNameForBuy: 'binanceETHUSDC',
          poolNameForSell: 'hadoukenEthUsdc',
          quoteAmount: BigNumber.from(1).mul(BigNumber.from(10).pow(5)),
          baseAmount: BigNumber.from(1500).mul(BigNumber.from(10).pow(18)),
          quoteTokenSymbol: 'USDT',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }
        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })
        expect(trimmedBalances.quoteAmount).toEqual(BigNumber.from('0')) // 6 decimals
        expect(trimmedBalances.baseAmount).toEqual(BigNumber.from('0')) // 18 decimals
      })

      it('if quote amount is less than minimum - return 0 base and quote token amount ', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
        )

        const event = {
          poolNameForBuy: 'binanceETHUSDC',
          poolNameForSell: 'hadoukenEthUsdc',
          quoteAmount: BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
          baseAmount: BigNumber.from(1).mul(BigNumber.from(10).pow(13)),
          quoteTokenSymbol: 'USDT',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }
        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })
        expect(trimmedBalances.quoteAmount).toEqual(BigNumber.from('0'))
        expect(trimmedBalances.baseAmount).toEqual(BigNumber.from('0'))
      })
    })
    describe('poolForBuy: hadouken', () => {
      it('if baseAmount is greater than balance, quoteAmount equal to balance, should return baseAmount and trim quoteAmount to 800 USDC', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )

        const event = {
          poolNameForBuy: 'hadoukenEthUsdc',
          poolNameForSell: 'binanceETHUSDC',
          quoteAmount: BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
          baseAmount: BigNumber.from(5000).mul(BigNumber.from(10).pow(18)),
          quoteTokenSymbol: 'USDC',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }

        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })
        expect(trimmedBalances.quoteAmount).toEqual(
          BigNumber.from('784').mul(BigNumber.from(10).pow(6)),
        )
        expect(trimmedBalances.baseAmount).toEqual(
          BigNumber.from('1960').mul(BigNumber.from(10).pow(18)),
        )
      })
      it('if quoteAmount is less than balance and baseAmount is bigger than balance should trim quoteAmount to 400 USDC and return balance as baseAmount', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )

        const event = {
          poolNameForBuy: 'hadoukenEthUsdc',
          poolNameForSell: 'binanceETHUSDC',
          quoteAmount: BigNumber.from(1000).mul(BigNumber.from(10).pow(6)),
          baseAmount: BigNumber.from(5000).mul(BigNumber.from(10).pow(18)),
          quoteTokenSymbol: 'USDC',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }

        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })
        expect(trimmedBalances.quoteAmount).toEqual(
          BigNumber.from('392').mul(BigNumber.from(10).pow(6)),
        )
        expect(trimmedBalances.baseAmount).toEqual(
          BigNumber.from('1960').mul(BigNumber.from(10).pow(18)),
        )
      })
      it('if quoteAmount is bigger than balance, baseAmount is equal to balance, should trim quoteAmount to balance and baseAmount to 1470 ETH', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(1500).mul(BigNumber.from(10).pow(18)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )

        const event = {
          poolNameForBuy: 'hadoukenEthUsdc',
          poolNameForSell: 'binanceETHUSDC',
          quoteAmount: BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
          baseAmount: BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
          quoteTokenSymbol: 'USDC',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }

        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })
        expect(trimmedBalances.quoteAmount).toEqual(
          BigNumber.from('1470').mul(BigNumber.from(10).pow(6)),
        )
        expect(trimmedBalances.baseAmount).toEqual(
          BigNumber.from('1470').mul(BigNumber.from(10).pow(18)),
        )
      })
      it('if quoteAmount is bigger than balance, baseAmount is bigger than balance, should trim both proportionally', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(1500).mul(BigNumber.from(10).pow(18)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )

        const event = {
          poolNameForBuy: 'hadoukenEthUsdc',
          poolNameForSell: 'binanceETHUSDC',
          quoteAmount: BigNumber.from(8000).mul(BigNumber.from(10).pow(6)),
          baseAmount: BigNumber.from(5000).mul(BigNumber.from(10).pow(18)),
          quoteTokenSymbol: 'USDC',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }

        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })
        expect(trimmedBalances.quoteAmount).toEqual(
          BigNumber.from('1960').mul(BigNumber.from(10).pow(6)),
        )
        expect(trimmedBalances.baseAmount).toEqual(
          BigNumber.from('1225').mul(BigNumber.from(10).pow(18)),
        )
      })
      it('if baseAmount is less than balance, quoteAmount is bigger than balance, should trim quoteAmount to balance and baseAmount proportionally to 735 ETH', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(1500).mul(BigNumber.from(10).pow(18)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )

        const event = {
          poolNameForBuy: 'hadoukenEthUsdc',
          poolNameForSell: 'binanceETHUSDC',
          quoteAmount: BigNumber.from(4000).mul(BigNumber.from(10).pow(6)),
          baseAmount: BigNumber.from(1500).mul(BigNumber.from(10).pow(18)),
          quoteTokenSymbol: 'USDC',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }

        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })
        expect(trimmedBalances.quoteAmount).toEqual(
          BigNumber.from('1960').mul(BigNumber.from(10).pow(6)),
        )
        expect(trimmedBalances.baseAmount).toEqual(
          BigNumber.from('735').mul(BigNumber.from(10).pow(18)),
        )
      })

      it('if base amount is less than minimum - return 0 base and quote token amount ', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
        )

        const event = {
          poolNameForBuy: 'binanceETHUSDC',
          poolNameForSell: 'hadoukenEthUsdc',
          quoteAmount: BigNumber.from(1).mul(BigNumber.from(10).pow(5)),
          baseAmount: BigNumber.from(1500).mul(BigNumber.from(10).pow(18)),
          quoteTokenSymbol: 'USDT',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }
        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })
        expect(trimmedBalances.quoteAmount).toEqual(BigNumber.from('0'))
        expect(trimmedBalances.baseAmount).toEqual(BigNumber.from('0'))
      })

      it('if quote amount is less than minimum - return 0 base and quote token amount ', async () => {
        balanceFetcherServiceMock.getBinanceTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
        )
        balanceFetcherServiceMock.getGodwokenTokenBalance.mockResolvedValue(
          BigNumber.from(2000).mul(BigNumber.from(10).pow(18)),
        )

        const event = {
          poolNameForBuy: 'binanceETHUSDC',
          poolNameForSell: 'hadoukenEthUsdc',
          quoteAmount: BigNumber.from(2000).mul(BigNumber.from(10).pow(6)),
          baseAmount: BigNumber.from(1).mul(BigNumber.from(10).pow(13)),
          quoteTokenSymbol: 'USDT',
          baseTokenSymbol: 'ETH',
          binancePrice: '1765000000',
        }
        const balanceInformation = await service.getBalancesBinanceHadouken(
          event,
        )
        const trimmedBalances = await service.trimBalancesBinanceHadouken({
          ...balanceInformation,
          quoteAmount: event.quoteAmount,
          baseAmount: event.baseAmount,
        })
        expect(trimmedBalances.quoteAmount).toEqual(BigNumber.from('0'))
        expect(trimmedBalances.baseAmount).toEqual(BigNumber.from('0'))
      })
    })
  })
})
