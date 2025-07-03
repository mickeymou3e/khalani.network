import { BigNumber } from 'ethers'
import { mocked } from 'ts-jest/utils'

import { pools } from '@tests/pools'
import {
  TEST_BOOSTED_POOL_TOKEN,
  TEST_CKB_TOKEN,
  TEST_ETH_TOKEN,
  TEST_LNR_CKB_TOKEN,
  TEST_LNR_ETH_TOKEN,
  TEST_LNR_USDC_TOKEN,
  TEST_LNR_USDT_TOKEN,
  TEST_USDC_TOKEN,
  TEST_USDT_TOKEN,
} from '@tests/tokens'

import BatchRelayerService from '../batchRelayer/batchRelayer.service'
import InvestService from '../invest/invest.service'
import TradeService from '../trade/trade.service'
import { WeightedBoostedPool } from './WeightedBoostedPool'

jest.mock('../sor/sor.service')
jest.mock('../invest/invest.service')
jest.mock('../invest/invest.service')
jest.mock('../trade/trade.service')
jest.mock('../batchRelayer/batchRelayer.service')

describe('createDepositPlan', () => {
  it('BatchSwap deposit direction STANDARD_TOKEN -> LNR_TOKEN', async () => {
    const investService = mocked(InvestService, true)
    const tradeService = mocked(TradeService, true)
    const batchRelayerService = mocked(BatchRelayerService, true)

    const service = new WeightedBoostedPool(
      investService.mock.instances[0],
      tradeService.mock.instances[0],
      batchRelayerService.mock.instances[0],
    )

    const pool = pools.find(
      (pool) =>
        pool.id ===
        '0xf0ca75c9691e2d221c470bb4383e95aeb6906be000010000000000000000001a',
    )

    if (!pool) throw Error('pool not found')

    const amountsIn = [
      BigNumber.from(10).mul(BigNumber.from(10).pow(6)),
      BigNumber.from(0),
      BigNumber.from(10).mul(BigNumber.from(10).pow(18)),
    ]

    const tokensIn = [
      TEST_USDC_TOKEN.address,
      TEST_ETH_TOKEN.address,
      TEST_CKB_TOKEN.address,
    ]

    const tokensOut = [
      TEST_LNR_USDC_TOKEN.address,
      TEST_LNR_ETH_TOKEN.address,
      TEST_LNR_CKB_TOKEN.address,
    ]

    const pairs = await service.getDepositSwapPairs(
      pools,
      amountsIn,
      tokensIn,
      tokensOut,
    )

    expect(pairs.flatMap((pair) => pair.assets)).toEqual([
      TEST_USDC_TOKEN.address,
      TEST_LNR_USDC_TOKEN.address,

      TEST_CKB_TOKEN.address,
      TEST_LNR_CKB_TOKEN.address,
    ])
  })

  it('BatchSwap deposit direction STANDARD_TOKEN -> BOOSTED_TOKEN', async () => {
    const investService = mocked(InvestService, true)
    const tradeService = mocked(TradeService, true)
    const batchRelayerService = mocked(BatchRelayerService, true)

    const service = new WeightedBoostedPool(
      investService.mock.instances[0],
      tradeService.mock.instances[0],
      batchRelayerService.mock.instances[0],
    )

    const pool = pools.find(
      (pool) =>
        pool.id ===
        '0x6ea0086d318afe79858097409f848521f2c83ee200010000000000000000001b',
    )

    if (!pool) throw Error('pool not found')

    const amountsIn = [
      BigNumber.from(10).mul(BigNumber.from(10).pow(6)),
      BigNumber.from(10).mul(BigNumber.from(10).pow(6)),
      BigNumber.from(0),
      BigNumber.from(10).mul(BigNumber.from(10).pow(18)),
    ]

    const tokensIn = [
      TEST_USDC_TOKEN.address,
      TEST_USDT_TOKEN.address,
      TEST_ETH_TOKEN.address,
      TEST_CKB_TOKEN.address,
    ]

    const tokensOut = [
      TEST_BOOSTED_POOL_TOKEN.address,
      TEST_LNR_ETH_TOKEN.address,
      TEST_LNR_CKB_TOKEN.address,
    ]

    const pairs = await service.getDepositSwapPairs(
      pools,
      amountsIn,
      tokensIn,
      tokensOut,
    )

    expect(pairs.flatMap((pair) => pair.assets)).toEqual([
      TEST_USDC_TOKEN.address,
      TEST_LNR_USDC_TOKEN.address,
      TEST_BOOSTED_POOL_TOKEN.address,
      TEST_USDT_TOKEN.address,
      TEST_LNR_USDT_TOKEN.address,
      TEST_BOOSTED_POOL_TOKEN.address,

      TEST_CKB_TOKEN.address,
      TEST_LNR_CKB_TOKEN.address,
    ])
  })

  it('BatchSwap withdraw direction BOOSTED_TOKEN -> STANDARD_TOKEN', async () => {
    const investService = mocked(InvestService, true)
    const tradeService = mocked(TradeService, true)
    const batchRelayerService = mocked(BatchRelayerService, true)

    const service = new WeightedBoostedPool(
      investService.mock.instances[0],
      tradeService.mock.instances[0],
      batchRelayerService.mock.instances[0],
    )

    const pool = pools.find(
      (pool) =>
        pool.id ===
        '0x6ea0086d318afe79858097409f848521f2c83ee200010000000000000000001b',
    )

    if (!pool) throw Error('pool not found')

    const amountsIn = [BigNumber.from(10).mul(BigNumber.from(10).pow(18))]

    const tokensOut = [TEST_USDC_TOKEN.address, TEST_USDT_TOKEN.address]

    const tokensIn = [TEST_BOOSTED_POOL_TOKEN.address]

    const pairs = await service.getWithdrawSwapPairs(
      pool,
      pools,
      amountsIn,
      tokensIn,
      tokensOut,
    )

    expect(pairs.flatMap((pair) => pair.assets)).toEqual([
      TEST_BOOSTED_POOL_TOKEN.address,
      TEST_LNR_USDC_TOKEN.address,
      TEST_USDC_TOKEN.address,
      TEST_BOOSTED_POOL_TOKEN.address,
      TEST_LNR_USDT_TOKEN.address,
      TEST_USDT_TOKEN.address,
    ])
  })

  it('BatchSwap withdraw direction STANDARD_TOKEN -> BOOSTED_TOKEN', async () => {
    const investService = mocked(InvestService, true)
    const tradeService = mocked(TradeService, true)
    const batchRelayerService = mocked(BatchRelayerService, true)

    const service = new WeightedBoostedPool(
      investService.mock.instances[0],
      tradeService.mock.instances[0],
      batchRelayerService.mock.instances[0],
    )

    const pool = pools.find(
      (pool) =>
        pool.id ===
        '0x6ea0086d318afe79858097409f848521f2c83ee200010000000000000000001b',
    )

    if (!pool) throw Error('pool not found')

    const amountsIn = [
      BigNumber.from(10).mul(BigNumber.from(10).pow(18)),
      BigNumber.from(10).mul(BigNumber.from(10).pow(18)),
      BigNumber.from(0),
    ]

    const tokensOut = [
      TEST_USDC_TOKEN.address,
      TEST_USDT_TOKEN.address,
      TEST_ETH_TOKEN.address,
      TEST_CKB_TOKEN.address,
    ]

    const tokensIn = [
      TEST_BOOSTED_POOL_TOKEN.address,
      TEST_LNR_ETH_TOKEN.address,
      TEST_LNR_CKB_TOKEN.address,
    ]

    const pairs = await service.getWithdrawSwapPairs(
      pool,
      pools,
      amountsIn,
      tokensIn,
      tokensOut,
    )

    expect(pairs.flatMap((pair) => pair.assets)).toEqual([
      TEST_BOOSTED_POOL_TOKEN.address,
      TEST_LNR_USDC_TOKEN.address,
      TEST_USDC_TOKEN.address,
      TEST_BOOSTED_POOL_TOKEN.address,
      TEST_LNR_USDT_TOKEN.address,
      TEST_USDT_TOKEN.address,
    ])
  })
})
