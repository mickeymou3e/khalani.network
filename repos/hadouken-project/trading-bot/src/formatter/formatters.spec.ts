import { BigNumber } from 'ethers'
import {
  ArbitrageNotificationFormatterService,
  LinearNotificationFormatterService,
  LiquidationFormatterService,
  TransactionReceiptPassedThroughEvent,
} from '../formatter/formatters'
import { FormatterModule } from './formatter.module'
import { Test, TestingModule } from '@nestjs/testing'
import { TokenModule } from '../token/token.module'
import { BalanceFetcherModule } from '../balance-fetcher/balance-fetcher.module'
import { BalanceFetcherService } from '../balance-fetcher/balance-fetcher.service'
import { MainClient } from 'binance'
import { LiquidationProcessTxReceiptEvent } from '../lambdaTypes'
import {
  GODWOKEN_MAINNET_CHAIN_ID,
  GODWOKEN_TESTNET_CHAIN_ID,
} from '../liquidation-fetcher/liquidation-fetcher.constants'
import { NetworkConfigModule } from '../network-config/networkConfig.module'
import { ConfigModule } from '@nestjs/config'

const successTxReceiptMock: TransactionReceiptPassedThroughEvent = {
  status: 1,
  transactionHash:
    '0xc18b54d9b23ebdd59e05847634063e15e81b627b46c6c24d559d0d065313f92c',
  blockHash:
    '0x7b4bfe0eab119fae9bff0f9ce3c300713abc10b9bb9cfc6d646598d36c007928',
  from: '0xa14d06ee65f19ea64548ca2effcc26925823827d',
  to: '0x657cc11c7a06d9d2f7eef5e5af5f23c69d05077e',
  gasUsed: {
    hex: BigNumber.from(100000).toHexString(),
    type: 'BigNumber',
  },
  logs: [
    {
      transactionIndex: 0,
      blockNumber: 384659,
      transactionHash:
        '0x1097b63ac850e7de0eddeb9b17c93fe0ec2d3b4476d97725b4f9da618e4ca916',
      address: '0x4F8BDF24826EbcF649658147756115Ee867b7D63',
      topics: [
        '0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b',
        '0xaea765ef470fd9aa24853bb1ce5f21c6879349c2000200000000000000000002',
        '0x0000000000000000000000007538c85cae4e4673253ffd2568c1f1b48a71558a',
        '0x0000000000000000000000009e858a7aaedf9fdb1026ab1f77f627be2791e98a',
      ],
      data: '0x00000000000000000000000000000000000000000000006ca3b3ca2429fb2242000000000000000000000000000000000000000000000000001049f1969178e0',
      logIndex: 2,
      blockHash:
        '0xb4e1491dc8ef4efb9835a545a423a24c4e79733f10e8460f281485a611aa1f81',
      removed: false,
    },
    {
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x000000000000000000000000657cc11c7a06d9d2f7eef5e5af5f23c69d05077e',
        '0x0000000000000000000000009b8d70b41c0b1e69b739f60151f2d14127ecc165',
      ],
      data: '0x00000000000000000000000000000000000000000000000002f8a305e3e97342',
      transactionIndex: 0,
      blockNumber: 383194,
      transactionHash:
        '0xc18b54d9b23ebdd59e05847634063e15e81b627b46c6c24d559d0d065313f92c',
      address: '0x4F8BDF24826EbcF649658147756115Ee867b7D63',
      logIndex: 2,
      blockHash:
        '0x2e0448a087901f4e9271a9ddd001cb0fb579649d07859c3aa4b56d84b4366478',
      removed: false,
    },
  ],
}

const failedTxReceiptMock: TransactionReceiptPassedThroughEvent = {
  status: 0,
  transactionHash:
    '0xc18b54d9b23ebdd59e05847634063e15e81b627b46c6c24d559d0d065313f92c',
  blockHash:
    '0x7b4bfe0eab119fae9bff0f9ce3c300713abc10b9bb9cfc6d646598d36c007928',
  from: '0xa14d06ee65f19ea64548ca2effcc26925823827d',
  to: '0x657cc11c7a06d9d2f7eef5e5af5f23c69d05077e',
  gasUsed: {
    hex: BigNumber.from(100000).toHexString(),
    type: 'BigNumber',
  },
  logs: [],
}

