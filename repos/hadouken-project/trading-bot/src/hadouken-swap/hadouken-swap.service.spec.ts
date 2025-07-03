import { Sor } from '@hadouken-project/sdk'
import { Test, TestingModule } from '@nestjs/testing'
import { BigNumber } from 'ethers'
import { HadoukenSwapModule } from './hadouken-swap.module'
import { HadoukenSwapService } from './hadouken-swap.service'
import { getSorMock } from './mockPoolDataService'
import { TokenModule } from '../token/token.module'
import { NetworkConfigModule } from '../network-config/networkConfig.module'
import { GODWOKEN_MAINNET_CHAIN_ID } from '../liquidation-fetcher/liquidation-fetcher.constants'

const sorMock = getSorMock('balanced')
describe('HadoukenSwapService', () => {
  let hadoukenSwapService: HadoukenSwapService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NetworkConfigModule.forRoot(GODWOKEN_MAINNET_CHAIN_ID),
        TokenModule,
        HadoukenSwapModule,
      ],
    })
      .overrideProvider(Sor)
      .useValue(sorMock)
      .compile()

    hadoukenSwapService = module.get<HadoukenSwapService>(HadoukenSwapService)
  })

  it('calls Get Out Given In', async () => {
    const amount = BigNumber.from(10).pow(6).mul(100)
    const tokenIn = 'USDC'
    const tokenOut = 'CKB'
    await hadoukenSwapService.fetchPools()
    const result = await hadoukenSwapService.getOutGivenIn(
      amount,
      tokenIn,
      tokenOut,
    )
    const expected = BigNumber.from('20672845609330949035195')
    expect(result.eq(expected)).toBeTruthy()
  })

  it('calls Get In Given Out', async () => {
    const amount = BigNumber.from(10).pow(18).mul(22731)
    const tokenIn = 'USDC'
    const tokenOut = 'CKB'
    await hadoukenSwapService.fetchPools()
    const result = await hadoukenSwapService.getInGivenOut(
      amount,
      tokenIn,
      tokenOut,
    )
    const expected = BigNumber.from('109981350')
    expect(result.eq(expected)).toBeTruthy()
  })
})
