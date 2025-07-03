/* eslint-disable */
import { Context } from 'aws-lambda'
import { BigNumber } from 'ethers'
import {
  arbitrageEntrypoint,
  liquidationLambdaHandler,
} from './lambdaEntrypoint'
import {
  GODWOKEN_MAINNET_CHAIN_ID,
  GODWOKEN_TESTNET_CHAIN_ID,
  MANTLE_TESTNET_CHAIN_ID,
  ZKSYNC_TESTNET_CHAIN_ID,
} from './liquidation-fetcher/liquidation-fetcher.constants'

const pairs = [
  'CKB-USDC',
  'CKB-USDT',
  'CKB-ETH',
  'CKB-WBTC|eth',
  'USDC-CKB',
  'USDC-ETH',
  'USDC-WBTC|eth',
  'WBTC|eth-CKB',
  'WBTC|eth-USDC',
  'ETH-USDC',
  'ETH-CKB',
  'USDT-CKB',
]
const inputs = {
  CKB: {
    from: BigNumber.from(10).pow(18).mul(2202),
    to: BigNumber.from(10).pow(18).mul(220200),
    step: BigNumber.from(10).pow(18).mul(2202),
  },
  USDC: {
    from: BigNumber.from(10).pow(6).mul(9),
    to: BigNumber.from(10).pow(6).mul(900),
    step: BigNumber.from(10).pow(6).mul(9),
  },
  USDT: {
    from: BigNumber.from(10).pow(6).mul(9),
    to: BigNumber.from(10).pow(6).mul(900),
    step: BigNumber.from(10).pow(6).mul(9),
  },
  ETH: {
    from: BigNumber.from(10).pow(15).mul(5),
    to: BigNumber.from(10).pow(15).mul(500),
    step: BigNumber.from(10).pow(15).mul(5),
  },
  'WBTC|eth': {
    from: BigNumber.from(10).pow(3).mul(33),
    to: BigNumber.from(10).pow(3).mul(3300),
    step: BigNumber.from(10).pow(3).mul(33),
  },
}

// async function main() {
//   const receipt = await arbitrageEntrypoint(
//     {
//       stateName: 'CalculateTradeVolume',
//       subgraphBlocksBehind: 0,
//       chainId: GODWOKEN_MAINNET_CHAIN_ID,
//       arbitragePair: {
//         poolNameForSell: 'hadoukenUsdcCkb',
//         poolNameForBuy: 'yokaiUsdcWckb',
//         baseToken: 'USDC',
//         quoteToken: 'CKB',
//         quoteTokenThreshold: '1000000000000000000000',
//         minProfit: '45000000000000000000',
//       },
//     },
//     {} as Context,
//     () => null,
//   )
// }

async function main() {
  const findUser = await liquidationLambdaHandler(
    {
      stateName: 'FindUserToLiquidate',
      chainId: GODWOKEN_TESTNET_CHAIN_ID,
    },
    {} as Context,
    () => null,
  )
  console.log({ findUser })
  if (findUser) {
    const txReceipt = await liquidationLambdaHandler(
      {
        stateName: 'LiquidateUser',
        chainId: GODWOKEN_TESTNET_CHAIN_ID,
        ...findUser,
      },
      {} as Context,
      () => null,
    )
    console.log(txReceipt)
  }
}
main()
