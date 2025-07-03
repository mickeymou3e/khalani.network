import { BigNumber } from 'ethers'

import { Test, TestingModule } from '@nestjs/testing'
import { PoolModule } from '@pool/pool.module'
import { PoolService } from '@pool/pool.service'

import { DataModule } from './data.module'
import { DataService, YokaiPoolInformationFetcher } from './data.service'
import { ConfigModule } from '@nestjs/config'
import { HadoukenSwapModule } from '../hadouken-swap/hadouken-swap.module'
import { MainClient } from 'binance'
import { TokenModule } from '../token/token.module'
import { NetworkConfigModule } from '../network-config/networkConfig.module'
import { GODWOKEN_MAINNET_CHAIN_ID } from '../liquidation-fetcher/liquidation-fetcher.constants'

describe('DataService', () => {
  let service: DataService

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
        HadoukenSwapModule,
        DataModule,
        PoolModule,
        TokenModule,
      ],
    })
      .overrideProvider(PoolService)
      .useValue(poolServiceMock)
      .overrideProvider(MainClient)
      .useValue({})
      .compile()

    service = module.get<DataService>(DataService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('Get-Out-Given-In on Yokai', async () => {
    const pool = (await service.getPool(
      'yokaiUsdcWckb',
    )) as YokaiPoolInformationFetcher
    const tokenIn = 'USDC'
    const tokenOut = 'WCKB'
    const amountIn = BigNumber.from(10).pow(6).mul(100)
    const amountOutExpected = BigNumber.from('24241852425147251509962')
    const amountOut = await pool.getOutGivenIn(amountIn, tokenIn, tokenOut)
    expect(amountOut.toString()).toBe(amountOutExpected.toString())
  })

  it('Get-In-Given-Out on Yokai', async () => {
    const pool = (await service.getPool(
      'yokaiUsdcWckb',
    )) as YokaiPoolInformationFetcher
    const tokenIn = 'USDC'
    const tokenOut = 'WCKB'
    const amountOut = BigNumber.from(10).pow(18).mul(100_000)
    const amountInExpected = BigNumber.from('412598799')
    const amountIn = await pool.getInGivenOut(amountOut, tokenIn, tokenOut)
    expect(amountIn.toString()).toBe(amountInExpected.toString())
  })
})

const USDCToken = {
  symbol: 'USDC',
  decimals: 6,
  address: '0x186181e225dc1ad85a4a94164232bd261e351c33',
}
const WCKBToken = {
  symbol: 'WCKB',
  decimals: 18,
  address: '0xc296f806d15e97243a08334256c705ba5c5754cd',
}

const tokenInfoYokai = new Map([
  [
    USDCToken.symbol,
    {
      address: USDCToken.address,
      amount: BigNumber.from('1444050455842'),
      symbol: USDCToken.symbol,
      decimals: USDCToken.decimals,
    },
  ],
  [
    WCKBToken.symbol,
    {
      address: WCKBToken.address,
      amount: BigNumber.from('350966177140529224714512227'),
      symbol: WCKBToken.symbol,
      decimals: WCKBToken.decimals,
    },
  ],
])

const poolServiceMock = {
  getYokaiPoolData: jest.fn().mockResolvedValue({
    tokenInfo: tokenInfoYokai,
  }),
}
