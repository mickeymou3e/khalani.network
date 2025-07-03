/* eslint-disable */
import { binanceEntrypoint } from './lambdaEntrypoint'
import { Context } from 'aws-lambda'
import { GODWOKEN_MAINNET_CHAIN_ID } from './liquidation-fetcher/liquidation-fetcher.constants'

async function main() {
  await binanceEntrypoint(
    {
      stateName: 'FindOpportunity',
      poolNameForBuy: 'hadoukenUsdtCkb',
      poolNameForSell: 'binanceCKBUSDT',
      baseTokenSymbol: 'CKB',
      quoteTokenSymbol: 'USDT',
      quoteTokenThreshold: '10000000',
      minProfit: '500000',
      chainId: GODWOKEN_MAINNET_CHAIN_ID,
      subgraphBlocksBehind: 0,
    },
    {} as Context,
    () => null,
  )
}

main()