describe('Arbitrage formatter test', () => {
  let formatter: ArbitrageNotificationFormatterService
  const arbitragePair = {
    poolNameForBuy: 'hadoukenEthCkb',
    poolNameForSell: 'yokaiEthWckb',
    quoteToken: 'CKB',
    baseToken: 'ETH',
    quoteTokenThreshold: BigNumber.from(10).pow(15).toString(),
    minProfit: BigNumber.from(0).toString(),
    chainId: GODWOKEN_MAINNET_CHAIN_ID,
  }
  const quoteAmount = BigNumber.from(100).pow(18).toString()
  const gasPrice = BigNumber.from(1000000000)

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
        TokenModule,
        BalanceFetcherModule,
        FormatterModule,
      ],
      providers: [ArbitrageNotificationFormatterService],
    })
      .overrideProvider(BalanceFetcherService)
      .useValue(balanceFetcherServiceMock)
      .overrideProvider(MainClient)
      .useValue({})
      .compile()

    formatter = module.get<ArbitrageNotificationFormatterService>(
      ArbitrageNotificationFormatterService,
    )
  })

  const balanceFetcherServiceMock = {
    getCkbBalance: jest.fn().mockResolvedValue(BigNumber.from(100).pow(18)),
  }

  it('should return success message', async () => {
    const message = await formatter.getFormattedText(
      successTxReceiptMock,
      arbitragePair,
      quoteAmount,
      gasPrice,
    )

    expect(message).toMatchInlineSnapshot(`
      "✅___________________________✅
      Arbitrage trade executed successfully!

      ***Arbitrage pair***:
      --------------------------------------------------
      Pool for buy: hadoukenEthCkb
      Pool for sell: yokaiEthWckb
      Base token: ETH
      Quote token: CKB
      Min threshold: 0.001000000000000000 CKB
      --------------------------------------------------

      ***Amount***: 1000000000000000000.00 CKB

      ***Gas Used***: 0.00 CKB

      ***Net profit***: 0.21 CKB

      ***Balance after trade***: 1000000000000000000.00 CKB

      Transaction link: https://gwscan.com/tx/0xc18b54d9b23ebdd59e05847634063e15e81b627b46c6c24d559d0d065313f92c
      ___________________________"
    `)
  })

  it('should return failed message', async () => {
    const message = await formatter.getFormattedText(
      failedTxReceiptMock,
      arbitragePair,
      quoteAmount,
      gasPrice,
    )

    expect(message).toMatchInlineSnapshot(`
      "❌___________________________❌
      Arbitrage trade failed :(

      ***Arbitrage pair***:
      --------------------------------------------------
      Pool for buy: hadoukenEthCkb
      Pool for sell: yokaiEthWckb
      Base token: ETH
      Quote token: CKB
      Min threshold: 0.001000000000000000 CKB
      --------------------------------------------------

      ***Amount***: 1000000000000000000.00 CKB

      ***Gas Used***: 0.00 CKB

      ***Balance after trade***: 1000000000000000000.00 CKB

      Transaction link: https://gwscan.com/tx/0xc18b54d9b23ebdd59e05847634063e15e81b627b46c6c24d559d0d065313f92c
      ___________________________"
    `)
  })
})

const linearSuccessTxReceiptMock: TransactionReceiptPassedThroughEvent = {
  status: 1,
  transactionHash:
    '0x5cb4432fe3ca63eb3ce3d2485b1162a449df24d0a4f5db554eabe5ee5079a626',
  blockHash:
    '0x662f3c69d2a74e4ff91df2be6c75fa36cd51abab0d7331544ea4fa55d8524335',
  from: '0x9B8D70b41c0b1E69b739F60151F2D14127eCc165',
  to: '0x54555791a8d377b892F8E1341E051c3F74F7d039',
  gasUsed: {
    hex: BigNumber.from(100000).toHexString(),
    type: 'BigNumber',
  },
  logs: [
    {
      transactionIndex: 0,
      blockNumber: 392291,
      transactionHash:
        '0xf1dcec93901251292980aa1cc448b8324fa0bd826a4febbaff01d2cee1a3f510',
      address: '0x8E019acb11C7d17c26D334901fA2ac41C1f44d50',
      topics: [],
      data: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      logIndex: 23,
      blockHash:
        '0x605094143722b2a786181a4444bf33bc52154cb63922899e5be82924acdadc42',
      removed: false,
    },
    {
      transactionIndex: 0,
      blockNumber: 392291,
      transactionHash:
        '0x5cb4432fe3ca63eb3ce3d2485b1162a449df24d0a4f5db554eabe5ee5079a626',
      address: '0x186181e225dc1Ad85a4A94164232bD261e351C33',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x00000000000000000000000054555791a8d377b892f8e1341e051c3f74f7d039',
        '0x0000000000000000000000004f8bdf24826ebcf649658147756115ee867b7d63',
      ],
      data: '0x000000000000000000000000000000000000000000000000000000107fe9ae2e',
      logIndex: 3,
      blockHash:
        '0x662f3c69d2a74e4ff91df2be6c75fa36cd51abab0d7331544ea4fa55d8524335',
      removed: false,
    },
    {
      transactionIndex: 0,
      blockNumber: 392291,
      transactionHash:
        '0x5cb4432fe3ca63eb3ce3d2485b1162a449df24d0a4f5db554eabe5ee5079a626',
      address: '0x186181e225dc1Ad85a4A94164232bD261e351C33',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x00000000000000000000000054555791a8d377b892f8e1341e051c3f74f7d039',
        '0x0000000000000000000000009b8d70b41c0b1e69b739f60151f2d14127ecc165',
      ],
      data: '0x00000000000000000000000000000000000000000000000000000000004c96a3',
      logIndex: 14,
      blockHash:
        '0x662f3c69d2a74e4ff91df2be6c75fa36cd51abab0d7331544ea4fa55d8524335',
      removed: false,
    },
    {
      transactionIndex: 0,
      blockNumber: 392291,
      transactionHash:
        '0xf1dcec93901251292980aa1cc448b8324fa0bd826a4febbaff01d2cee1a3f510',
      address: '0x8E019acb11C7d17c26D334901fA2ac41C1f44d50',
      topics: [
        '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
        '0x00000000000000000000000043a82dd3e254ddf6ebc504fd522b667e7f84710b',
        '0x0000000000000000000000004f8bdf24826ebcf649658147756115ee867b7d63',
      ],
      data: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      logIndex: 21,
      blockHash:
        '0x605094143722b2a786181a4444bf33bc52154cb63922899e5be82924acdadc42',
      removed: false,
    },
  ],
}

const linearFailedTxReceiptMock: TransactionReceiptPassedThroughEvent = {
  status: 0,
  transactionHash:
    '0x86a575206f2ee718aa2614dee59f9fd2c5250016465ea6c2c81cb6443750bb19',
  blockHash:
    '0x7b4bfe0eab119fae9bff0f9ce3c300713abc10b9bb9cfc6d646598d36c007928',
  from: '0x9B8D70b41c0b1E69b739F60151F2D14127eCc165',
  to: '0x54555791a8d377b892F8E1341E051c3F74F7d039',
  gasUsed: {
    hex: BigNumber.from(100000).toHexString(),
    type: 'BigNumber',
  },
  logs: [],
}

describe('Linear formatter test', () => {
  let formatter: LinearNotificationFormatterService
  const gasPrice = BigNumber.from(1000000000)
  const poolName = 'LinearUSDC'

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
        TokenModule,
        BalanceFetcherModule,
        FormatterModule,
      ],
      providers: [LinearNotificationFormatterService],
    })
      .overrideProvider(BalanceFetcherService)
      .useValue(balanceFetcherServiceMock)
      .overrideProvider(MainClient)
      .useValue({})
      .compile()

    formatter = module.get<LinearNotificationFormatterService>(
      LinearNotificationFormatterService,
    )
  })

  const balanceFetcherServiceMock = {
    getCkbBalance: jest.fn().mockResolvedValue(BigNumber.from(100).pow(18)),
  }

  it('should return success message', async () => {
    const message = await formatter.getFormattedText(
      linearSuccessTxReceiptMock,
      poolName,
      gasPrice,
    )
    expect(message).toMatchInlineSnapshot(`
      "✅___________________________✅
      Linear pool trade executed successfully!

      ***Balancing pool***: LinearUSDC

      ***Operation***: UNWIND

      ***Amount***: 70865.49 USDC

      ***Net profit***: 5.0192 USDC

      ***Gas Used***: 0.00 CKB

      ***Balance after trade***: 1000000000000000000.00 CKB

      Transaction link: https://gwscan.com/tx/0x5cb4432fe3ca63eb3ce3d2485b1162a449df24d0a4f5db554eabe5ee5079a626
      ___________________________"
    `)
  })

  it('should return failed message', async () => {
    const message = await formatter.getFormattedText(
      linearFailedTxReceiptMock,
      poolName,
      gasPrice,
    )
    expect(message).toMatchInlineSnapshot(`
      "❌___________________________❌
      Linear pool trade failed :(

      ***Balancing pool***: LinearUSDC

      ***Gas Used***: 0.00 CKB

      ***Balance after trade***: 1000000000000000000.00 CKB

      Transaction link: https://gwscan.com/tx/0x86a575206f2ee718aa2614dee59f9fd2c5250016465ea6c2c81cb6443750bb19
      ___________________________"
    `)
  })
})

const liquidationTransactionReceiptSuccess: TransactionReceiptPassedThroughEvent =
  {
    status: 1,
    transactionHash:
      '0x5944dbca5dbac4631247f0b3d847b535e3bdfe5ac034030e474d9db8e395168e',
    blockHash:
      '0x5de3e6145922c4781cbcbf49ba0411559ace8a21670d5147dcbf656008346515',
    from: '0x9B8D70b41c0b1E69b739F60151F2D14127eCc165',
    to: '0x54555791a8d377b892F8E1341E051c3F74F7d039',
    gasUsed: {
      hex: BigNumber.from(100000).toHexString(),
      type: 'BigNumber',
    },
    logs: [
      {
        transactionIndex: 0,
        blockNumber: 3600120,
        transactionHash:
          '0x5944dbca5dbac4631247f0b3d847b535e3bdfe5ac034030e474d9db8e395168e',
        address: '0xeD33c193437dBd492b7BEa305398009f04FA25c9',
        topics: [
          '0xd58706648644be277f6999c826f65f98128c29c6846a892b929a304a7f19e3eb',
          '0x0000000000000000000000006529c8a2726b6adc91260e21fa380fa6d34af27f',
        ],
        data: '0x0000000000000000000000000eb76790a2014dd1f65488ccd703bcdf75f8195e0000000000000000000000000c7f21908222098616803eff5d054d3f4ef57ebb0000000000000000000000000000000000000000000069198bce5073c254f7070000000000000000000000000000000000000000000000023c3afff64e88871b',
        logIndex: 43,
        blockHash:
          '0x5de3e6145922c4781cbcbf49ba0411559ace8a21670d5147dcbf656008346515',
        removed: false,
      },
    ],
  }

const liquidationTransactionReceiptError: TransactionReceiptPassedThroughEvent =
  {
    status: 0,
    transactionHash:
      '0x5944dbca5dbac4631247f0b3d847b535e3bdfe5ac034030e474d9db8e395168e',
    blockHash:
      '0x5de3e6145922c4781cbcbf49ba0411559ace8a21670d5147dcbf656008346515',
    from: '0x9B8D70b41c0b1E69b739F60151F2D14127eCc165',
    to: '0x54555791a8d377b892F8E1341E051c3F74F7d039',
    gasUsed: {
      hex: BigNumber.from(100000).toHexString(),
      type: 'BigNumber',
    },
    logs: [],
  }

describe('Liquidation formatter test', () => {
  let formatter: LiquidationFormatterService

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
        NetworkConfigModule.forRoot(GODWOKEN_TESTNET_CHAIN_ID),
        TokenModule,
        FormatterModule,
      ],
      providers: [LiquidationFormatterService],
    })

      .overrideProvider(MainClient)
      .useValue({})
      .compile()

    formatter = module.get<LiquidationFormatterService>(
      LiquidationFormatterService,
    )
  })

  it('should return success message', () => {
    const event: LiquidationProcessTxReceiptEvent = {
      amount: '1000',
      collateralToken: '0x0c7f21908222098616803eff5d054d3f4ef57ebb',
      debtToken: '0x0eb76790a2014dd1f65488ccd703bcdf75f8195e',
      stateName: 'ProcessTxReceipt',
      txReceipt: liquidationTransactionReceiptSuccess,
      userAddress: '0x6529c8a2726b6adc91260e21fa380fa6d34af27f',
      chainId: GODWOKEN_TESTNET_CHAIN_ID,
    }

    const message = formatter.getFormattedText(event)
    expect(message).toMatchInlineSnapshot(`
      "\`\`\`

      Liquidation transaction successful ✅
      --------------------------------------------------
      User address: 0x6529c8a2726b6adc91260e21fa380fa6d34af27f
      Collateral token: USDC
      Debt token: CKB
      Repay amount: 0.000000000000001 CKB
      Profit: 41.233550771688605467 HDK-TriCrypto

      \`\`\`
      Transaction link: https://v1.testnet.gwscan.com/tx/0x5944dbca5dbac4631247f0b3d847b535e3bdfe5ac034030e474d9db8e395168e"
    `)
  })

  it('should return error message', () => {
    const event: LiquidationProcessTxReceiptEvent = {
      amount: '1000',
      collateralToken: '0x0c7f21908222098616803eff5d054d3f4ef57ebb',
      debtToken: '0x0eb76790a2014dd1f65488ccd703bcdf75f8195e',
      stateName: 'ProcessTxReceipt',
      txReceipt: liquidationTransactionReceiptError,
      userAddress: '0x6529c8a2726b6adc91260e21fa380fa6d34af27f',
      chainId: GODWOKEN_TESTNET_CHAIN_ID,
    }

    const message = formatter.getFormattedText(event)
    expect(message).toMatchInlineSnapshot(`
      "\`\`\`

      Liquidation transaction failed ❌
      --------------------------------------------------
      User address: 0x6529c8a2726b6adc91260e21fa380fa6d34af27f
      Collateral token: USDC
      Debt token: CKB
      Repay amount: 0.000000000000001 CKB
      Profit: 0 HDK-TriCrypto

      \`\`\`
      Transaction link: https://v1.testnet.gwscan.com/tx/0x5944dbca5dbac4631247f0b3d847b535e3bdfe5ac034030e474d9db8e395168e"
    `)
  })
})
